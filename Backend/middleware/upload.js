import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


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
