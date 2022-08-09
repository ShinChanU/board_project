const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: String,
  author: { type: String, required: true },
  companyCode: { type: String, required: true },
  orgFileName: [String], // 원본 파일 이름
  saveFileName: [String], // 저장되는 파일 이름
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
