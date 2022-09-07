import express from 'express';
import { getCrawlingNowMatch } from '../lib/utilFunction.js';

const footballRouter = express.Router();

footballRouter.route('/nowMatch').get(async (req, res) => {
  let response = await getCrawlingNowMatch();
  console.log(response);
  if (!response) {
    res.send({
      status: 408,
      message: '재요청 해주시기 바랍니다.',
    });
  } else {
    return res.send({
      status: 200,
      message: '성공했습니다.',
      data: response,
    });
  }
});

export default footballRouter;
