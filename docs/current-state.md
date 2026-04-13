# ServiceBiz - Current State

> **Last Updated:** 2026-04-13
> **Status:** IN PROGRESS

---

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | ServiceBiz |
| **Type** | Service Business Management System |
| **Status** | Development Complete - Ready for Deployment |
| **Started** | 2026-04-13 |

---

## Features Implemented

### ✅ Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Dashboard** | ✅ Done | Overview stats - total customers, services, revenue, appointments |
| **Customer Management** | ✅ Done | Add/Edit/Delete customers with search |
| **Service Records** | ✅ Done | Track services per customer with date, type, price |
| **Appointment Booking** | ✅ Done | Schedule appointments with status tracking |
| **Invoice Generation** | ✅ Done | Generate and print invoices |
| **Settings** | ✅ Done | Configure Google Sheets, business info, export data |

### 📁 Project Files

```
belajar/
├── index.html              # Main application
├── css/
│   └── style.css          # Styles (responsive)
├── js/
│   └── app.js            # Main JavaScript logic
├── google-sheets/
│   ├── template.md       # Google Sheets setup guide
│   └── appsscript.gs    # Google Apps Script backend
├── docs/
│   ├── current-state.md # This file
│   ├── AGENTS.md       # Project specification
│   └── planner.md     # Task breakdown
```

---

## How to Use

### Option 1: Local Mode (Offline)

1. Open `index.html` dalam browser
2. Data disimpan dalam localStorage
3. Boleh add/edit/delete customers dan services
4. Data akan kekal dalam browser tu je

### Option 2: Google Sheets Integration

1. Setup Google Sheets (refer `google-sheets/template.md`)
2. Copy Apps Script code (`google-sheets/appsscript.gs`)
3. Deploy as Web App
4. Masukkan URL dalam Settings page

### Option 3: Deploy ke GitHub Pages

1. Create GitHub repository
2. Upload files
3. Enable GitHub Pages in Settings
4. Share URL dengan customers/staff

---

## Tech Stack

| Component | Technology |
|-----------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Database | Google Sheets (free) |
| Backend | Google Apps Script |
| Hosting | GitHub Pages (free) |
| Offline Storage | localStorage |

---

## Deployment Steps

### Step 1: Google Sheets Setup
1. Pergi ke [Google Sheets](https://docs.google.com/spreadsheets)
2. Create new sheet "ServiceBiz"
3. Create 3 sheets: Customers, Services, Appointments
4. Setup column headers (refer template.md)
5. Share as "Anyone with link"

### Step 2: Web App Deployment
1. Create GitHub repository
2. Upload all files
3. Enable GitHub Pages
4. Share URL

---

## Features Summary

| Page | Features |
|------|-----------|
| Dashboard | Total customers, services this month, revenue, today's appointments |
| Customers | Table view, search, add/edit/delete modal |
| Services | Table view, search, add/edit/delete, customer linked |
| Appointments | Calendar view, status filters (pending/completed/cancelled) |
| Invoices | Generate invoice, print function |
| Settings | Google Sheets config, business info, export CSV/JSON |

---

## Notes

- Web app berfungsi dalam offline mode (localStorage)
- Google Sheets integration optional
- All data dalam Bahasa Melaysia
- Responsive design untuk mobile

---

## Next Steps

1. Deploy ke GitHub Pages (user perlu buat GitHub account)
2. Setup Google Sheets (optional)
3. Start menggunakan system

---

**Version 1.0** - 2026-04-13 - Initial release complete