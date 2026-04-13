/**
 * ServiceBiz - Google Apps Script Backend
 * Deploy as Web App untuk connect ke web application
 */

var SPREADSHEET_ID = ''; // Will be set when deployed
var SHEET_NAMES = ['Customers', 'Services', 'Appointments'];

/**
 * doGet - Handle GET requests
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * doPost - Handle POST requests
 */
function doPost(e) {
  return handleRequest(e);
}

/**
 * handleRequest - Process API requests
 */
function handleRequest(e) {
  var action = e.parameter.action;
  var result = { success: false, message: '', data: null };
  
  try {
    switch(action) {
      case 'getCustomers':
        result = getCustomers();
        break;
      case 'getServices':
        result = getServices();
        break;
      case 'getAppointments':
        result = getAppointments();
        break;
      case 'addCustomer':
        result = addCustomer(e.parameter);
        break;
      case 'updateCustomer':
        result = updateCustomer(e.parameter);
        break;
      case 'deleteCustomer':
        result = deleteCustomer(e.parameter.id);
        break;
      case 'addService':
        result = addService(e.parameter);
        break;
      case 'updateService':
        result = updateService(e.parameter);
        break;
      case 'deleteService':
        result = deleteService(e.parameter.id);
        break;
      case 'addAppointment':
        result = addAppointment(e.parameter);
        break;
      case 'updateAppointment':
        result = updateAppointment(e.parameter);
        break;
      case 'deleteAppointment':
        result = deleteAppointment(e.parameter.id);
        break;
      case 'getStats':
        result = getStats();
        break;
      default:
        result.message = 'Unknown action: ' + action;
    }
  } catch(error) {
    result.message = 'Error: ' + error.message;
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== Customers ====================

function getCustomers() {
  var sheet = getSheet('Customers');
  var data = sheet.getDataRange().getValues();
  var customers = [];
  
  // Skip header row
  for(var i = 1; i < data.length; i++) {
    if(data[i][0]) { // Check if ID exists
      customers.push({
        id: data[i][0],
        name: data[i][1],
        phone: data[i][2],
        email: data[i][3],
        address: data[i][4],
        notes: data[i][5],
        created: data[i][6]
      });
    }
  }
  
  return { success: true, data: customers };
}

function addCustomer(params) {
  var sheet = getSheet('Customers');
  var lastRow = sheet.getLastRow();
  var id = generateId('CUS');
  var created = new Date().toISOString().split('T')[0];
  
  sheet.appendRow([id, params.name, params.phone, params.email, params.address, params.notes, created]);
  
  return { success: true, message: 'Customer added', id: id };
}

function updateCustomer(params) {
  var sheet = getSheet('Customers');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == params.id) {
      sheet.getRange(i + 1, 1, 1, 7).setValues([[
        params.id,
        params.name,
        params.phone,
        params.email,
        params.address,
        params.notes,
        data[i][6]
      ]]);
      return { success: true, message: 'Customer updated' };
    }
  }
  
  return { success: false, message: 'Customer not found' };
}

function deleteCustomer(id) {
  var sheet = getSheet('Customers');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Customer deleted' };
    }
  }
  
  return { success: false, message: 'Customer not found' };
}

// ==================== Services ====================

function getServices() {
  var sheet = getSheet('Services');
  var data = sheet.getDataRange().getValues();
  var services = [];
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0]) {
      services.push({
        id: data[i][0],
        customerId: data[i][1],
        date: data[i][2],
        serviceType: data[i][3],
        price: data[i][4],
        notes: data[i][5]
      });
    }
  }
  
  return { success: true, data: services };
}

function addService(params) {
  var sheet = getSheet('Services');
  var id = generateId('SRV');
  
  sheet.appendRow([id, params.customerId, params.date, params.serviceType, params.price, params.notes]);
  
  return { success: true, message: 'Service added', id: id };
}

function updateService(params) {
  var sheet = getSheet('Services');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == params.id) {
      sheet.getRange(i + 1, 1, 1, 6).setValues([[
        params.id,
        params.customerId,
        params.date,
        params.serviceType,
        params.price,
        params.notes
      ]]);
      return { success: true, message: 'Service updated' };
    }
  }
  
  return { success: false, message: 'Service not found' };
}

function deleteService(id) {
  var sheet = getSheet('Services');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Service deleted' };
    }
  }
  
  return { success: false, message: 'Service not found' };
}

// ==================== Appointments ====================

function getAppointments() {
  var sheet = getSheet('Appointments');
  var data = sheet.getDataRange().getValues();
  var appointments = [];
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0]) {
      appointments.push({
        id: data[i][0],
        customerId: data[i][1],
        date: data[i][2],
        time: data[i][3],
        serviceType: data[i][4],
        status: data[i][5],
        notes: data[i][6]
      });
    }
  }
  
  return { success: true, data: appointments };
}

function addAppointment(params) {
  var sheet = getSheet('Appointments');
  var id = generateId('APT');
  
  sheet.appendRow([id, params.customerId, params.date, params.time, params.serviceType, params.status || 'pending', params.notes]);
  
  return { success: true, message: 'Appointment added', id: id };
}

function updateAppointment(params) {
  var sheet = getSheet('Appointments');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == params.id) {
      sheet.getRange(i + 1, 1, 1, 7).setValues([[
        params.id,
        params.customerId,
        params.date,
        params.time,
        params.serviceType,
        params.status,
        params.notes
      ]]);
      return { success: true, message: 'Appointment updated' };
    }
  }
  
  return { success: false, message: 'Appointment not found' };
}

function deleteAppointment(id) {
  var sheet = getSheet('Appointments');
  var data = sheet.getDataRange().getValues();
  
  for(var i = 1; i < data.length; i++) {
    if(data[i][0] == id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Appointment deleted' };
    }
  }
  
  return { success: false, message: 'Appointment not found' };
}

// ==================== Stats ====================

function getStats() {
  var customers = getCustomers().data || [];
  var services = getServices().data || [];
  var appointments = getAppointments().data || [];
  
  var today = new Date().toISOString().split('T')[0];
  var thisMonth = today.substring(0, 7);
  
  var servicesThisMonth = services.filter(function(s) {
    return s.date && s.date.startsWith(thisMonth);
  });
  
  var revenue = servicesThisMonth.reduce(function(sum, s) {
    return sum + (parseFloat(s.price) || 0);
  }, 0);
  
  var appointmentsToday = appointments.filter(function(a) {
    return a.date === today;
  });
  
  return {
    success: true,
    data: {
      totalCustomers: customers.length,
      servicesThisMonth: servicesThisMonth.length,
      revenueThisMonth: revenue,
      appointmentsToday: appointmentsToday.length
    }
  };
}

// ==================== Utility Functions ====================

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

function generateId(prefix) {
  var timestamp = Date.now().toString(36).toUpperCase();
  var random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return prefix + timestamp + random;
}