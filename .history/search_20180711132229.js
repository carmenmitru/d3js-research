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
   * {
  "query": {
    "query_string": {
      "query": "creationUserId: 1403316 AND startTime>=2017",
      "analyze_wildcard": true
    }
  },
  "size": 0,
  "aggs": {
    "2": {
      "date_histogram": {
        "field": "startTime",
        "interval": "1y",
        "time_zone": "Europe/Berlin",
        "min_doc_count": 1
      },
      "aggs": {
        "3": {
          "terms": {
            "field": "status",
            "size": 5,
            "order": {
              "_count": "desc"
            }
          }
        }
      }
    }
  }
}
   */
  let body = {
    size: 0,
    query: {
      query_string: {
        query: "creationUserId: 1403316 AND startTime>=2017",
        analyze_wildcard: true
      }
    },
    aggs: {
      2: {
        date_histogram: {
          field: "startTime",
          interval: "1y",
          time_zone: "Europe/Berlin",
          min_doc_count: 1
        },
        aggs: {
          3: {
            terms: {
              field: "status",
              size: 5,
              order: {
                _count: "desc"
              }
            }
          }
        }
      }
    }
  };

  search("assessmentruns", (size = 0), body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      res.json(results);
    })
    .catch(console.error);
};
