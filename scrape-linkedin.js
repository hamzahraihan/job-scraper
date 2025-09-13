const axios = require("axios");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");
const objectsToCsv = require("objects-to-csv");

let url =
  "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Javascript&location=Indonesia&geoId=102478259&currentJobId=4300010785&position=1&pageNum=0&start=0";

// oop
// class JobScraper {
//   url;
//
//   constructor(url) {
//     this.url = url;
//   }
//
//   runScraper() {
//     axios(url).then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       const jobs = $("li");
//       jobs.each((index, element) => {
//         const jobTitle = $(element).find("h3.base-search-card__title").text();
//         console.log(jobTitle);
//       });
//     });
//   }
// }

async function runScraper(url) {
  let linkeninJobs = [];

  try {
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const jobs = $("li");
      jobs.each((index, element) => {
        const jobTitle = $(element)
          .find("h3.base-search-card__title")
          .text()
          .trim();

        const company = $(element)
          .find("h4.base-search-card__subtitle")
          .text()
          .trim();

        const location = $(element)
          .find("span.job-search-card__location")
          .text()
          .trim();

        const link = $(element).find("a.base-card__full-link").attr("href");

        linkeninJobs.push({
          job_title: jobTitle,
          company: company,
          location: location,
          link: link,
        });
        console.log(linkeninJobs);
      });
      const csv = new ObjectsToCsv(linkeninJobs);
      csv.toDisk("./linkedInJob.csv", { append: true });
    });
  } catch (error) {
    console.error(error);
  }
}

runScraper(url);
