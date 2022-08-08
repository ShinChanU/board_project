const router = require('express').Router();
let Post = require('../models/post.models');
const multer = require('multer');

const upload = multer({
  dest: '../upload',
});

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
router.route('/').post(upload.single('file'), async (req, res) => {
  const file = req.file.path;
  console.log(file);

  // const { title, body, author, companyCode } = req.body;

  // const newPost = new Post({
  //   title,
  //   body,
  //   author,
  //   companyCode,
  // });

  // newPost
  //   .save()
  //   .then(() => res.json('post create!'))
  //   .catch((err) => res.status(400).json('Error: ' + err));
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
