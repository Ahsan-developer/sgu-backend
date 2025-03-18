import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_ENDPOINT,
} = process.env;

if (
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !AWS_REGION ||
  !AWS_S3_BUCKET
) {
  throw new Error(
    "Missing AWS environment variables. Please check your .env file."
  );
}

// Initialize AWS S3Client with endpoint
const s3Client = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
  // endpoint: `https://s3.${AWS_REGION}.amazonaws.com`,
  endpoint: `https://sgu-mobile-bucket.s3.ap-southeast-2.amazonaws.com/`,
  forcePathStyle: true, // Needed for some S3-compatible services
});

// Set up multer storage with multer-s3
const storage = multerS3({
  s3: s3Client,
  bucket: AWS_S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, `uploads/${fileName}`);
  },
});

// File filter to allow only image uploads (jpeg, jpg, png)
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png)"));
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
