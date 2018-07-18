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
      match_all: {}
    }
  };

  search("users", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      console.log(`returned journals:`);
      results.hits.hits.forEach((hit, index) =>
        console.log(hit._source.journal)
      );
    })
    .catch(console.error);
};
