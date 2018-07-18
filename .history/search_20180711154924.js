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
              _id: "1358046"
            }
          }
        ]
      }
    },
    size: 1000
  };

  search("assessmentruns_v2", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};
