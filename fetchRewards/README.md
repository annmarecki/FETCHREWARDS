# Fetch Rewards Take Home

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Stack](#stack)
- [Further Development](#further-development)

# Introduction

My name is Ann Marecki and this is the backend apprenticeship take home assessment.

# Getting Started

To compile and run locally please follow these steps:

1. Fork and clone this repo
2. Run `npm install` in your terminal
3. A) If you do not have postgresql on your machine, please go to https://www.postgresql.org/download/ and follow the instructions for set up on your machine
   B) If you have postgresql on your machine run `createdb fetch-rewards-ann-marecki` in your terminal to create the database
4. Run `npm run seed` in your terminal to seed the database
5. Run `npm run start` in your terminal to start the server on a localhost
6. Please open your browser of choice and go to http://localhost:3003 to call the api routes

** All routes were tested on PostMan **

# Stack

I used the following tech stack for my assessment:

- Node.js
- Express for backend routes
- Sequelize.js for queries and database models
- Psql for the relational database

# Further Development

Features I would add next:

- Authentication to secure transactions
