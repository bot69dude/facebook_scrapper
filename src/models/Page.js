import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  acebookId: { 
    type: String, 
    default: 'N/A',
  }, 
  profilePic: { type: String },
  cloudinaryProfilePic: { type: String },
  email: { type: String },
  website: { type: String },
  category: { type: String },
  totalFollowers: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  creationDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model("Page", pageSchema);