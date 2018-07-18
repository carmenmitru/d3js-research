const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});

const search = function search(index, body, size) {
  return client.search({ index: index, body: body, size: size });
};

module.exports = function searchData(res) {
  /**
   *
   */
  let body = {
    size: 100,
    query: {
      match: {
        status: "executing"
      }
    }
  };
  let size = 100;
  search("users", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};