import express from 'express';
import { getCrawlingNowMatch } from '../lib/utilFunction.js';

const footballRouter = express.Router();

footballRouter.route('/nowMatch').get(async (req, res) => {
  getCrawlingNowMatch();
  return res.send({
    test: 200,
  });
});

export default footballRouter;
