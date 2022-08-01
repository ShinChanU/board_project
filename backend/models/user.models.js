const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  companyCode: String,
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

UserSchema.statics.findByUsername = function (username) {
  console.log("Test, ", username);
  return this.findOne({ username });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
