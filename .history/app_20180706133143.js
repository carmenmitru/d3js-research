const express = require("express");
const elasticsearch = require("elasticsearch");
const fs = require("fs");
const app = express();

const PORT = 5000;

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});
app.get("/indices", (req, res) => {
  return client.cat
    .indices({ v: true })
    .then(res => res.json(res))
    .catch(err => console.error(`Error connecting to the es client: ${err}`));
});

app.listen(PORT, function() {
  console.log("Server is running on PORT:", PORT);
});
