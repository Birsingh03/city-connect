import Report from "../models/Report.js";
import { uploadOnCloudinary } from "../uploads/cloudinaryUpload.js";
import fs from "fs";

export const submitReport = async (req, res) => {
  try {

    const { title, category, description, location } = req.body;

    // basic validation
    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const allowedCategories = [
      "potholes",
      "Road Damage",
      "Garbage",
      "Streetlights",
      "others"
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    let imageUrl = null;
    let imageId = null;

    if (req.file) {

      const result = await uploadOnCloudinary(req.file.path);

      if (result) {
        imageUrl = result.secure_url;
        imageId = result.public_id;
      }

      fs.unlinkSync(req.file.path); // delete local file
    }

    const parsedLocation = JSON.parse(location);

    const report = await Report.create({
      title,
      category,
      description,
      imageUrl,
      imageId,
      location: {
        lat: parsedLocation.lat,
        lng: parsedLocation.lng
      },
      reportedBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      data: report
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};