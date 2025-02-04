import mongoose from 'mongoose';

const socialMediaUserSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
  name: { type: String, required: true },
  facebookId: { type: String, required: true },
  profilePic: { type: String },
  cloudinaryProfilePic: { type: String },
  type: { type: String, enum: ['follower', 'following'] },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('SocialMediaUser', socialMediaUserSchema);
