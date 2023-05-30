import Layout from "../../components/Layout";
import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { ScrapingProps } from "../../types/interface";

const Green = (props: ScrapingProps) => {
  const [scrapingData, setScrapingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getScrapingData = async () => {
    setIsLoading(true);
    console.log("getScrapingData");

    const res = await fetch("/api/scraping/green");
    console.log(res);

    const result = await res.json();
    console.log(result);
    setScrapingData(result);
    setIsLoading(false);
  };

  const getData = (description: string) => {
    return description === "" ? "なし" : description;
  };

  return (
    <Layout>
      <Typography>green</Typography>
      <Button onClick={getScrapingData}>Greenのサイトをスクレイピング</Button>

      <Box>
        {isLoading && <Typography>Greenの求人データを取得中...</Typography>}
        {scrapingData?.length !== 0 && (
          <Typography>
            Greenのデータを{scrapingData?.length}件取得しました。
          </Typography>
        )}
        {scrapingData &&
          scrapingData.map((jobDetail) => (
            <ul key={jobDetail.companyName}>
              <li>会社名:{getData(jobDetail.companyName)}</li>
              <li>
                URL:
                <Link href={getData(jobDetail.jobUrl)}>
                  <a target="_blank">詳細</a>
                </Link>
              </li>
              <li>募集職種:{getData(jobDetail.openPositionText)}</li>
              <li>想定年収:{getData(jobDetail.salaryRangeText)}</li>
              <li>勤務地:{getData(jobDetail.locationText)}</li>
              <li>関連スキル:{getData(jobDetail.skillText)}</li>
              <li>求人の特徴:{getData(jobDetail.featureText)}</li>
              <hr />
            </ul>
          ))}
      </Box>
    </Layout>
  );
};

export default Green;
