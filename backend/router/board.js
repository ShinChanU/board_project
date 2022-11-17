import express from 'express';
import * as BoardAPI from '../controllers/board';

const boardRouter = express.Router();

// 게시글 타입별 조회(공지, 게시글, 기타)
boardRouter.get('/:category', BoardAPI.getAllBoardPosts);

// 게시글 세부 조회 (카테고리, id로 접근)
boardRouter.get('/:category/:id', BoardAPI.getDetailBoardPosts);

// 게시글 생성(모든 타입에 해당)
boardRouter.post('/', BoardAPI.createBoardPosts);

// 게시글 삭제 (자기것만, 관리자 제외)
boardRouter.delete('/:category/:id', BoardAPI.deleteBoardPosts);

// 게시글 수정 (자기 것만, admin은 제외)
boardRouter.post('/:category/:id', BoardAPI.updateBoardPosts);

//  db에서 엑셀 데이터를 찾아 json 으로 전송
boardRouter.get('/download/:id', BoardAPI.getDetailBoardPosts);

//  db에서 취합 자료 생성 후 전송
boardRouter.get('/download/result/:date', BoardAPI.getDetailBoardPosts);

export default boardRouter;
