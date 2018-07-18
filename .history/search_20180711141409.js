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
      bool: {
        must: [
          {
            term: { creationUserId: 1403316 }
          }
        ]
      }
    }
  };
  let size = 0;
  search("users", body, size)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};
