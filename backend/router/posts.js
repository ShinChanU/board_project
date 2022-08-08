const router = require('express').Router();
let Post = require('../models/post.models');
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: '../upload/',
  fileFilter: (req, file, callback) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls')
      return callback(new Error('Only .xlsx .xls format allowed!'));
    callback(null, true);
  },
}).any();

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

// 게시글 생성
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
    upload(req, res, function (err) {
      if (err)
        return res.status(400).send({
          message: err.message,
          files: reqSaveFiles,
        });
      for (let i = 0; i < req.files.length; i++) {
        reqSaveFiles.push(req.files[i].filename);
        reqOrgFiles.push(req.files[i].originalname);
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
    console.log(e);
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
    .then((post) => res.json(post))
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
