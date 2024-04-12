# managing-broker-test

## Backend

### API
The backend has been build with the objective of being as simplistic as possible, while offering two distinct routes:
- `GET /brokers?search=<search_param>` returns the list of all the brokers whose name, address, city or country contain `search_param`.
```
{
  "brokers": [
    {
      "id": number;
      "name": string;
      "address": string;
      "city": string;
      "country": string;
    },
    ...
  ]
}
```

- `POST /brokers` allows for the creation of a new broker when provided with the following body:
```
{
  "name": string;
  "address": string;
  "city": string;
  "country": string;
}
```

### Start the backend
To start the backend, run the following:
```
cd backend
yarn install
yarn start
```