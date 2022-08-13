const router = require('express').Router();
let Post = require('../models/post.models');
let XlsxFile = require('../models/xlsxFile.models');
let CompanySales = require('../models/companySales.model');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const iconv = require('iconv-lite');

const excelStandardCol = [
  '회사코드',
  '회사명',
  '년도(yyyy)',
  '월(mm)',
  '매출액(만원)',
  '영업이익(만원)',
  '순수익(만원)',
];

const excelDataFilter = (json) => {
  for (let i = 0; i < json.length; i++) {
    let tmpXlsxCol = Object.keys(json[i]);
    if (JSON.stringify(excelStandardCol) !== JSON.stringify(tmpXlsxCol))
      return 0; // 엑셀 표준 폼과 다른 컬럼 존재
  }
  return 1;
};

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
  let excelData = [];
  try {
    upload(req, res, async function (err) {
      const { title, body, category } = JSON.parse(req.body.data);
      if (err)
        return res.status(400).send({
          message: err.message,
          files: reqSaveFiles,
        });
      if (category === 'data' && !req.files.length) {
        return res.status(400).json({
          message: '자료 게시판은 엑셀파일을 첨부해야합니다.',
        });
      }
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

      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          let path = req.files[i].path;
          let workbook = XLSX.readFile(path);
          let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1']);

          // 엑셀 내용 확인 후 튕겨내기!
          if (category === 'data') {
            if (!excelDataFilter(jsonData)) {
              return res.status(400).json({
                message: '양식에 맞지 않은 엑셀의 값이 존재합니다.',
              });
            }
          }

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
          excelData.push(jsonData);
        }
      }

      excelData.forEach((file) => {
        file.forEach((comData) => {
          let companyCode = comData['회사코드'];
          let companyName = comData['회사명'];
          let year = comData['년도(yyyy)'];
          let month = comData['월(mm)'];
          let revenue = comData['매출액(만원)'];
          let operatingIncome = comData['영업이익(만원)'];
          let netIncome = comData['순수익(만원)'];

          CompanySales.findOne({ companyCode })
            .then((existData) => {
              if (existData) {
                // 존재하지만 저장된 일자가 다를때, sales 추가
                if (
                  !existData.sales.filter(
                    (e) => e.year === year && e.month === month,
                  ).length
                ) {
                  existData.sales = [
                    ...existData.sales,
                    {
                      year,
                      month,
                      revenue,
                      operatingIncome,
                      netIncome,
                    },
                  ];
                  existData.save();
                  return;
                } else {
                  // 일자가 똑같은 데이터 update? or fail?
                  // return res.status(400).send({
                  //   message: '이미 존재하는 년월의 데이터가 있습니다.',
                  //   companyCode,
                  // });
                }
              } else {
                // new sales 모델
                const companySales = new CompanySales({
                  companyCode,
                  companyName,
                  sales: {
                    year,
                    month,
                    revenue,
                    operatingIncome,
                    netIncome,
                  },
                });
                companySales.save();
                return;
              }
            })
            .catch((err) => res.status(400).json('Error: ' + err));
        });
      });

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
      .then((data) => {
        return res.json('Post deleted.');
      })
      .catch((err) => res.status(400).json('Error: ' + err));
    return;
  } else {
    Post.findById(id)
      .then((post) => {
        if (post.author === username) {
          Post.findByIdAndDelete(id)
            .then((data) => {
              return res.json('Post deleted.');
            })
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
      const { title, body, category, delFiles } = JSON.parse(req.body.data);
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

          // 엑셀 내용 확인 후 튕겨내기!
          if (category === 'data') {
            if (!excelDataFilter(jsonData)) {
              return res.status(400).json({
                message: '양식에 맞지 않은 엑셀의 값이 존재합니다.',
              });
            }
          }

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
          let tmpOrg = post.orgFileName.slice();
          let tmpSave = post.saveFileName.slice();
          if (delFiles) {
            delFiles.org.forEach((e, i) => {
              let tmpOrgIdx = tmpOrg.indexOf(e);
              let tmpSaveIdx = tmpSave.indexOf(delFiles.save[i]);
              tmpOrg.splice(tmpOrgIdx, 1);
              tmpSave.splice(tmpSaveIdx, 1);
            });
          }

          if (category === 'data' && ![...tmpSave, ...reqSaveFiles].length) {
            return res.status(400).json({
              message: '자료 게시판은 엑셀파일을 첨부해야합니다.',
            });
          }

          post.title = title;
          post.body = body;
          post.orgFileName = [...tmpOrg, ...reqOrgFiles];
          post.saveFileName = [...tmpSave, ...reqSaveFiles];
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
