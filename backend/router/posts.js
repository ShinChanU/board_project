const router = require('express').Router();
let Post = require('../models/post.models');
let XlsxFile = require('../models/xlsxFile.models');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const iconv = require('iconv-lite');

const userAuthority = {
  // userType별 권한 부여
  admin: {
    notice: ['c', 'r', 'u', 'd'], // 공지사항
    data: ['r', 'd'], // 매출액 자료
    result: ['c', 'r', 'u', 'd'], // 자료 취합 파일
    etc: ['c', 'r', 'u', 'd'], // 기타, 자유
  },
  top: {
    notice: ['r'],
    data: ['c', 'r', 'u', 'd'],
    result: ['r'],
    etc: ['c', 'r', 'u', 'd'],
  },
  user: {
    notice: ['r'],
    data: ['r'],
    result: ['r'],
    etc: ['c', 'r', 'u', 'd'],
  },
};

const checkAuthority = (userType, category, crudType) => {
  return userAuthority[userType][category].includes(crudType);
};

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

// 게시글 타입별 조회(공지, 게시글, 기타)
router.route('/:category').get((req, res) => {
  const resJwt = checkJwt(res);
  if (resJwt) {
    const { userType } = resJwt;
    if (userType) {
      Post.find({ category: req.params.category })
        .then((posts) => res.json(posts))
        .catch((err) => res.status(400).json('Error: ' + err));
    } else {
      res.status(401).json('인증된 사용자가 아닙니다.');
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

// 게시글 생성(모든 타입에 해당)
router.route('/').post((req, res) => {
  const resJwt = checkJwt(res);
  if (!resJwt) {
    res.status(401).send({
      message: 'user 정보가 없습니다.',
    });
    return;
  }

  const { username, companyCode, userType } = resJwt;

  let reqOrgFiles = [];
  let reqSaveFiles = [];
  try {
    upload(req, res, async function (err) {
      if (err)
        return res.status(400).send({
          message: err.message,
          files: reqSaveFiles,
        });
      if (req.files) {
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
      }

      const { title, body, category } = JSON.parse(req.body.data);
      if (!title) {
        res.status(400).send({
          message: '제목이 없습니다.',
        });
        return;
      }
      if (!category) {
        res.status(400).send({
          message: '카테고리가 없습니다.',
        });
        return;
      }

      if (!checkAuthority(userType, category, 'c')) {
        res.status(401).send({
          message: '권한이 없습니다.',
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
        category,
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

// 게시글 세부 조회 (카테고리, id로 접근)
router.route('/:category/:id').get((req, res) => {
  const resJwt = checkJwt(res);
  if (!resJwt) {
    res.status(401).send({
      message: 'user 정보가 없습니다.',
    });
    return;
  }

  Post.findById(req.params.id)
    .then((post) => {
      post.views++;
      post.save();
      return res.json(post);
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// 게시글 삭제 (자기것만, 관리자 제외)
router.route('/:id').delete((req, res) => {
  const resJwt = checkJwt(res);
  if (!resJwt) {
    res.status(401).send({
      message: 'user 정보가 없습니다.',
    });
    return;
  }
  const { id } = req.params;
  const { username } = resJwt;
  if (username === 'admin') {
    Post.findByIdAndDelete(id)
      .then(() => res.json('Post deleted.'))
      .catch((err) => res.status(400).json('Error: ' + err));
    return;
  } else {
    Post.findById(id)
      .then((post) => {
        if (post.author === username) {
          Post.findByIdAndDelete(id)
            .then(() => res.json('Post deleted.'))
            .catch((err) => res.status(400).json('Error: ' + err));
        } else {
          res.status(401).send({
            message: '권한이 없습니다.',
          });
          return;
        }
      })
      .catch((err) => res.status(400).json('Error: ' + err));
    return;
  }
});

// 게시글 수정 (자기 것만, admin은 제외)
router.route('/:id').post((req, res) => {
  const resJwt = checkJwt(res);
  if (!resJwt) {
    res.status(401).send({
      message: 'user 정보가 없습니다.',
    });
    return;
  }
  const { username, userType } = resJwt;
  let reqOrgFiles = [];
  let reqSaveFiles = [];

  try {
    upload(req, res, async function (err) {
      if (err)
        return res.status(400).send({
          message: err.message,
          files: reqSaveFiles,
        });
      if (req.files) {
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
      }
      if (!req.body.data) {
        res.status(400).send({
          message: '잘못된 데이터 요청입니다.',
        });
      }
      const { title, body, category } = JSON.parse(req.body.data);
      if (!title) {
        res.status(400).send({
          message: '제목이 없습니다.',
        });
        return;
      }
      if (!category) {
        res.status(400).send({
          message: '카테고리가 없습니다.',
        });
        return;
      }

      if (!checkAuthority(userType, category, 'u')) {
        res.status(401).send({
          message: '권한이 없습니다.',
        });
        return;
      }

      Post.findById(req.params.id)
        .then((post) => {
          if (username !== 'admin' && username !== post.author) {
            res.status(401).send({
              message: '권한이 없습니다.',
            });
            return;
          }

          post.title = title;
          post.body = body;
          post.orgFileName = reqOrgFiles;
          post.saveFileName = reqSaveFiles;
          post.category = category;
          post.updatedAt = getCurrentDate();
          post
            .save()
            .then(() =>
              res.status(200).send({
                message: '업데이트 완료!',
              }),
            )
            .catch((err) => res.status(400).json('Error: ' + err));
        })
        .catch((err) => res.status(400).json('Error: ' + err));
    });
  } catch (e) {
    res.status(500).send({
      message: `업데이트 하지 못했습니다. ${e}`,
    });
    return;
  }
});

module.exports = router;
