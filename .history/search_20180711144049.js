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

  search("users", {
    body: {
      query: {
          query_string:{
             query:"1403316"
          }
      }
  }
    query: {
      multi_match: {
        query: "creationUserId: 1403316 AND startTime>=2017"
      }
    }
  })
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};
