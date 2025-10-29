import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary storage
export const cloudinaryParser = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,            // dynamic folder
      allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "pdf", "docx", "pptx", "webp"],
    },
  });

  return multer ({storage});
}
