import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const SPOTVURI = 'https://www.spotvnow.co.kr/intro';

export const getCrawlingNowMatch = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      devtools: false,
      executablePath:
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    });
    const page = await browser.newPage();
    await page.goto(SPOTVURI);
    await page.click(
      '#intro > div.form-container > div.form > div:nth-child(5) > span:nth-child(2) > img:nth-child(2)',
    );
    await page.$eval('#id', (e) => (e.value = 'tlscksdn963'));
    await page.$eval('#pw', (e) => (e.value = 'dkrak963@'));
    await page.click('#log\\.login > span');

    // const dimensions = await page.evaluate(() => {
    //   return {
    //     width: document.documentElement.clientWidth,
    //     height: document.documentElement.clientHeight,
    //     deviceScaleFactor: window.devicePixelRatio,
    //   };
    // });

    // console.log('Dimensions:', dimensions);

    // await browser.close();
  } catch (e) {
    console.log(e);
  }
};
