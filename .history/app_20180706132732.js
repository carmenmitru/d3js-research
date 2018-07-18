const express = require("express");
const elasticsearch = require("elasticsearch");
const fs = require("fs");
const app = express();

const PORT = 5000;

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});

app.listen(PORT, function() {
  console.log("Server is running on PORT:", PORT);
});
