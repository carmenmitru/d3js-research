var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
const response = await client.search({
    index: 'twitter',
    type: 'tweets',
    body: {
      query: {
        match: {
          body: 'elasticsearch'
        }
      }
    }
  })

  for (const tweet of response.hits.hits) {
    console.log('tweet:', tweet);
  }