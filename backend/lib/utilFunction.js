import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const SPOTVURI = 'https://www.spotvnow.co.kr/intro';

function newPageInContext(context, url) {
  return new Promise((resolve, reject) => {
    context.once('targetcreated', (target) => {
      target
        .createCDPSession()
        .then(async (session) => {
          await session.send('Page.navigate', {
            url,
          });
          const [page] = (await context.pages()).slice(-1);
          await session.detach();
          resolve(page);
        })
        .catch(reject);
    });
    context.newPage().catch(reject);
  });
}

export const getCrawlingNowMatch = async () => {
  console.log('in');
  try {
    const browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--disable-setuid-sandbox', '--no-sandbox', '--disable-gpu'],
      // 윈도우 크롬 자동 설치시 설치되는 경로
      executablePath:
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      userDataDir: 'C:/Users/CHAN/AppData/Local/Google/Chrome/User Data',
    });
    console.log('Start');
    const page = await browser.newPage();
    console.log('1');
    await page.goto(SPOTVURI); // WAIT for the page load finish. Provide wait options, you can read moe about it in documentation.
    console.log('2');
    console.log(page);
    // await page.screenshot({ path: 'buddy-screenshot.png' }); // WHAT you wanted to do with the page. You can take Screenshot or generate pdf.

    // await page.close(); // After job done close the page
    // await browser.close(); // IMPORTANT: you have to shutdown the browser in order to proceed with the results.

    // const page = await browser.newPage();
    // await page.goto('www.naver.com');
    // await page.click(
    //   '#intro > div.form-container > div.form > div:nth-child(5) > span:nth-child(2) > img:nth-child(2)',
    // );
    // await page.$eval('#id', (e) => (e.value = 'tlscksdn963'));
    // await page.$eval('#pw', (e) => (e.value = 'dkrak963@'));
    // await page.click('#log\\.login > span');

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
