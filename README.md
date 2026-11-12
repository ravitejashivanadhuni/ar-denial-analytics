# AR Denial Analytics

A full-stack healthcare claim denial analytics application built with **Java Spring Boot, React, and H2 Database**.

The application helps analyze denied healthcare claims through payer-wise financial summaries, denial reason breakdowns, and a filterable, paginated claims dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Run the Backend](#2-run-the-backend)
  - [3. Run the Frontend](#3-run-the-frontend)
- [Database Configuration](#database-configuration)
- [API Documentation](#api-documentation)
- [Validation and Error Handling](#validation-and-error-handling)
- [Database Indexing](#database-indexing)
- [Troubleshooting](#troubleshooting)
- [Implementation Notes](#implementation-notes)

## Overview

AR Denial Analytics provides visibility into healthcare claim denials by aggregating denied amounts across insurance payers and denial reasons.

It consists of:

- A Spring Boot REST API for claim management, filtering, pagination, and analytics.
- An H2 relational database containing sample healthcare claim records.
- A React dashboard for visualizing denial analytics and exploring individual claims.

The application is designed to make claim denial patterns easier to understand and investigate.

## Features

### Analytics Dashboard

- Total denied amount.
- Total number of denied claims.
- Number of payers represented in the analytics.
- Payer-wise denied amount visualization.
- Denial reason-wise financial summaries.

### Claims Management

- Paginated claims listing.
- Filter claims by payer.
- Filter claims by denial reason.
- Filter claims by date range.
- Combine multiple filters.
- Clear filters and refresh the dashboard.

### Backend

- RESTful API architecture.
- Spring Data JPA for database operations.
- Database aggregation using repository queries.
- Pagination using Spring Data `Pageable`.
- Input validation.
- Centralized exception handling.
- JSON error responses.

### User Interface

- Interactive charts using Recharts.
- KPI cards and analytics summaries.
- Filterable claims table.
- Loading indicators.
- Empty-state handling.
- Error-state handling.

## Technology Stack

| Layer | Technologies |
|---|---|
| Backend | Java 21, Spring Boot |
| Data Access | Spring Data JPA, Hibernate |
| Build Tool | Maven |
| Database | H2 Database |
| Frontend | React, JavaScript |
| Frontend Tooling | Vite, npm |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | CSS |
| API Communication | REST APIs |

## Project Structure

```text
ar-denial-analytics/
│
├── src/
│   ├── main/
│   │   ├── java/com/raviteja/ardenial/
│   │   │   ├── controller/
│   │   │   │   └── ClaimController.java
│   │   │   ├── exception/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── model/
│   │   │   │   └── Claim.java
│   │   │   ├── repository/
│   │   │   │   └── ClaimRepository.java
│   │   │   ├── service/
│   │   │   │   └── ClaimService.java
│   │   │   └── ArDenialAnalyticsApplication.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   │
│   └── test/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── .gitattributes
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## Prerequisites

Install the following software before running the application.

| Software | Required Version |
|---|---|
| Java JDK | 21 or later |
| Node.js | 20 or later |
| npm | Included with Node.js |
| Git | Latest stable version |

Verify your installations:

```bash
java -version
node -v
npm -v
git --version
```

**Note:** Maven is included through the Maven Wrapper, so a separate Maven installation is not required.

## Getting Started

Follow these steps to download and run the application locally.

### 1. Clone the Repository

Open your terminal and execute:

```bash
git clone https://github.com/ravitejashivanadhuni/ar-denial-analytics.git
```

Navigate into the project directory:

```bash
cd ar-denial-analytics
```

### 2. Run the Backend

The backend is built using Java 21 and Spring Boot.

From the project root directory, run:

**macOS / Linux**

```bash
./mvnw spring-boot:run
```

**Windows**

```bash
mvnw.cmd spring-boot:run
```

Maven will download the required dependencies and start the Spring Boot application.

Once successfully started, the backend will be available at:

```text
http://localhost:8080
```

The application initializes the database schema and loads the sample claims using the SQL seed script.

### 3. Run the Frontend

Keep the backend running.

Open a **second terminal window** and navigate to the frontend directory:

```bash
cd ar-denial-analytics/frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

Open the URL in your browser to access the AR Denial Analytics dashboard.

## Database Configuration

The application uses an H2 file-based relational database.

### Database Details

| Configuration | Value |
|---|---|
| Database | H2 |
| JDBC URL | `jdbc:h2:file:./data/ar_denial_analytics` |
| Driver | `org.h2.Driver` |
| Username | `sa` |
| Password | Blank |
| Schema Management | Hibernate `ddl-auto=update` |

### Sample Dataset

The application includes a sample dataset of **59 healthcare claims**.

The dataset contains:

- Denied claims.
- Paid claims.
- Multiple insurance payers.
- Multiple healthcare providers.
- Different CPT codes.
- Various denial reasons.
- Different denial dates.

The `data.sql` file initializes the sample data when the backend starts. It clears and reloads the sample claims on each application startup.

### Accessing the H2 Console

While the backend is running, open:

```text
http://localhost:8080/h2-console
```

Use the following connection details:

```text
JDBC URL: jdbc:h2:file:./data/ar_denial_analytics
Username: sa
Password:
```

Click **Connect** to access the database.

## API Documentation

The backend exposes the following REST endpoints.

### 1. Payer-wise Analytics

**Endpoint**

```http
GET /api/analytics/payers
```

**Description**

Returns the total denied amount and denied claim count grouped by payer.

Results are sorted by total denied amount in descending order.

**Example**

```bash
curl http://localhost:8080/api/analytics/payers
```

### 2. Denial Reason Analytics

**Endpoint**

```http
GET /api/analytics/reasons
```

**Description**

Returns the total denied amount grouped by denial reason.

**Example**

```bash
curl http://localhost:8080/api/analytics/reasons
```

### 3. Filtered and Paginated Claims

**Endpoint**

```http
GET /api/claims
```

**Description**

Returns denied claims with support for filtering and pagination.

**Supported Query Parameters**

| Parameter | Description | Format |
|---|---|---|
| `payer` | Filter by insurance payer | String |
| `reason` | Filter by denial reason | String |
| `startDate` | Filter from a start date | `YYYY-MM-DD` |
| `endDate` | Filter until an end date | `YYYY-MM-DD` |
| `page` | Zero-based page number | Integer |
| `size` | Number of records per page | Integer |

**Example: Retrieve all denied claims**

```bash
curl "http://localhost:8080/api/claims"
```

**Example: Filter by payer**

```bash
curl "http://localhost:8080/api/claims?payer=Aetna"
```

**Example: Filter by denial reason**

```bash
curl "http://localhost:8080/api/claims?reason=Duplicate%20Claim"
```

**Example: Filter by date range**

```bash
curl "http://localhost:8080/api/claims?startDate=2026-01-01&endDate=2026-12-31"
```

**Example: Combine filters with pagination**

```bash
curl "http://localhost:8080/api/claims?payer=Aetna&reason=Duplicate%20Claim&startDate=2026-01-01&endDate=2026-12-31&page=0&size=10"
```

## Validation and Error Handling

The backend includes centralized exception handling to provide consistent JSON error responses.

Validation includes:

- Start date cannot be after end date.
- Page number cannot be negative.
- Page size must be between 1 and 100.

Invalid requests return an HTTP `400 Bad Request` response.

Example error response:

```json
{
  "message": "Start date cannot be after end date",
  "error": "Bad Request",
  "status": 400,
  "timestamp": "2026-11-12T..."
}
```

## Database Indexing

Indexes are defined on frequently queried columns in the claims table:

- `status`
- `payer`
- `denied_at`

These indexes help support common filtering and query operations.

## Troubleshooting

### Backend does not start

Check your Java installation:

```bash
java -version
```

Ensure Java 21 or later is installed.

### Port 8080 is already in use

Stop the process using port 8080 or change the server port in `application.properties`.

### Frontend cannot connect to the backend

Ensure:

1. The Spring Boot backend is running.
2. The backend is accessible at `http://localhost:8080`.
3. The frontend is running at `http://localhost:5173`.

### Frontend dependencies are missing

Navigate to the frontend directory and run:

```bash
npm install
```

### Maven dependencies or build issues

Try:

```bash
./mvnw clean install
```

On Windows:

```bash
mvnw.cmd clean install
```

Then start the backend again.

## Implementation Notes

- Only claims with `DENIED` status are included in denial analytics.
- The claims listing endpoint returns denied claims.
- Paid claims are excluded from denial calculations.
- Database schema creation and updates are handled through JPA/Hibernate.
- Sample records are maintained in `src/main/resources/data.sql`.
- Backend and frontend run independently and communicate through REST APIs.
- The project uses H2 to simplify local development and assessment setup.

## Time-Saving Implementation Decisions

- Used Spring Data JPA for database operations, aggregation queries, and pagination.
- Used H2 instead of configuring an external database server.
- Used SQL-based sample data initialization for quick setup.
- Used React with Vite for rapid frontend development.
- Used Recharts for dashboard visualizations.
- Used generated getters and setters to reduce Java boilerplate.

---

**Developed as a full-stack AR Denial Analytics assessment project.**
