import express from 'express';
import * as BoardAPI from '../controllers/board.js';

const downloadRouter = express.Router();

//  db에서 엑셀 데이터를 찾아 json 으로 전송
downloadRouter.get('/:id', BoardAPI.getExcelData);

export default downloadRouter;
