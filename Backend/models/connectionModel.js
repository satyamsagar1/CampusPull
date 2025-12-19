import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
    requester:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:{ 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'], 
        default: 'pending' 
    },
    note: { 
        type: String, 
        maxlength: 500, // Good practice to limit length
        trim: true 
    }
}, { timestamps: true });

export default mongoose.model('Connection', connectionSchema);