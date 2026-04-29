# Vaccination Census System - Backend API

This is the Node.js/Express backend for the Vaccination Census Management project. It provides a robust RESTful API for collecting census data (Name, Birthdate, Gender, Vaccination Status) and querying aggregated results for frontend data visualization (tables, line charts, bar charts). Built with Express, Knex.js, and PostgreSQL.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Query Builder / ORM:** Knex.js
* **Middleware/Security:** Cors, Helmet, Morgan (logging), Express-Rate-Limit
* **Code Formatter:** Prettier

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v14 or higher)
* [PostgreSQL](https://www.postgresql.org/) (Running locally or remotely)
* `npm` (Node Package Manager)

---

## 🚀 Setup Instructions

### 1. Install Dependencies
Navigate to the `backend` directory and install the project dependencies:
```bash
cd backend
npm install
```

### 2. Environment Variables Configuration
The project uses environment variables to configure the server and database connection.
1. Make a copy of the `.env.sample` file and name it `.env`.
   ```bash
   cp .env.sample .env
   ```
2. Open `.env` and update the database credentials (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, etc.) to match your local PostgreSQL configuration.

### 3. Database Setup
1. Create a new PostgreSQL database that matches the `DB_NAME` in your `.env` file (the default is `census_db`).
   ```bash
   createdb -U postgres census_db
   ```
   *(If prompted for a password, enter your Postgres password).*

2. Run the database migrations to set up the schema and tables (`people` table and `gender_enum` type).
   ```bash
   npx knex migrate:latest
   ```

---

## 💻 Running the Application

### Development Mode
To start the server with hot-reloading (via Nodemon), run:
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or your configured `PORT`).

### Production Mode
To start the standard server:
```bash
npm start
```

### Code Formatting
To format your code using Prettier:
```bash
npm run format
```

---

## 🔗 API Endpoints Summary

All routes return standard JSON responses and incorporate robust payload validation natively.

### Census Records (CRUD)
* **`POST /vote`**
  Creates a new census record. Validates age constraints (e.g., must not be future date, max 100 years), required fields, and duplicate entries.
* **`PUT /vote/:id`**
  Updates an existing record by providing the record `id`. Includes validation for parameter constraints and safeguards against duplicating existing counterparts.
* **`DELETE /vote/:id`**
  Deletes an individual record utilizing its `id`.
* **`GET /data`**
  Fetches a flat list of all census records. Dates are pre-formatted strictly as `DD-MM-YYYY`.

### Data Aggregations (For Data Visualization)
* **`GET /counts?is_vaccinated=true|false`**
  Returns age aggregations separated securely by exact vaccination statuses (Boolean). Used to map `Chart.js` Line Charts.
* **`GET /results`**
  Calculates distribution grouped directly by Age and Gender via SQL extractions. Used natively by `Chart.js` Bar Charts.

---

## 🔒 Security & Optimization Setup
* **`helmet()`**: Automatically sets secure HTTP headers.
* **`cors()`**: Configured to restrict or allow frontend origins explicitly.
* **Rate Limiting**: Protects endpoints globally against brute-force/abuse logic (Max 100 requests per 15 minutes by default).
* **Validation**: Pre-request request analysis explicitly protects database queries from corrupted variables, malformed dates, and missing enums natively returning HTTP `400 Bad Request`.