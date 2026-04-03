import multer from "multer";

function fileFilter(req, file, cb) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPG, PNG, WEBP, and GIF images are allowed"));
    }

    cb(null, true);
}

const uploadProfileImage = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});

export default uploadProfileImage;
