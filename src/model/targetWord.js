import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    word: String,
    monitoring: Boolean
  },
  {
    timestamps: true
  }
);

const TargetWord = mongoose.model("TargetWord", schema);

export default TargetWord;
