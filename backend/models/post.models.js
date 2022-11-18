import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: String,
  author: { type: String, required: true },
  companyCode: { type: String, required: true },
  orgFileName: [String], // 원본 파일 이름
  saveFileName: [String], // 저장되는 파일 이름
  category: {
    type: String,
    enum: ['notice', 'data', 'result', 'etc'],
    default: 'etc',
  },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

// category 별 게시판 불러오기
postSchema.statics.findByCategory = function (category) {
  return this.find({ category });
};

// id에 해당하는 게시글 세부 조회
postSchema.statics.findByPostId = async function (id) {
  let post = await this.findById(id);
  post.views++;
  post.save();
  return post;
};

const Post = mongoose.model('Post', postSchema);

export default Post;
