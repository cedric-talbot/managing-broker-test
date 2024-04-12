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

## Frontend

### Start the frontend
To start the frontend, run the following:
```
cd frontend
yarn install
yarn start
```

Note that you will need the backend to be running for the frontend to work as intended.

### Cypress tests
To run the cypress tests, you might need to install some requirements, please follow the [Cypress recommandations](https://docs.cypress.io/guides/getting-started/installing-cypress#Operating-System) if anything goes wrong.
Then, start the frontend and run `yarn cypress run` in a second tab, or `yarn cypress open` to see the interactive version.

Note that cypress does not need the backend to run.