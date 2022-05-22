const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinaryName = "dvvroi2xd"; //it must be in dotenv file
const cloudinaryKey = "753126187843578"; //it must be in dotenv file
const cloudinarySecret = "UlKBAv4MQ9L5Ju-YxXwrErRfPDI"; //it must be in dotenv file

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Superheroes",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
