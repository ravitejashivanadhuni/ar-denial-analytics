# AR Denial Analytics

A full-stack application for analyzing healthcare claim denials. It provides payer-wise denial analytics, denial reason summaries, and a filterable, paginated claims dashboard.

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- H2 Database
- REST APIs

### Frontend
- React
- Vite
- Recharts
- Lucide React
- CSS

## Features

- Total denied amount and denied claim count grouped by payer.
- Payer analytics sorted by denied amount in descending order.
- Total denied amount grouped by denial reason.
- Claims table with pagination.
- Filters for payer, denial reason, and date range.
- Input validation and JSON error responses.
- Dashboard with KPI cards and charts.
- Loading, empty, and error states.

## Project Structure

```text
ar-denial-analytics/
├── src/
│   └── main/
│       ├── java/com/raviteja/ardenial/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── exception/
│       │   ├── model/
│       │   ├── repository/
│       │   ├── service/
│       │   └── ArDenialAnalyticsApplication.java
│       └── resources/
│           ├── application.properties
│           └── data.sql
├── frontend/
│   ├── src/
│   ├── package.json
│   └── index.html
├── pom.xml
├── mvnw
└── README.md

