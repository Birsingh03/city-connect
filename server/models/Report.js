import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["potholes", "Road Damage", "Garbage", "Streetlights", "others"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    imageUrl: {
      type: String
    },

    imageId: {
      type: String
    },

    location: {
      lat: Number,
      lng: Number
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }

  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;