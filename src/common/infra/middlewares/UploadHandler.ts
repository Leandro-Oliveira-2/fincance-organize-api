import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import mime from 'mime';

import StorageConfig from '@config/StorageConfig';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, StorageConfig.local.tempFolder);
  },
  filename(req, file, cb) {
    console.log(file);
    const ext = mime.getExtension(file.mimetype);
    cb(null, `${uuidv4()}.${ext}`);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: 50000000, files: 1 },
});

export default uploader;
