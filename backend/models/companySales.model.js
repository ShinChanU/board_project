const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const salesSchema = new Schema({
  year: { type: Number, required: true }, // 년도
  month: { type: Number, required: true }, // 월
  revenue: { type: Number, required: true }, // 매출액
  operatingIncome: { type: Number, required: true }, // 영업이익
  netIncome: { type: Number, required: true }, // 순이익
});

const companySalesSchema = new Schema({
  companyCode: { type: Number, required: true }, // 회사코드
  companyName: { type: String, required: true }, // 회사이름
  sales: [salesSchema],
});

const CompanySales = mongoose.model('CompanySales', companySalesSchema);

module.exports = CompanySales;
