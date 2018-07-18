const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});

const search = function search(index, body) {
  return client.search({ index: index, body: body });
};

module.exports = function searchData(res) {
  /**
   *
   */
  let body = {
    query: {
      bool: {
        must: [
          {
            match: {
              creationUserId: "1403316"
            },
            operator: "and",
            match: {
              status: "graded"
            }
          }
        ]
      }
    },
    size: 1000
  };

  search("assessmentruns", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};