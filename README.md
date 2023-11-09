# Payment Button App

## Project Setup

- Clone project

- Install npm packages.
  ```bash
  npm install
  ```

- Run Project
  ```bash
  npm start
  ```

## Project Deployment

- Clone Project

- Install npm packages.
  ```bash
  npm install
  ```

- Build Project
  ```bash
  npm run build
  ```

- Run local server
  ```bash
  npx http-server build -y
  ```

- Browse website at `http://localhost:8080`
  
## Assumptions

For mock API, since these was React task, created a mock function that runs same as fetch api with Promise instead of writing code for Backend server.

For Unauthorized case, created a login dialog instead of other page as mostly everyone today builds a modal window.

## Would have implemented

A Proper login based system, creating payments against user instead of open ended design. Since its a payment system, there are various statuses created, pending, success and failure would have been added.

Since there are currencies options present based on dropdown switch would have converted the amount based on selection from one currency to another.

Amount limit should be placed on amount, as different modes of transfers are used based on amount.

Would have implemented an payment gateway integration for collecting the amount from user.