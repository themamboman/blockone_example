# Block.One test
# REPO: blockone_example

This repo contains the code for a test project that displays the latest 10 blockchain transactions using the EOSJS API.

This version used a nodejs server to interact with the EOSJS API to pull the data and deliver it to the test webpage (written in Angular v2+).

A load button will start the data retrieval, presenting only 10 rows of the latest blocks.  Each row will show the ID (hash), Timestamp and number of actions for the transactions found in each block.

Clicking a row will expand it to show the full, raw data.

# To run:

Both the ng-frontend and the nodejs server must be launched

<u>Frontend:

From the directory ./blockone_example/frontend/latestblocks, run this command to install dependencies:

- npm install

Then, run this command to serve the webpage from http://localhost:4200/:

- ng serve --open

<u>Backend:

From the directory ./blockone_example/backend/node-api, run this command to install dependencies:

- npm install

Then run this command to start the nodejs listener running on localhost port 3000:

- npm start

___

Then, point the browser to http://localhost:4200/ to start the page.  Clicking the Load button will load only the latest 10 blocks on the eosio blockchain.


# About:

The frontend was created using angular-cli, then modified for the requirements

The nodejs server was created using express generator, and modified to talk to the EOSJS API.
