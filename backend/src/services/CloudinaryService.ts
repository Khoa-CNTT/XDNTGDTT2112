// Purpose: Service for uploading images to Cloudinary.
import { v2 as cloudinary } from 'cloudinary';

// Import the Cloudinary configuration:
import { cloudinaryConfig } from '../configs/cloudinaryConfig.js';

// serverResponse
import serverResponse from '../utils/helpers/responses.js';

// Messages
import messages from '../configs/messagesConfig.js';

// configure a new instance of Cloudinary:
cloudinary.config(cloudinaryConfig);

const CloudinaryService = {
  uploadFile: async (
    file: Express.Multer.File,
    type: 'image' | 'video' | 'subtitles'
  ) => {
    const opts = {
      image: {
        resource_type: 'image',
        folder: 'images',
      },
      video: {
        resource_type: 'video',
        folder: 'videos',
      },
      subtitles: {
        resource_type: 'raw',
        folder: 'subtitles',
      },
    };
    try {
      const uploadResult = await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: opts[type].resource_type as
                | 'image'
                | 'video'
                | 'raw',
              folder: opts[type].folder,
              format: type === 'subtitles' ? 'vtt' : undefined,
              // type: "authenticated",
              // access_control: {
              //     access_type: "token"
              // }
            },
            (error, uploadResult) => {
              console.error(error);
              if (error) {
                throw serverResponse.createError({
                  ...messages.UPLOAD_FAILED,
                });
              }
              return resolve(uploadResult);
            }
          )
          .end(file.buffer);
      });

      // const r = cloudinary.image("sample.jpg", {
      //     type: "authenticated",
      //     auth_token: {key: "MyKey", duration: 300},
      //     sign_url: true,

      // });

      return uploadResult;
    } catch (error) {
      throw serverResponse.createError({
        ...messages.UPLOAD_FAILED,
      });
    }
  },
};

export default CloudinaryService;
