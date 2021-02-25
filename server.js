const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
const fetch = require("node-fetch");
{
  /* <ul id="fruits">
  <li class="apple">Apple</li>
  <li class="orange">Orange</li>
  <li class="pear">Pear</li>
</ul> */
}
const cheerio = require("cheerio");
async function loadChapterInfo(chapterNumber) {
  const searchUrl = `https://www.wuxiaworld.com/novel/rmji/rmji-chapter-${chapterNumber}`;
  const response = await fetch(searchUrl); // fetch page
  //   console.log(response);
  const htmlString = await response.text(); // get response text
  //   console.log(htmlString);
  const $ = cheerio.load(htmlString); // parse HTML string
  //   console.log($(".prev a").attr("href"));
  const chapterInfo = {
    chapterNumber: $("#chapter-outer div div h4")
      .text()
      .split(":")[0]
      .replace("Chapter ", ""),
    chapterName: $("#chapter-outer div div h4").text().split(":")[1],
    chapterContent: $("#chapter-content p").text(),
    nextChapterLink: $(".next a").attr("href"),
    prevChapterLink: $(".prev a").attr("href"), // if val = # no prev chapter available
  };
  return chapterInfo;
}

async function loadChapters() {
  const searchUrl = `https://www.wuxiaworld.com/novel/rmji`;
  const response = await fetch(searchUrl); // fetch page
  const htmlString = await response.text(); // get response text
  const $ = cheerio.load(htmlString); // parse HTML string
  let chapters = $(".panel-group").text().split("\n");
  chapters = chapters.filter(function (item) {
    return item.trim() !== "" && item.toLowerCase().includes("chapter");
  });
  let filteredChapters = [];
  for (let i in chapters) {
    chapterNumber = chapters[i].match(/\d+/g)[0];
    chapterName = "";
    chapterInfo = chapters[i].match(/[a-zA-Z]+/g);
    chapterInfo.splice(0, 1);
    for (let j in chapterInfo) {
      chapterName = chapterName + chapterInfo[j] + " ";
    }
    chapterName = chapterName.trim();
    const chapObj = {
      chapterNumber: chapterNumber,
      chapterName: chapterName,
    };
    filteredChapters.push(chapObj);
  }
  return filteredChapters;
}

async function loadNovels() {
  const searchUrl = `https://www.wuxiaworld.com/api/novels/search`;
  const response = await fetch(searchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      active: null,
      count: 100,
      genres: [],
      language: "Any",
      searchAfter: 100,
      sortAsc: true,
      sortType: "Name",
      tags: [],
      title: "",
    }),
  });

  return JSON.stringify(await response.json());
}

const port = 80;

app.get("/chapters", (req, res) => {
  loadChapters().then((chapters) => {
    res.send(chapters);
  });
});

app.get("/chapters/:chapterNumber", (req, res) => {
  let chapterNumber = req.params.chapterNumber;
  console.log(chapterNumber);
  loadChapterInfo(chapterNumber).then((chapterInfo) => {
    res.send(chapterInfo);
  });
});

app.get("/novels", (req, res) => {
  loadNovels().then((novelInfo) => {
    res.json(JSON.parse(novelInfo));
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
