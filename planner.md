# Planner: Service Business Management System

## Overview Projek
Ini adalah perancangan terperinci untuk membangun sistem pengurusan bisnes servis menggunakan Google Sheets dan Single Page Application.

## Milestones

### Milestone 1: Persediaan dan Rekabentuk
**Tempoh:** 1-2 hari
**Objektif:** Sediakan asas Infrastructure dan design system

| Task | Description | Status |
|-----|-------------|--------|
| 1.1 | Define data structure untuk Google Sheets | pending |
| 1.2 | Determine fields untuk setiap sheet | pending |
| 1.3 | Sketch wireframe untuk web app | pending |
| 1.4 | Plan integration antara sheets dan app | pending |

### Milestone 2: Google Sheets Setup
**Tempoh:** 1 hari
**Objektif:** Create dan setup Google Sheets template

| Task | Description | Status |
|-----|-------------|--------|
| 2.1 | Create Google Sheet dengan nama "ServiceBiz" | pending |
| 2.2 | Create "Customers" sheet dengan column yang diperlukan | pending |
| 2.3 | Create "Services" sheet dengan column yang diperlukan | pending |
| 2.4 | Create "Appointments" sheet dengan column yang diperlukan | pending |
| 2.5 | Add sample data untuk testing | pending |
| 2.6 | Share sheet dan get URL untuk integration | pending |

### Milestone 3: Google Forms Setup
**Tempoh:** 1 hari
**Objektif:** Create Google Forms untuk data entry manual

| Task | Description | Status |
|-----|-------------|--------|
| 3.1 | Create Google Form untuk add new customer | pending |
| 3.2 | Create Google Form untuk add new service record | pending |
| 3.3 | Create Google Form untuk appointment booking | pending |
| 3.4 | Link forms ke Google Sheets | pending |
| 3.5 | Test form submission dan data sync | pending |

### Milestone 4: Web App Development - Frontend
**Tempoh:** 2-3 hari
**Objektif:** Build HTML/CSS/JS frontend

| Task | Description | Status |
|-----|-------------|--------|
| 4.1 | Create project structure (index.html, css/, js/) | pending |
| 4.2 | Build HTML structure dengan navigation | pending |
| 4.3 | Create CSS styles consistent dengan simple design | pending |
| 4.4 | Build Dashboard page | pending |
| 4.5 | Build Customer Management page | pending |
| 4.6 | Build Service Records page | pending |
| 4.7 | Build Appointments page | pending |
| 4.8 | Build Invoice Generation page | pending |

### Milestone 5: Web App Development - Backend Integration
**Tempoh:** 2 hari
**Objektif:** Connect web app ke Google Sheets API

| Task | Description | Status |
|-----|-------------|--------|
| 5.1 | Setup Google Apps Script sebagai backend | pending |
| 5.2 | Create API endpoints untuk read data | pending |
| 5.3 | Create API endpoints untuk write data | pending |
| 5.4 | Create API endpoints untuk update data | pending |
| 5.5 | Create API endpoints untuk delete data | pending |
| 5.6 | Implement CORS handling | pending |
| 5.7 | Test API integration | pending |

### Milestone 6: Testing dan Debugging
**Tempoh:** 1 hari
**Objektif:** Test semua features dan fix issues

| Task | Description | Status |
|-----|-------------|--------|
| 6.1 | Test customer management CRUD | pending |
| 6.2 | Test service records CRUD | pending |
| 6.3 | Test appointment booking | pending |
| 6.4 | Test invoice generation | pending |
| 6.5 | Test dashboard statistics | pending |
| 6.6 | Fix bugs dan issues | pending |

### Milestone 7: Deployment
**Tempoh:** 1 hari
**Objektif:** Deploy app ke GitHub Pages

| Task | Description | Status |
|-----|-------------|--------|
| 7.1 | Initialize git repository | pending |
| 7.2 | Upload files ke GitHub | pending |
| 7.3 | Enable GitHub Pages | pending |
| 7.4 | Test deployed site | pending |
| 7.5 | Share URL dengan user | pending |

## Task Dependencies

```
4.1 ──► 4.2 ──► 4.3 ──► 4.4 ──► 4.5 ──► 4.6 ──► 4.7 ──► 4.8
  │                                                       
  ▼                                                        
5.1 ──► 5.2 ──► 5.3 ──► 5.4 ──► 5.5 ──► 5.6 ──► 5.7       
  │                                                       
  ▼                                                        
6.1 ──► 6.2 ──► 6.3 ──► 6.4 ──► 6.5 ──► 6.6              
  │                                                       
  ▼                                                        
7.1 ──► 7.2 ──► 7.3 ──► 7.4 ──► 7.5
```

## Priority Order

1. **Week 1:** Milestone 1-3 (Setup)
2. **Week 2:** Milestone 4-5 (Development)
3. **Week 3:** Milestone 6-7 (Testing & Deployment)

## Estimation

| Phase | Days | Total Days |
|-------|------|------------|
| Persediaan | 2 | 2 |
| Google Sheets | 1 | 1 |
| Google Forms | 1 | 1 |
| Frontend Dev | 3 | 3 |
| Backend Integration | 2 | 2 |
| Testing | 1 | 1 |
| Deployment | 1 | 1 |
| **TOTAL** | **11** | **11** |

## Notes

- Google Sheets akan serve sebagai database utama
- Google Forms untuk alternative data entry manual
- Apps Script akan handle API requests dari web app
- GitHub Pages untuk hosting (free)

---
**Last Updated:** 2026-04-13
**Status:** IN PROGRESS