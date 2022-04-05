# Fetch Rewards Take Home

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Stack](#stack)
- [Features](#features)
- [Further Development](#further-development)

# Introduction

My name is Ann Marecki and this is the backend apprenticeship take home assessment.

# Getting Started

For ease of use and testing I decided to host this takehome on heroku, all api routes will be using "ADD URL" + "path name" as noted in the comments of the code.
However, if you with to compile and run locally please follow these steps:

1. Fork and clone this repo
2. Run `npm install` in your terminal
3. A) If you do not have psql on your machine, please run `npm install pg` in your terminal -- check this before submitting
   B) If you have psql on your machine run `createdb fetch-rewards-ann-marecki` in your terminal
4. Run `npm run seed` in your terminal to seed the database
5. Run `npm run start:dev` in your terminal to start the server on a localhost and load the front end
6. Please open your browser of choice and go to localhost://

# Stack

I used the following tech stack for my assessment:

- Node.js
- React for front end
- Axios for front end routes
- Express for backend routes
- Sequelize.js for queries and database models
- Psql for the relational database
- Jasmine for testing
- Heroku to host

# Features

- On the home page you can make two types of calls, dependent on the type of user you are in the system
- As a payer you can add to your account
- As a spender you can spend points

# Further Development

Features I would add next:

- Authentication to secure transactions
- Guest Accounts
