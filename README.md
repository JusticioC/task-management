Task Management System API
This repository contains the backend service for a basic Task Management System. The API allows users to perform CRUD (Create, Read, Update, Delete) operations on tasks, with data persisted in a PostgreSQL database.

Features
Create, Read, Update, and Delete tasks.

Persistent data storage using PostgreSQL.

Filtering and sorting capabilities for retrieving tasks.

Input validation for task creation and updates.

Technology Stack
Node.js

Express.js

PostgreSQL

Postman (for API testing and usage)

Setup and Installation
Prerequisites
Node.js (v16 or higher)

npm

PostgreSQL

1. Database Setup
First, you need to set up the PostgreSQL database and the required table.

Create a new database in PostgreSQL. You can name it tasks_db.

Connect to your newly created database and run the following SQL command to create the tasks table:

CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
category VARCHAR(100) DEFAULT 'General',
priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
deadline TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

2. Application Setup
Clone the repository to your local machine.

Navigate into the project directory.

Install the required dependencies by running:
npm install

Create a .env file in the root of the project by copying the .env.example file.

Open the .env file and update the database connection variables (PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE) to match your local PostgreSQL configuration.

Running the Application
To start the server in development mode (with auto-reload), run the following command in your terminal:

npm run dev

The server will be running on the port specified in your .env file or on the default port.

API Usage
The API endpoints can be tested using the provided Postman collection file (postman_collection.json).

Import this file into your Postman application to see all available requests and interact with the API. You can create, read, update, and delete tasks using this collection.
