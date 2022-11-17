import express from 'express';
import Post from '../models/post.models.js';
import XlsxFile from '../models/xlsxFile.models.js';
import multer from 'multer';
import path from 'path';
import XLSX from 'xlsx';
import iconv from 'iconv-lite';

const excelPostsRouter = express.Router();

// 양식으로 지정된 컬럼값들
const excelStandardCol = [
  '회사코드',
  '회사명',
  '년도(yyyy)',
  '월(mm)',
  '매출액(만원)',
  '영업이익(만원)',
  '순수익(만원)',
];

const typeCheck = (val, type) => {
  return typeof val === type ? 1 : 0;
};

// excelStandardCol과 업로드되는 엑셀의 컬럼값 비교
const excelDataFilter = (json) => {
  for (let i = 0; i < json.length; i++) {
    let tmpXlsxCol = Object.keys(json[i]);
    if (JSON.stringify(excelStandardCol) !== JSON.stringify(tmpXlsxCol))
      return 0; // 엑셀 표준 폼과 다른 컬럼 존재
  }
  return 1;
};

// userType별 권한 부여
const userAuthority = {
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

// 권한 확인
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
excelPostsRouter.route('/:category').get((req, res) => {
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
excelPostsRouter.route('/download/:id').get(async (req, res) => {
  XlsxFile.find({ fileName: req.params.id })
    .then((file) => {
      return res.status(200).json({
        data: file[0].data,
      });
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

//  db에서 취합 자료 생성 후 전송
excelPostsRouter.route('/download/result/:date').get(async (req, res) => {
  // data => "year_number-mon" or "year_number-quarter"
  const { date } = req.params;
  const [yyyymm, cycle] = date.split('-');
  const [year, month] = yyyymm.split('_');
  let result = [];
  if (cycle === 'mon') {
    CompanySales.find().then((data) => {
      data.forEach((comData) => {
        let exist = 0;
        const { companyCode, companyName } = comData;
        let obj = {
          회사코드: companyCode,
          회사명: companyName,
        };
        comData.sales.forEach((sale) => {
          if (sale.year === +year && sale.month === +month) {
            exist = 1;
            obj['년도(yyyy)'] = sale.year;
            obj['월(mm)'] = sale.month;
            obj['매출액(만원)'] = sale.revenue;
            obj['영업이익(만원)'] = sale.operatingIncome;
            obj['순수익(만원)'] = sale.netIncome;
          }
        });
        if (exist) result.push(obj);
      });
      result.sort((a, b) => {
        return a.회사코드 - b.회사코드;
      });
      res.send({
        data: result,
      });
    });
  } else {
    res.status(400).send({
      message: '잘못된 요청입니다.',
      config: 'number + cycle 형식, 1-quarter(1분기), 2-mon (2월)',
    });
  }
});

// 게시글 생성(모든 타입에 해당)
excelPostsRouter.route('/').post(async (req, res) => {
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
  let resFlag = 0;
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
          if (resFlag) return;
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

      let resultSalesData = [];
      let errData = 0;

      if (category === 'data') {
        // 자료파일일때만 회사 매출액 데이터에 취합
        // 엑셀 형식 검증(숫자필드가 맞는지, 회사이름 제외)
        excelData.forEach((file) => {
          if (errData) return 0;
          file.forEach((comData) => {
            if (errData) return 0;
            let companyCode = comData['회사코드'];
            let companyName = comData['회사명'];
            let year = comData['년도(yyyy)'];
            let month = comData['월(mm)'];
            let revenue = comData['매출액(만원)'];
            let operatingIncome = comData['영업이익(만원)'];
            let netIncome = comData['순수익(만원)'];

            if (
              typeCheck(companyCode, 'number') *
                typeCheck(year, 'number') *
                typeCheck(month, 'number') *
                typeCheck(revenue, 'number') *
                typeCheck(operatingIncome, 'number') *
                typeCheck(netIncome, 'number') ===
              0
            ) {
              errData = 1; // number에 맞지않는 값 존재
            } else {
              resultSalesData.push({
                companyCode,
                companyName,
                year,
                month,
                revenue,
                operatingIncome,
                netIncome,
              });
            }
          });
        });

        if (errData) {
          res.status(400).send({
            message: '엑셀파일에 숫자형식이 일치하지 않는 값이 존재합니다.',
          });
          return;
        }

        // 업로드한 엑셀 파일에 따라 회사 코드 수정
        for (let comData of resultSalesData) {
          const {
            companyCode,
            companyName,
            year,
            month,
            revenue,
            operatingIncome,
            netIncome,
          } = comData;
          let resultFileName = `${year}년_${month}월 매출액취합자료.xlsx`;

          Post.findOne({ category: 'result' }).then((post) => {
            if (!post.saveFileName.includes(resultFileName)) {
              // 추가
              post.saveFileName = [...post.saveFileName, resultFileName];
              post.orgFileName = [...post.orgFileName, resultFileName];
            }
            post.save();
          });

          CompanySales.findOne({ companyCode }).then(async (existData) => {
            if (existData) {
              // 회사코드에 대한 정보는 이미 있으면, 년월 데이터만 추가!
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
                await existData.save();
              } else {
                // 같은 년월 데이터 입력시 update!
                let idx;
                existData.sales.forEach((e, i) => {
                  if (e.year === year && e.month === month) idx = i;
                });
                existData.sales.splice(idx, 1, {
                  year,
                  month,
                  revenue,
                  operatingIncome,
                  netIncome,
                });
                await existData.save();
              }
            } else {
              // 새로운 회사코드에 대한 sales 데이터 생성
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
              await companySales.save();
            }
          });
        }
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
excelPostsRouter.route('/:category/:id').get((req, res) => {
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
excelPostsRouter.route('/:id').delete((req, res) => {
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
      .then((post) => {
        if (post.category === 'data') {
          for (let file of post.saveFileName) {
            XlsxFile.findOne({ fileName: file }).then((xlsx) => {
              // xlsx.data 를  companySales에서 삭제
              for (let info of xlsx.data) {
                CompanySales.findOne({ companyCode: info['회사코드'] }).then(
                  (comSale) => {
                    let tmp = 0;
                    for (let sale of comSale.sales) {
                      if (
                        info['월(mm)'] === sale.month &&
                        info['년도(yyyy)'] === sale.year
                      ) {
                        comSale.sales.splice(tmp, 1);
                      }
                      tmp++;
                    }
                    comSale.save();
                  },
                );
              }
            });
          }
        }
        return res.json('Post deleted.');
      })
      .catch((err) => res.status(400).json('Error: ' + err));
    return;
  } else {
    Post.findById(id)
      .then((post) => {
        if (post.category === 'data') {
          for (let file of post.saveFileName) {
            XlsxFile.findOne({ fileName: file }).then((xlsx) => {
              // xlsx.data 를  companySales에서 삭제
              for (let info of xlsx.data) {
                CompanySales.findOne({ companyCode: info['회사코드'] }).then(
                  (comSale) => {
                    let tmp = 0;
                    for (let sale of comSale.sales) {
                      if (
                        info['월(mm)'] === sale.month &&
                        info['년도(yyyy)'] === sale.year
                      ) {
                        comSale.sales.splice(tmp, 1);
                      }
                      tmp++;
                    }
                    comSale.save();
                  },
                );
              }
            });
          }
        }

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
excelPostsRouter.route('/:id').post((req, res) => {
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

export default excelPostsRouter;
