import express from "express";
import { readFile, readFileSync, writeFileSync } from "fs";

const app = express();
app.use(express.json());
const port = 4242;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/brokers', (req, res) => {
  const search = req.query.search;
  readFile("./data/brokers.json", 'utf8', (err, data) => {
    if (err !== null) {
      console.error(err);
      res.status(500).send("Something went wrong.");
      return
    }
    const brokersData = JSON.parse(data);
    res.status(200).send(brokersData.brokers.filter((broker) =>
      search === undefined ||
      broker.name.toLowerCase().includes(search) ||
      broker.address.toLowerCase().includes(search) ||
      broker.city.toLowerCase().includes(search) ||
      broker.country.toLowerCase().includes(search)
    ));
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});