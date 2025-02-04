import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
  content: { type: String },
  imageUrl: { type: String },
  cloudinaryImageUrl: { type: String },
  likes: { type: Number },
  shares: { type: Number },
  comments: [{
    content: { type: String },
    author: { type: String },
    date: { type: Date }
  }],
  postDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Post', postSchema);