const axios = require("axios");
const cheerio = require("cheerio");

let url =
  "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Javascript&location=Indonesia&geoId=102478259&currentJobId=4300010785&position=1&pageNum=0&start=0";

axios(url).then((response) => {
  const html = response.data;
  const $ = cheerio.load(html);
  const jobs = $("li");
  jobs.each((index, element) => {
    const jobTitle = $(element).find("h3.base-search-card__title").text();
    console.log(jobTitle);
  });
});
