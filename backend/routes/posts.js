const router = require("express").Router();
let Post = require("../models/post.models");

// 모든 게시글 조회
router.route("/").get((req, res) => {
  Post.find()
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json("Error: " + err));
});

// 게시글 생성
router.route("/").post((req, res) => {
  const { title, contents } = req.body;

  const newPost = new Post({
    title,
    contents,
  });

  newPost
    .save()
    .then(() => res.json("post create!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// 게시글 조회
router.route("/:id").get((req, res) => {
  Post.findById(req.params.id)
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json("Error: " + err));
});

// 게시글 삭제
router.route("/:id").delete((req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

// 게시글 수정
router.route("/:id").post((req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.title = req.body.title;
      post.contents = req.body.contents;

      post
        .save()
        .then(() => res.json("post updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
