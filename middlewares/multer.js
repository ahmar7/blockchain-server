const multer = require("multer");

const storage = multer.memoryStorage();
const singleUpload = multer({ storage }).any("image");

module.exports = singleUpload;
