# Google Sheets Template - ServiceBiz

## Instructions

Ikut langkah2 ni untuk setup Google Sheets sebagai database:

### Step 1: Create Google Sheet

1. Pergi ke [Google Sheets](https://docs.google.com/spreadsheets)
2. Klik **New** > **Google Sheets**
3. Namakan sheet sebagai **ServiceBiz**

### Step 2: Create Sheets (Tabs)

Create 3 sheets (click + button untuk add new sheet):

| Sheet Name | Purpose |
|-----------|---------|
| Customers | Store customer records |
| Services | Track service records |
| Appointments | Appointment scheduling |

### Step 3: Setup Column Headers

#### Sheet: Customers
In cell A1, enter these headers (row 1):

| Column | Header | Example |
|--------|--------|---------|
| A | ID | CUS1001 |
| B | Name | Ahmad Bin Abu |
| C | Phone | 012-3456789 |
| D | Email | ahmad@email.com |
| E | Address | No 123, Jalan Maju, Kuala Lumpur |
| F | Notes | Customer since 2024 |
| G | Created | 2024-01-15 |

#### Sheet: Services
In cell A1, enter these headers (row 1):

| Column | Header | Example |
|--------|--------|---------|
| A | ID | SRV1001 |
| B | CustomerID | CUS1001 |
| C | Date | 2024-01-20 |
| D | ServiceType | Servis AC |
| E | Price | 150.00 |
| F | Notes | Ganti penapis |

#### Sheet: Appointments
In cell A1, enter these headers (row 1):

| Column | Header | Example |
|--------|--------|---------|
| A | ID | APT1001 |
| B | CustomerID | CUS1001 |
| C | Date | 2024-01-25 |
| D | Time | 10:00 |
| E | ServiceType | Servis Elektrik |
| F | Status | pending |
| G | Notes | - |

### Step 4: Share Sheet

1. Click **Share** button
2. Click **Restricted** dan tukar ke **Anyone with link**
3. Select **Viewer** permissions
4. Click **Save**

### Step 5: Get Sheet URL

CopySheet URL dan letakkan dalam app settings:
```
https://docs.google.com/spreadsheets/d/ABC123/edit#gid=0
```

Copy ID dari URL (the part antara `/d/` dan `/edit`):
```
ABC123
```

---

## Status Values

### Appointments Status:
- `pending` - Menunggu
- `completed` - Selesai
- `cancelled` - Batal

---

## Common Service Types

- Servis AC
- Servis Elektrik
- Servis Plumbing
- Servis Kereta
- Servis Komputer
- Maintenance
- Installation
- Repair
- Lain-lain

---

## API Integration (Optional)

Untuk connect web app ke Google Sheets secara langsung, deploy Google Apps Script:

1. Extensions > Apps Script
2. Copy code dari `google-sheets/appsscript.gs`
3. Deploy as Web App
4. Copy deployment URL ke app settings

---

**Last Updated:** 2026-04-13