import Event from "../models/event.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
// ------------------- GET EVENTS -------------------
export const getEvent = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 })
      .lean();

    const eventsWithCount = events.map(event => ({
      ...event,
      // Calculate count based on the fetched array's length
      interestCount: Array.isArray(event.interestedUsers) ? event.interestedUsers.length : 0,
      // Ensure interestedUsers is always an array
      interestedUsers: Array.isArray(event.interestedUsers) ? event.interestedUsers : [],
      type: "event" // Keep your type field if needed elsewhere
    }));
    eventsWithCount.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(eventsWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------- CREATE EVENT -------------------
export const createEvent = async (req, res) => {
  console.time('createEvent_total'); // <-- Start timing total function

  try {
    const { title, description, date, registrationLink, isCompulsory } = req.body;
    const attachmentFile = req.file; // File is already uploaded by middleware
    const userId = req.user.id;

    // Log if file was uploaded by middleware
    if (attachmentFile) {
     console.log(`[createEvent] Middleware uploaded file. Path: ${attachmentFile.path}`);
    } else {
      console.log('[createEvent] No file was uploaded.');
    }

    // --- Validation ---
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return res.status(400).json({ error: "Event title is required" });
    if (trimmedTitle.length > 100) return res.status(400).json({ error: "Title too long (max 100 characters)" });

    const trimmedDesc = description?.trim() || "";
    if (trimmedDesc.length > 1000) return res.status(400).json({ error: "Description too long (max 1000 characters)" });

    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Valid event date is required" });
    }
    if (registrationLink && !registrationLink.startsWith('http')) {
       return res.status(400).json({ error: "Registration link must be a valid URL" });
    }
    // --- End Validation ---

    console.time('event_create_db'); // <-- Start timing DB create
    const event = await Event.create({
      title: trimmedTitle,
      description: trimmedDesc,
      date: new Date(date),
      createdBy: userId,
      media: attachmentFile?.path || null,
      mediaPublicId: attachmentFile?.filename || null,
      registrationLink: registrationLink || null,
      isCompulsory: isCompulsory==='true',
    });
    console.timeEnd('event_create_db'); // <-- End timing DB create

    console.time('event_populate_db'); // <-- Start timing populate
    // Populate createdBy before sending back
    await event.populate('createdBy', 'name role');
    console.timeEnd('event_populate_db'); // <-- End timing populate

    res.status(201).json(event);

  } catch (err) {
    console.error("Create Event Error:", err.message); // Log error message
    console.error("Stack trace:", err.stack); // Log stack trace
    res.status(500).json({ error: err.message || 'Server error creating event.' });
  } finally {
    console.timeEnd('createEvent_total'); // <-- End timing total function
  }
};
// ------------------- UPDATE EVENT -------------------
export const updateEvent = async (req, res) => {
  console.time('updateEvent_total'); // <-- Start timing total function

  try {
    const { id } = req.params;
    const { title, description, date, registrationLink, isCompulsory } = req.body;
    const attachmentFile = req.file; // File is already uploaded by middleware
    const userId = req.user.id;
    const userRole = req.user.role;

    // --- Validation ---
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID format.' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // --- Authorization ---
    if (event.createdBy.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // --- Empty Update Validation ---
    // Check if any fields were *actually* sent in the body
    const hasBodyUpdate = title !== undefined ||
      description !== undefined ||
      date !== undefined ||
      registrationLink !== undefined ||
      isCompulsory !== undefined;

    if (!hasBodyUpdate && !attachmentFile) {
      return res.status(400).json({ error: "At least one field or a new banner is required to update" });
    }

    // --- Field-specific Validation ---
    const trimmedTitle = title?.trim();
    const trimmedDesc = description?.trim();

    if (trimmedTitle && trimmedTitle.length > 100) {
      return res.status(400).json({ error: "Title too long (max 100 characters)" });
    }
    if (trimmedDesc && trimmedDesc.length > 1000) {
      return res.status(400).json({ error: "Description too long (max 1000 characters)" });
    }
    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }
    // Check for link *if it's not an empty string*
    if (registrationLink && 
        !registrationLink.startsWith('http://') && 
        !registrationLink.startsWith('https://')) {
      return res.status(400).json({ error: "Registration link must be a valid URL (starting with http:// or https://)" });
    }
    // --- End Validation ---


    // --- Update fields ---
    let oldMediaPublicId = null; // To store old ID for deletion

    // Use '!== undefined' to allow setting empty strings ""
    if (title !== undefined) {
      event.title = trimmedTitle;
    }
    if (description !== undefined) {
      event.description = trimmedDesc;
    }
    if (date) { // This is fine, if date is "" or null, it's falsy
      event.date = new Date(date);
    }
    if (registrationLink !== undefined) {
      event.registrationLink = registrationLink;
    }
    if (isCompulsory !== undefined) {
      // Robust check for both string 'true' (from form-data) and boolean true (from JSON)
      event.isCompulsory = (isCompulsory === 'true' || isCompulsory === true);
    }

    if (attachmentFile) {
      // Store old ID before overwriting
      if (event.mediaPublicId) {
        oldMediaPublicId = event.mediaPublicId;
      }
      event.media = attachmentFile.path;
      event.mediaPublicId = attachmentFile.filename;
    }
    // --- End Update fields ---


    console.time('event_update_db_save');
    const savedEvent = await event.save(); // Capture the saved document
    console.timeEnd('event_update_db_save');

    // --- Optional: Delete old Cloudinary file AFTER successful DB save ---
    if (oldMediaPublicId) {
      console.log(`[updateEvent] Deleting old Cloudinary file: ${oldMediaPublicId}`);
      console.time('cloudinary_delete');
      try {
        // No 'await' here, let it run in the background.
        // We don't need to make the user wait for this.
        cloudinary.uploader.destroy(oldMediaPublicId, (error, result) => {
          if (error) {
            console.warn("[updateEvent] Background failed to delete old media:", error.message);
          }
          console.timeEnd('cloudinary_delete');
        });
      } catch (deleteErr) {
        // This catch is for sync errors in *starting* the destroy call
        console.warn("[updateEvent] Failed to start media deletion:", deleteErr.message);
        console.timeEnd('cloudinary_delete'); // End timer even on error
      }
    }
    // --- End Optional Deletion ---

    console.time('event_populate_db');
    // Populate the document that was returned from save()
    const populatedEvent = await savedEvent.populate('createdBy', 'name role');
    console.timeEnd('event_populate_db');

    res.json(populatedEvent);

  } catch (err) {
    console.error("Update Event Error:", err.message);
    console.error("Stack trace:", err.stack);
    // Clean up uploaded file if the update fails *before* DB save
    if (req.file) {
      console.warn(`[updateEvent] Rolling back Cloudinary upload: ${req.file.filename}`);
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (rollbackErr) {
        console.error("[updateEvent] Failed to rollback upload:", rollbackErr.message);
      }
    }
    res.status(500).json({ error: err.message || 'Server error updating event.' });
  } finally {
    console.timeEnd('updateEvent_total');
  }
};

// ------------------- DELETE EVENT -------------------
export const deleteEvent = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format.' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Authorization check
    if (event.createdBy.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete media from Cloudinary (optional but recommended)
    if (event.mediaPublicId) {
      try {
        await cloudinary.uploader.destroy(event.mediaPublicId);
        console.log(`[deleteEvent] Successfully deleted media ${event.mediaPublicId} from Cloudinary.`);
      } catch (err) {
        console.warn("[deleteEvent] Failed to delete media:", err.message);
      }
    }

    // --- Delete the Event ---
    await Event.findByIdAndDelete(eventId);
    console.log(`[deleteEvent] Successfully deleted event ${eventId}.`);

    // --- REMOVED User.updateMany step ---

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    console.error("Delete Event Error:", err);
    res.status(500).json({ error: err.message || 'Server error deleting event.' });
  }
};

export const toggleInterest = async (req, res) => {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id; // User ID from authMiddleware

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID format.' });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Ensure interestedUsers exists and is an array (for older docs)
    if (!Array.isArray(event.interestedUsers)) {
        event.interestedUsers = [];
    }

    const isAlreadyInterested = event.interestedUsers.some(
      (interestedUserId) => interestedUserId.equals(userId)
    );

    let updatedEvent;

    // --- Add-Only Logic ---
    if (!isAlreadyInterested) {
      // console.log(`[toggleInterest] Adding user ${userId} interest to event ${eventId}`);
      // Use $addToSet to add user ID to the event's array
      updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $addToSet: { interestedUsers: userId } },
        { new: true } // Return the updated document
      ) // Use lean for plain object response

       if (!updatedEvent) {
         return res.status(404).json({ message: 'Event not found during update.' });
       }
      //  console.log(`[toggleInterest] Event ${eventId} updated. New interestedUsers count: ${updatedEvent.interestedUsers?.length || 0}`);

    } else {
      // console.log(`[toggleInterest] User ${userId} already interested in event ${eventId}. No changes made.`);
      // If already interested, just return the current event state
      updatedEvent = event.toObject(); // Convert Mongoose doc to plain object
    }
    // --- End Add-Only Logic ---

    // Return the relevant parts of the updated event
    res.status(200).json({
        _id: updatedEvent._id,
        // Calculate count from the array length
        interestCount: updatedEvent.interestedUsers?.length || 0,
        interestedUsers: updatedEvent.interestedUsers || [] // Send the updated array
    });

  } catch (error) {
    console.error("Error toggling interest:", error);
    res.status(500).json({ message: 'Server error toggling interest.' });
  }
};

