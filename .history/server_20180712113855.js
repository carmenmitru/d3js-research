const express = require("express");
const elasticsearch = require("elasticsearch");
const fs = require("fs");
const app = express();

const searchData = require("./search");

const PORT = 5000;

app.use(express.static(path.join(__dirname, "js")));

const client = new elasticsearch.Client({
  host: "http://localhost:9200",
  log: "error"
});

app.get("/indices", (req, res) => {
  return client.cat
    .indices({ v: true })
    .then(response => res.send(response))
    .catch(err => console.error(`Error connecting to the es client: ${err}`));
});

app.get("/user", (req, res) => {
  searchData(res);
});

app.listen(PORT, function() {
  console.log("Server is running on PORT:", PORT);
});
