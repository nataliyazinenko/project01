# [Project01](https://project01-wgzu.onrender.com/api)

An API to access application data, simulating a backend service like Reddit for front-end use. This [project](https://project01-wgzu.onrender.com/api) works with a PostgreSQL database and uses node-postgres for database interaction. It was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).

---

Get started by cloning this repository and creating a new public GitHub repository. Do not initialise it with a `readme`, `.gitignore` or `license`. From your cloned local version push your code to your new repository.

This project works with two databases:

    nc_news_test
    nc_news

Create `.env.test` snd `.env.development` files (must be `.gitignored`). Into each, add `PGDATABASE=`, with the correct database name for that environment.

Run `npm install`.

Check that the following are installed:

    jest
    jest-extended
    jest-sorted
    dotenv
    express
    pg
    supertest
    pg-format
    husky

---

- Refer to `seed.js` to see the structure of the database.
- `endpoints.json` file includes a brief description of the purpose and functionality of each endpoint, including acceptable query parameters, the format of the request body and an example response.

This project uses Husky to set up and maintain pre-commit hooks. If any of the tests fail, the commit will be aborted.
