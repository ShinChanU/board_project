const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  companyCode: { type: String, required: true },
  realName: { type: String, required: true },
  userType: {
    type: String,
    enum: ['user', 'top'],
    default: 'user',
  },
});

// 비밀번호 해쉬값으로 설정
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

// 비밀번호 확인
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

// 반환 데이터에서 비밀번호 삭제
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.password;
  return data;
};

//
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      username: this.username,
      companyCode: this.companyCode,
      userType: this.userType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

// 아이디 찾기
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
