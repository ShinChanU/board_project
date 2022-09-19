import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const xlsxFile = new Schema({
  fileName: String,
  data: [Object],
});

const XlsxFile = mongoose.model('XlsxFile', xlsxFile);

export default XlsxFile;
