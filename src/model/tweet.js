import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    originId: String,
    content: String,
    destURL: String,
    originCreatedAt: Date,
    userId: String,
    userName: String
  },
  {
    timestamps: true
  }
);

const Tweet = mongoose.model("Tweet", schema);

export default Tweet;
