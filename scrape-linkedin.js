const axios = require("axios");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");

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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runScraper() {
  let linkedInJobs = [];
  for (let pageNumber = 0; pageNumber < 1000; pageNumber += 25) {
    let url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Javascript&location=Indonesia&geoId=102478259&currentJobId=4300010785&position=1&pageNum=0&start=${pageNumber}`;

    try {
      const response = await axios(url);

      // Add delay AFTER processing each page
      console.log("Waiting 5 seconds before next request...");
      await delay(5000);

      const html = response.data;
      const $ = cheerio.load(html);
      const jobs = $("li");
      jobs.each((_, element) => {
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

        linkedInJobs.push({
          job_title: jobTitle,
          company: company,
          location: location,
          link: link,
        });
      });
      console.log(`scraping in progress page number = ${pageNumber}`);

      const csv = new ObjectsToCsv(linkedInJobs);
      csv.toDisk("./linkedInJob.csv", { append: true });
    } catch (error) {
      console.error(error.message);
    }
  }
}

runScraper();
