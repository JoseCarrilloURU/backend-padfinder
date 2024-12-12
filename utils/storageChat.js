import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [/^image\/.*/, /^audio\/.*/];

    const isMimeTypeValid = allowedMimeTypes.some((regex) =>
      regex.test(file.mimetype),
    );

    if (isMimeTypeValid) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and image files are allowed'), false);
    }
  },
});

export default upload.single('file');
