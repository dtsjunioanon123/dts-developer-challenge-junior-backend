# HM Task Manager Backend - Development Setup

This repository contains the **backend** for the HT Task Manager (HMTM) application.  
Follow the steps below to set up and run the backend in your development environment.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/) (optional, can use npm)

---

## Setup Instructions

### 1. Install PostgreSQL

Make sure PostgreSQL is installed on your system. You can follow the official guide for your Linux Flavour.


### 2. Start PostgreSQL Service

Check if PostgreSQL is running:

```bash
sudo systemctl status postgresql
```
If it is not started, run:


```bash
sudo systemctl start postgresql
```

### 3. Set Up the Database
Run the following command to create the database and tables:

```bash
sudo -u postgres psql -f src/db/mock/setup.sql
```
### 4. Install Application Dependencies
Install all Node.js packages required for the app:

```bash
yarn install
```

### 5. Seed the Database
Populate the database with schema and mock data:

```bash
yarn seed
```
### 6. Start the HMTM Backend
Run the development server:

```bash
yarn dev
```
The HM Task Manager Backend (with PostgreSQL Database) should now be running. The API URL is http://localhost:9090


---

## To run Tests

Run:
```bash
yarn test
```
