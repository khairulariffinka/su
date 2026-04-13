# Project: Service Business Management System

## Status
- [x] Initial setup
- [ ] Google Sheets template creation
- [ ] Google Forms setup
- [ ] Web App development
- [ ] Deployment

## Tech Stack
- **Language:** HTML, CSS, JavaScript
- **Framework:** Vanilla JS (no framework needed)
- **Database:** Google Sheets (free)
- **Hosting:** GitHub Pages (free)

## Project Mode
**Description:** Simple service business management system - customer database, appointment booking, service tracking, invoice generation

## Core Features (MVP)

### 1. Customer Management
- Add/Edit/Delete customer records
- Store: Name, Phone, Email, Address, Notes
- Search and filter customers

### 2. Service Records
- Track services performed per customer
- Date, Service Type, Price, Notes
- Service history per customer

### 3. Appointment Booking
- Simple appointment scheduling
- Date, Time, Customer, Service Type
- Status tracking (Pending/Completed/Cancelled)

### 4. Dashboard
- Total customers count
- Total services this month
- Revenue summary
- Recent appointments

### 5. Invoice Generation
- Simple invoice with customer details
- Service details, total amount
- Print/Save as PDF

## Architecture
```
project/
├── index.html          # Main app
├── css/
│   └── style.css       # Styles
├── js/
│   └── app.js          # Main logic
├── google-sheets/      # Sheets templates
└── docs/               # Documentation
```

## Google Sheets Structure
- **Customers** sheet: ID, Name, Phone, Email, Address, Created
- **Services** sheet: ID, CustomerID, Date, Type, Price, Notes
- **Appointments** sheet: ID, CustomerID, Date, Time, Status, Notes

## Decisions Log
- 2026-04-12: Initial setup - Pending tech stack decision
- 2026-04-13: Decided on Google Sheets + Single Page App approach for service business

---
**Last Updated:** 2026-04-13
**Status:** IN PROGRESS