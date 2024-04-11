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

app.post('/brokers', (req, res) => {
  try {
    const brokersData = JSON.parse(readFileSync("./data/brokers.json").toString());
    let id = 1;
    if (brokersData.brokers.length > 0) {
      id = brokersData.brokers[brokersData.brokers.length - 1].id + 1;
    }

    const newBroker = {
      id,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country
    };

    if (newBroker.name === undefined || newBroker.name === "") {
      res.status(400).send("The 'name' field is incorrect.")
      return
    };
    if (newBroker.address === undefined || newBroker.address === "") {
      res.status(400).send("The 'address' field is incorrect.")
      return
    };
    if (newBroker.city === undefined || newBroker.city === "") {
      res.status(400).send("The 'city' field is incorrect.")
      return
    };
    if (newBroker.country === undefined || newBroker.country === "") {
      res.status(400).send("The 'country' field is incorrect.")
      return
    };

    brokersData.brokers.push(newBroker);
    writeFileSync("./data/brokers.json", JSON.stringify(brokersData));
    res.status(201).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});