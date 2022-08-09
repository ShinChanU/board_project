const router = require('express').Router();
let Post = require('../models/post.models');
let XlsxFile = require('../models/xlsxFile.models');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const iconv = require('iconv-lite');

// 엑셀 업로드 미들웨어
const upload = multer({
  dest: 'upload/',
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls')
      return callback(new Error('엑셀파일만 첨부가능합니다.'));
    callback(null, true);
  },
}).any();

// 한국 날짜 저장 함수
const getCurrentDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let today = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds),
  );
};

// 토큰 정보 검증
const checkJwt = (res) => {
  const { user } = res;
  if (!user) return 0;
  return user;
};

// userType별 게시글 조회
router.route('/').get((req, res) => {
  const resJwt = checkJwt(res);
  if (resJwt) {
    const { userType, companyCode } = resJwt;
    if (userType === 'top') {
      // 전체 게시글 조회: 최상위 회사
      Post.find()
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json('Error: ' + err));
    } else if (userType === 'user') {
      // 본인 회사만 조회
      Post.find({ companyCode: companyCode })
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json('Error: ' + err));
    } else {
      res.status(401).json('Type Error');
      return 0;
    }
  }
  return 0;
});

//  db에서 엑셀 데이터를 찾아 json 으로 전송
router.route('/download/:id').get(async (req, res) => {
  XlsxFile.find({ fileName: req.params.id })
    .then((file) => {
      return res.status(200).json({
        data: file[0].data,
      });
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// 게시글 생성(공지사항)
router.route('/').post((req, res) => {
  const resJwt = checkJwt(res);
  if (!resJwt) {
    res.status(401).send({
      message: 'user 정보가 없습니다.',
    });
    return;
  }

  const { username, companyCode } = resJwt;

  let reqOrgFiles = [];
  let reqSaveFiles = [];
  try {
    upload(req, res, async function (err) {
      if (err)
        return res.status(400).send({
          message: err.message,
          files: reqSaveFiles,
        });
      for (let i = 0; i < req.files.length; i++) {
        let path = req.files[i].path;
        let workbook = XLSX.readFile(path);
        let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);
        if (jsonData.length === 0) {
          return res.status(400).json({
            success: false,
            message: '엑셀에 데이터가 존재하지않습니다.',
          });
        }
        const xlsxFile = new XlsxFile({
          fileName: req.files[i].filename,
          data: jsonData,
        });
        xlsxFile.save();
        let fileName = iconv.decode(req.files[i].originalname, 'utf-8');

        reqSaveFiles.push(req.files[i].filename);
        reqOrgFiles.push(fileName);
      }
      const { title, body } = JSON.parse(req.body.data);
      if (!title) {
        res.status(400).send({
          message: '제목이 없습니다.',
          files: reqSaveFiles,
        });
        return;
      }
      const post = new Post({
        title,
        body,
        author: username,
        companyCode,
        orgFileName: reqOrgFiles,
        saveFileName: reqSaveFiles,
        createdAt: getCurrentDate(),
      });
      post.save();
      res.status(200).send({
        message: '업로드 완료!',
        files: reqSaveFiles,
      });
    });
  } catch (e) {
    res.status(500).send({
      message: `업로드 하지 못했습니다. ${e}`,
      files: reqSaveFiles,
    });
    return;
  }
});

// 게시글 조회
router.route('/:id').get((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.views++;
      post.save();
      return res.json(post);
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// 게시글 삭제
router.route('/:id').delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json('Post deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// 게시글 수정
router.route('/:id').post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.title = req.body.title;
      post.body = req.body.body;

      post
        .save()
        .then(() => res.json('post updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
