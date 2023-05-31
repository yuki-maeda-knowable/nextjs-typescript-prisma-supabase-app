import { NextApiResponse, NextApiRequest } from "next";
import puppeteer from "puppeteer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    console.log("method not allowed");
    return res.status(400).end();
  }

  const options = {
    headless: "new",
    // headless: true,
  };

  // const url = "https://scraping-training.vercel.app";
  const url = "https://scraping-check.vercel.app/";
  // const url = "https://www.mizuhobank.co.jp/rate_fee/rate_interest.html";
  // const url = "https://knowable.co.jp/";

  // const inputJobHighFields = [
  //   {
  //     selector: "#s2id_job_high ul li input",
  //     value: [
  //       "エンジニア・技術職（システム/ネットワーク）",
  //       "クリエイティブ職（Web）",
  //       "クリエイティブ職（ゲーム/マルチメディア）",
  //     ],
  //   },
  // ];

  // const submitSearchButton = "#js-real_search_btn";

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    // for (const inputJobHighField of inputJobHighFields) {
    //   const { selector, value } = inputJobHighField;

    //   for (const jobValue of value) {
    //     const inputForm = await page.$(selector);
    //     await inputForm.type(jobValue);
    //     await inputForm.press("Enter");
    //   }
    // }

    // await page.click(submitSearchButton);
    // await page.waitForNavigation();
    // "#hmessage .inner .hmessage__textarea .hmessage__text"がよみこまれるまで待機
    await page.waitForSelector(
      // "#hmessage .inner .hmessage__textarea .hmessage__text"
      "main div p"
    );

    // const jobDetails = await scrapeJobDetails(page, browser);
    //  "#hmessage .inner .hmessage__textarea .hmessage__text"のテキストを取得しresultに格納
    const result = await page.$eval(
      "main div p",
      // "header div a span.text-sm",
      (element) => element.textContent
    );

    // const result = await page.$$eval(
    //   "#hmessage .inner .hmessage__textarea .hmessage__text"

    await browser.close();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}

// async function scrapeJobDetails(page, browser) {
//   const jobDetails = [];
//   let nextPageButtonExists = true;

//   const ariaLabel = [
//     {
//       openPosition: "募集職種",
//       salaryRange: "想定年収",
//       skill: "関連スキル",
//       location: "勤務地",
//       feature: "求人の特徴",
//     },
//   ];

//   while (nextPageButtonExists && jobDetails.length < 20) {
//     const jobDetail = await page.$$eval(
//       ".srch-rslt .card-info__wrapper",
//       (elements) =>
//         elements.map((e) => ({
//           jobUrl: e.querySelector("a").href,
//           companyName: e.querySelector(
//             "a .card-info__detail-area .card-info__detail-area__box .card-info__detail-area__box__heading h3"
//           ).textContent,
//         }))
//     );

//     for (const jobDetailElement of jobDetail) {
//       const newPage = await browser.newPage();
//       await newPage.goto(jobDetailElement.jobUrl);
//       await newPage.waitForSelector(".css-mikfal");

//       const applicationDetails = await getApplicationDetails(
//         newPage,
//         jobDetailElement,
//         ariaLabel
//       );
//       jobDetails.push(applicationDetails);

//       await newPage.close();
//     }

//     const nextPageButton = await page.$(".next_page");
//     if (nextPageButton) {
//       await nextPageButton.click();
//       await page.waitForNavigation();
//     } else {
//       nextPageButtonExists = false;
//     }
//   }

//   return jobDetails;
// }

// async function getApplicationDetails(page, jobDetailElement, ariaLabel) {
//   const applicationDetails = {};
//   const getElementTextContent = (selector) => {
//     const element = document.querySelector(selector);
//     return element ? element.textContent : "";
//   };

//   for (const ariaLabelField of ariaLabel) {
//     const fieldKeys = Object.keys(ariaLabelField);
//     for (const fieldKey of fieldKeys) {
//       const selector = `div[aria-label="${ariaLabelField[fieldKey]}"] span`;
//       const element = await page.$(selector);
//       const value = await page.evaluate(getElementTextContent, selector);

//       applicationDetails[fieldKey + "Text"] = value;
//     }
//   }

//   return { ...jobDetailElement, ...applicationDetails };
// }
