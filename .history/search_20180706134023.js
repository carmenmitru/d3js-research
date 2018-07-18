const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});

const search = function search(index, body) {
  return client.search({ index: index, body: body });
};

module.exports = function searchData() {
  let body = {
    size: 4,
    from: 0,
    query: {
      bool: {
        must: [
          {
            term: { objectId: 2126409 }
          }
        ]
      }
    }
  };

  search("users", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      console.log(results.hits[0]._source);
    })
    .catch(console.error);
};
