import cloudinary from 'cloudinary';
import { IMedia } from "./media.dto";
import MediaSchema from "./media.schema";



export const uploadMedia = async (file: any, userId: string): Promise<IMedia> => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  // Upload file to Cloudinary
  const uploadStream = cloudinary.v2.uploader.upload_stream(
    { resource_type: "auto" },
    async (error, result) => {
      if (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`);
      }

      if(!result){
        throw new Error(`Result not found`);
      }

      // Save media information in the database
      const newMedia = new MediaSchema({
        url: result.secure_url,
        publicId: result.public_id,
        type: mimetype.split('/')[0], // image, video, audio, file
        fileName: filename,
        fileSize: result.bytes,
        uploadedAt: new Date(),
        user: userId,
      });

      await newMedia.save();
      return newMedia;
    }
  );

  createReadStream().pipe(uploadStream);
  return new Promise<IMedia>((resolve, reject) => {
    uploadStream.on('finish', () => {
      resolve(newMedia);
    });
    uploadStream.on('error', reject);
  });
};
