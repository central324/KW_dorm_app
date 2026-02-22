const express = require('express');
const app = express();
const PORT = 3000;

const axios = require("axios");
const cheerio = require("cheerio");

app.get("/crawl-notices", async (req, res) => {
  try {
    const sourceURL = "https://kw.happydorm.or.kr/60/6010.do";

    const response = await axios.get(sourceURL);
    const html = response.data;

    const $ = cheerio.load(html);

    const notices = [];

    $("#list tr.under_").each((index, element) => {

      const title = $(element)
        .find("td.l_subject a")
        .text()
        .trim();

      const onclick = $(element)
        .find("td.l_subject a")
        .attr("onclick");

      const date = $(element)
        .find("td")
        .eq(4)
        .text()
        .trim();

      const idMatch = onclick?.match(/getBbs\('(\d+)'\)/);
      const id = idMatch ? idMatch[1] : null;

      if (title) {
        notices.push({
          id,
          title,
          date
        });
      }
    });

    res.json(notices);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "크롤링 실패" });
  }
});


app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행중`);
});

