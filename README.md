# Project01 API: accessing data for a news aggregation service simulator

## Overview

Welcome to the Project01 API documentation. This API was built to deliver data for an application that simulates a news aggregation service with articles, commenting and content rating (like Reddit). Working on this project, I had the developer experience in mind: I wanted the end consumer of my API to be able to work with it intuitively and comfortably. This is my first API, so it's not as comprehensive as I would want, but it's a solid base to build on top of.

The endpoints I've implemented so far are self-explanatory and easy to remember. Developers would be able to understand that **_articles_**, **_users_** and **_comments_** correspond with the existing articles, users and comments respectively. Additionally, the `endpoints.json` file provides a brief description of the purpose and functionality of each endpoint, including acceptable query parameters, the format of the request body and an example response. To help developers with debugging, I also aimed to make error messages short but descriptive (e.g. "The data with the given id was not found.", "Comment body missing.", "Invalid query parameter." etc).

Take a look at the [hosted API](https://project01-wgzu.onrender.com/api).

## Getting Started

Get started by cloning this repository and creating a new public GitHub repository. Do not initialise it with a **readme**, **.gitignore** or **license**. From your cloned local version push your code to your new repository.

This API works with a **PostgreSQL** database and uses **node-postgres** for database interaction. The databases are called `nc_news_test` and `nc_news`. Refer to the `seed.js` file to familiarise with the database structure. Next, create `.env.test` snd `.env.development` files (must be **.gitignored**). Into each, add `PGDATABASE=`, with the correct database name for that environment.

To install dependencies, run `npm install`. Check that the following are installed (make sure that _pg-format_, _express_, _dotenv_, and _pg_ packages are in dependencies in the package.json, not devDependencies):

        devDependencies:

        husky
        jest
        jest-extended
        jest-sorted


        dependencies:

        dotenv
        express
        pg
        supertest
        pg-format

Set up local database, run `npm setup-dbs`.

Seed the local database, run `npm seed`.

To run tests, run `npm test`.

---

**_Project01_** _was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)._
