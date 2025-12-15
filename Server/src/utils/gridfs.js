// Server/src/utils/gridfs.js
import mongoose from "mongoose";

let gridfsBucket;

export const initGridFS = (connection) => {
  if (!connection || gridfsBucket) return;

  gridfsBucket = new mongoose.mongo.GridFSBucket(
    connection.db,
    { bucketName: "uploads" }
  );

  console.log("GridFS initialized");
};

export const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error("GridFSBucket not initialized");
  }
  return gridfsBucket;
};
