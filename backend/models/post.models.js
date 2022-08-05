const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bodySchema = new Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  revenue: { type: String, required: true }, // 매출액
  operatingIncome: { type: String, required: true }, // 영업이익
  netIncome: { type: String, required: true }, // 순이익
});

const postSchema = new Schema({
  title: { type: String, required: true },
  body: bodySchema,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  companyCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
