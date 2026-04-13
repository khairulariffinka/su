/**
 * ServiceBiz - Main Application JavaScript
 * Sistem Pengurusan Bisnes Servis
 */

// ==================== Configuration ====================
const CONFIG = {
    // Google Sheets API Configuration
    // You need to deploy Google Apps Script as Web App
    apiUrl: '', // Will be set in settings
    sheetsId: '',
    
    // Default service types (can be customized)
    serviceTypes: [
        'Servis AC',
        'Servis Elektrik',
        'Servis Plumbing',
        'Servis Kereta',
        'Servis Komputer',
        'Servis Telefon',
        'Maintenance',
        'Installation',
        'Repair',
        'Lain-lain'
    ],
    
    // Currency
    currency: 'RM',
    
    // Date format
    dateFormat: 'DD/MM/YYYY'
};

// ==================== State Management ====================
let state = {
    customers: [],
    services: [],
    appointments: [],
    settings: {
        sheetsUrl: '',
        sheetsNames: 'Customers,Services,Appointments',
        businessName: '',
        businessPhone: '',
        businessAddress: ''
    },
    currentFilter: 'all',
    searchQuery: ''
};

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    loadSettings();
    setupNavigation();
    setupEventListeners();
    loadData();
}

// ==================== Navigation ====================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateTo(pageId);
        });
    });
    
    // Also setup bottom nav items
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateTo(pageId);
        });
    });
}

function navigateTo(pageId) {
    // Update desktop nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
    
    // Update bottom nav active state on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });
    }
    
    // Show page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Load data for specific pages
    if (pageId === 'dashboard') {
        refreshDashboard();
    } else if (pageId === 'customers') {
        loadCustomers();
    } else if (pageId === 'services') {
        loadServices();
    } else if (pageId === 'appointments') {
        loadAppointments();
    } else if (pageId === 'invoices') {
        loadInvoices();
    } else if (pageId === 'settings') {
        loadSettingsPage();
    }
    
    // Close mobile menu if open
    if (window.innerWidth < 768) {
        closeMobileMenu();
    }
}

// Mobile menu functions
function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (hamburger) hamburger.classList.remove('active');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Search inputs
    document.getElementById('searchCustomer')?.addEventListener('input', debounce(searchCustomers, 300));
    document.getElementById('searchService')?.addEventListener('input', debounce(searchServices, 300));
    
    // Invoice filters
    document.getElementById('invoiceCustomerFilter')?.addEventListener('change', loadInvoices);
    document.getElementById('invoiceDateFrom')?.addEventListener('change', loadInvoices);
    document.getElementById('invoiceDateTo')?.addEventListener('change', loadInvoices);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('serviceDate')?.setAttribute('value', today);
    document.getElementById('appointmentDate')?.setAttribute('value', today);
}

// ==================== Data Loading ====================
async function loadData() {
    try {
        // Load from localStorage first (offline mode)
        loadFromStorage();
        
        // Then try to load from API if configured
        if (CONFIG.apiUrl) {
            await loadFromAPI();
        }
        
        // Initialize dashboard
        refreshDashboard();
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error memuatkan data', 'error');
    }
}

function loadFromStorage() {
    const customers = localStorage.getItem('servicebiz_customers');
    const services = localStorage.getItem('servicebiz_services');
    const appointments = localStorage.getItem('servicebiz_appointments');
    const settings = localStorage.getItem('servicebiz_settings');
    
    if (customers) state.customers = JSON.parse(customers);
    if (services) state.services = JSON.parse(services);
    if (appointments) state.appointments = JSON.parse(appointments);
    if (settings) state.settings = { ...state.settings, ...JSON.parse(settings) };
}

function loadFromAPI() {
    // This will be implemented with Google Apps Script
    // Placeholder for API integration
    console.log('Loading from API...');
}

function saveToStorage() {
    localStorage.setItem('servicebiz_customers', JSON.stringify(state.customers));
    localStorage.setItem('servicebiz_services', JSON.stringify(state.services));
    localStorage.setItem('servicebiz_appointments', JSON.stringify(state.appointments));
    localStorage.setItem('servicebiz_settings', JSON.stringify(state.settings));
}

// ==================== Dashboard ====================
function refreshDashboard() {
    updateDashboardStats();
    loadRecentAppointments();
    loadRecentServices();
}

function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.substring(0, 7);
    
    // Total customers
    document.getElementById('totalCustomers').textContent = state.customers.length;
    
    // Services this month
    const servicesThisMonth = state.services.filter(s => s.date && s.date.startsWith(thisMonth));
    document.getElementById('servicesThisMonth').textContent = servicesThisMonth.length;
    
    // Revenue this month
    const revenue = servicesThisMonth.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    document.getElementById('revenueThisMonth').textContent = CONFIG.currency + ' ' + revenue.toFixed(2);
    
    // Appointments today
    const appointmentsToday = state.appointments.filter(a => a.date === today);
    document.getElementById('appointmentsToday').textContent = appointmentsToday.length;
}

function loadRecentAppointments() {
    const tbody = document.getElementById('recentAppointments');
    const sorted = [...state.appointments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Tiada temu janji</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map(apt => {
        const customer = state.customers.find(c => c.id === apt.customerId) || { name: 'Unknown' };
        return `
            <tr>
                <td>${customer.name}</td>
                <td>${formatDate(apt.date)}</td>
                <td>${apt.time}</td>
                <td>${apt.serviceType}</td>
                <td><span class="status-badge ${apt.status}">${getStatusText(apt.status)}</span></td>
            </tr>
        `;
    }).join('');
}

function loadRecentServices() {
    const tbody = document.getElementById('recentServices');
    const sorted = [...state.services].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    if (sorted.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Tiada servis</td></tr>';
        return;
    }
    
    tbody.innerHTML = sorted.map(svc => {
        const customer = state.customers.find(c => c.id === svc.customerId) || { name: 'Unknown' };
        return `
            <tr>
                <td>${customer.name}</td>
                <td>${formatDate(svc.date)}</td>
                <td>${svc.serviceType}</td>
                <td>${CONFIG.currency} ${parseFloat(svc.price).toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// ==================== Customer Management ====================
function loadCustomers() {
    const tbody = document.getElementById('customersTable');
    const searchQuery = document.getElementById('searchCustomer')?.value || '';
    
    let customers = [...state.customers];
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        customers = customers.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.phone.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query)
        );
    }
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tiada customer. Klik "Tambah Customer" untuk daftar.</td></tr>';
        return;
    }
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email || '-'}</td>
            <td>${c.address || '-'}</td>
            <td>${formatDate(c.created)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editCustomer('${c.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteCustomer('${c.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update customer dropdowns in other forms
    updateCustomerDropdowns();
}

function searchCustomers() {
    loadCustomers();
}

function showAddCustomerModal() {
    document.getElementById('customerModalTitle').textContent = 'Tambah Customer Baru';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    openModal('customerModal');
}

function editCustomer(id) {
    const customer = state.customers.find(c => c.id === id);
    if (!customer) return;
    
    document.getElementById('customerModalTitle').textContent = 'Edit Customer';
    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerAddress').value = customer.address || '';
    document.getElementById('customerNotes').value = customer.notes || '';
    
    openModal('customerModal');
}

function saveCustomer() {
    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const notes = document.getElementById('customerNotes').value.trim();
    
    // Validation
    if (!name || !phone) {
        showToast('Sila isi nama dan no. telefon', 'warning');
        return;
    }
    
    if (id) {
        // Update existing
        const index = state.customers.findIndex(c => c.id === id);
        if (index !== -1) {
            state.customers[index] = { ...state.customers[index], name, phone, email, address, notes };
        }
        showToast('Customer dikemaskini', 'success');
    } else {
        // Add new
        const newCustomer = {
            id: generateId('CUS'),
            name,
            phone,
            email,
            address,
            notes,
            created: new Date().toISOString().split('T')[0]
        };
        state.customers.push(newCustomer);
        showToast('Customer ditambah', 'success');
    }
    
    saveToStorage();
    closeModal('customerModal');
    loadCustomers();
    updateDashboardStats();
}

function deleteCustomer(id) {
    if (!confirm('Adakah anda pasti untuk delete customer ini?')) return;
    
    state.customers = state.customers.filter(c => c.id !== id);
    saveToStorage();
    showToast('Customer dihapus', 'success');
    loadCustomers();
    updateDashboardStats();
}

// ==================== Service Records ====================
function loadServices() {
    const tbody = document.getElementById('servicesTable');
    const searchQuery = document.getElementById('searchService')?.value || '';
    
    let services = [...state.services];
    
    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        services = services.filter(s => 
            s.serviceType.toLowerCase().includes(query) ||
            s.notes?.toLowerCase().includes(query)
        );
    }
    
    // Sort by date descending
    services.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tiada servis. Klik "Tambah Servis" untuk rekod.</td></tr>';
        return;
    }
    
    tbody.innerHTML = services.map(svc => {
        const customer = state.customers.find(c => c.id === svc.customerId) || { name: 'Unknown' };
        return `
            <tr>
                <td>${svc.id}</td>
                <td>${customer.name}</td>
                <td>${formatDate(svc.date)}</td>
                <td>${svc.serviceType}</td>
                <td>${CONFIG.currency} ${parseFloat(svc.price).toFixed(2)}</td>
                <td>${svc.notes || '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="editService('${svc.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="deleteService('${svc.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function searchServices() {
    loadServices();
}

function showAddServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Tambah Servis Baru';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    updateCustomerDropdowns();
    openModal('serviceModal');
}

function editService(id) {
    const service = state.services.find(s => s.id === id);
    if (!service) return;
    
    document.getElementById('serviceModalTitle').textContent = 'Edit Servis';
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceCustomer').value = service.customerId;
    document.getElementById('serviceDate').value = service.date;
    document.getElementById('serviceType').value = service.serviceType;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceNotes').value = service.notes || '';
    
    openModal('serviceModal');
}

function saveService() {
    const id = document.getElementById('serviceId').value;
    const customerId = document.getElementById('serviceCustomer').value;
    const date = document.getElementById('serviceDate').value;
    const serviceType = document.getElementById('serviceType').value.trim();
    const price = parseFloat(document.getElementById('servicePrice').value);
    const notes = document.getElementById('serviceNotes').value.trim();
    
    // Validation
    if (!customerId || !date || !serviceType || isNaN(price)) {
        showToast('Sila isi semua ruangan wajib', 'warning');
        return;
    }
    
    if (id) {
        // Update existing
        const index = state.services.findIndex(s => s.id === id);
        if (index !== -1) {
            state.services[index] = { ...state.services[index], customerId, date, serviceType, price, notes };
        }
        showToast('Servis dikemaskini', 'success');
    } else {
        // Add new
        const newService = {
            id: generateId('SRV'),
            customerId,
            date,
            serviceType,
            price,
            notes
        };
        state.services.push(newService);
        showToast('Servis ditambah', 'success');
    }
    
    saveToStorage();
    closeModal('serviceModal');
    loadServices();
    updateDashboardStats();
}

function deleteService(id) {
    if (!confirm('Adakah anda pasti untuk delete servis ini?')) return;
    
    state.services = state.services.filter(s => s.id !== id);
    saveToStorage();
    showToast('Servis dihapus', 'success');
    loadServices();
    updateDashboardStats();
}

// ==================== Appointments ====================
function loadAppointments() {
    const tbody = document.getElementById('appointmentsTable');
    const filter = state.currentFilter;
    
    let appointments = [...state.appointments];
    
    // Apply filter
    if (filter !== 'all') {
        appointments = appointments.filter(a => a.status === filter);
    }
    
    // Sort by date descending
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (appointments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tiada temu janji.</td></tr>';
        return;
    }
    
    tbody.innerHTML = appointments.map(apt => {
        const customer = state.customers.find(c => c.id === apt.customerId) || { name: 'Unknown' };
        return `
            <tr>
                <td>${apt.id}</td>
                <td>${customer.name}</td>
                <td>${formatDate(apt.date)}</td>
                <td>${apt.time}</td>
                <td>${apt.serviceType}</td>
                <td><span class="status-badge ${apt.status}">${getStatusText(apt.status)}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="editAppointment('${apt.id}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn view" onclick="updateAppointmentStatus('${apt.id}')"><i class="fas fa-check"></i></button>
                        <button class="action-btn delete" onclick="deleteAppointment('${apt.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterAppointments(filter) {
    state.currentFilter = filter;
    
    // Update tab active state
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-filter') === filter) {
            tab.classList.add('active');
        }
    });
    
    loadAppointments();
}

function showAddAppointmentModal() {
    document.getElementById('appointmentModalTitle').textContent = 'Temu Janji Baru';
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentId').value = '';
    updateCustomerDropdowns();
    openModal('appointmentModal');
}

function editAppointment(id) {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) return;
    
    document.getElementById('appointmentModalTitle').textContent = 'Edit Temu Janji';
    document.getElementById('appointmentId').value = appointment.id;
    document.getElementById('appointmentCustomer').value = appointment.customerId;
    document.getElementById('appointmentDate').value = appointment.date;
    document.getElementById('appointmentTime').value = appointment.time;
    document.getElementById('appointmentServiceType').value = appointment.serviceType;
    document.getElementById('appointmentStatus').value = appointment.status;
    document.getElementById('appointmentNotes').value = appointment.notes || '';
    
    openModal('appointmentModal');
}

function saveAppointment() {
    const id = document.getElementById('appointmentId').value;
    const customerId = document.getElementById('appointmentCustomer').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const serviceType = document.getElementById('appointmentServiceType').value.trim();
    const status = document.getElementById('appointmentStatus').value;
    const notes = document.getElementById('appointmentNotes').value.trim();
    
    // Validation
    if (!customerId || !date || !time || !serviceType) {
        showToast('Sila isi semua ruangan wajib', 'warning');
        return;
    }
    
    if (id) {
        // Update existing
        const index = state.appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            state.appointments[index] = { ...state.appointments[index], customerId, date, time, serviceType, status, notes };
        }
        showToast('Temu janji dikemaskini', 'success');
    } else {
        // Add new
        const newAppointment = {
            id: generateId('APT'),
            customerId,
            date,
            time,
            serviceType,
            status,
            notes
        };
        state.appointments.push(newAppointment);
        showToast('Temu janji ditambah', 'success');
    }
    
    saveToStorage();
    closeModal('appointmentModal');
    loadAppointments();
    updateDashboardStats();
}

function updateAppointmentStatus(id) {
    const appointment = state.appointments.find(a => a.id === id);
    if (!appointment) return;
    
    // Cycle through statuses
    const statuses = ['pending', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(appointment.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    appointment.status = nextStatus;
    saveToStorage();
    showToast('Status dikemaskini ke: ' + getStatusText(nextStatus), 'success');
    loadAppointments();
    updateDashboardStats();
}

function deleteAppointment(id) {
    if (!confirm('Adakah anda pasti untuk delete temu janji ini?')) return;
    
    state.appointments = state.appointments.filter(a => a.id !== id);
    saveToStorage();
    showToast('Temu janji dihapus', 'success');
    loadAppointments();
    updateDashboardStats();
}

// ==================== Invoices ====================
function loadInvoices() {
    const tbody = document.getElementById('invoicesTable');
    const customerFilter = document.getElementById('invoiceCustomerFilter')?.value || '';
    const dateFrom = document.getElementById('invoiceDateFrom')?.value || '';
    const dateTo = document.getElementById('invoiceDateTo')?.value || '';
    
    let services = [...state.services];
    
    // Apply customer filter
    if (customerFilter) {
        services = services.filter(s => s.customerId === customerFilter);
    }
    
    // Apply date filter
    if (dateFrom) {
        services = services.filter(s => s.date >= dateFrom);
    }
    if (dateTo) {
        services = services.filter(s => s.date <= dateTo);
    }
    
    // Sort by date descending
    services.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (services.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tiada invois.</td></tr>';
        return;
    }
    
    tbody.innerHTML = services.map(svc => {
        const customer = state.customers.find(c => c.id === svc.customerId) || { name: 'Unknown' };
        return `
            <tr>
                <td>${svc.id}</td>
                <td>${customer.name}</td>
                <td>${formatDate(svc.date)}</td>
                <td>${svc.serviceType}</td>
                <td>${CONFIG.currency} ${parseFloat(svc.price).toFixed(2)}</td>
                <td><span class="status-badge completed">Selesai</span></td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn view" onclick="viewInvoice('${svc.id}')"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadCustomerInvoices() {
    loadInvoices();
}

function showGenerateInvoiceModal() {
    updateCustomerDropdowns();
    openModal('invoiceModal');
}

function viewInvoice(id) {
    const service = state.services.find(s => s.id === id);
    if (!service) return;
    
    const customer = state.customers.find(c => c.id === service.customerId) || { name: 'Unknown', phone: '-', address: '-' };
    
    const invoiceHtml = `
        <div class="invoice-preview">
            <div class="invoice-header">
                <div class="company-info">
                    <h1>${state.settings.businessName || 'ServiceBiz'}</h1>
                    <p>${state.settings.businessPhone || '-'}</p>
                    <p>${state.settings.businessAddress || '-'}</p>
                </div>
                <div class="invoice-details">
                    <h2>INVOIS</h2>
                    <p>No: ${service.id}</p>
                    <p>Tarikh: ${formatDate(service.date)}</p>
                </div>
            </div>
            
            <div class="customer-info">
                <h3>Customer:</h3>
                <p><strong>${customer.name}</strong></p>
                <p>No. Telefon: ${customer.phone}</p>
                <p>Alamat: ${customer.address || '-'}</p>
            </div>
            
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Perkhidmatan</th>
                        <th>Harga (RM)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${service.serviceType}</td>
                        <td>${parseFloat(service.price).toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>JUMLAH</strong></td>
                        <td><strong>${CONFIG.currency} ${parseFloat(service.price).toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="invoice-notes">
                <p><strong>Nota:</strong> ${service.notes || '-'}</p>
            </div>
        </div>
    `;
    
    document.getElementById('invoicePreview').innerHTML = invoiceHtml;
    openModal('invoiceModal');
}

function printInvoice() {
    window.print();
}

// ==================== Settings ====================
function loadSettingsPage() {
    document.getElementById('sheetsUrl').value = state.settings.sheetsUrl || '';
    document.getElementById('sheetsNames').value = state.settings.sheetsNames || 'Customers,Services,Appointments';
    document.getElementById('businessName').value = state.settings.businessName || '';
    document.getElementById('businessPhone').value = state.settings.businessPhone || '';
    document.getElementById('businessAddress').value = state.settings.businessAddress || '';
}

function saveSettings() {
    const sheetsUrl = document.getElementById('sheetsUrl').value.trim();
    const sheetsNames = document.getElementById('sheetsNames').value.trim();
    
    // Extract Sheets ID from URL
    let sheetsId = '';
    if (sheetsUrl) {
        const match = sheetsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match) sheetsId = match[1];
    }
    
    state.settings.sheetsUrl = sheetsUrl;
    state.settings.sheetsNames = sheetsNames;
    CONFIG.sheetsId = sheetsId;
    CONFIG.apiUrl = sheetsUrl;
    
    saveToStorage();
    showToast('Tetapan disimpan', 'success');
}

function saveBusinessInfo() {
    const businessName = document.getElementById('businessName').value.trim();
    const businessPhone = document.getElementById('businessPhone').value.trim();
    const businessAddress = document.getElementById('businessAddress').value.trim();
    
    state.settings.businessName = businessName;
    state.settings.businessPhone = businessPhone;
    state.settings.businessAddress = businessAddress;
    
    saveToStorage();
    showToast('Maklumat bisnes disimpan', 'success');
}

function exportData(format) {
    let data, filename, type;
    
    if (format === 'csv') {
        // Export customers as CSV
        data = 'ID,Name,Phone,Email,Address,Created\n';
        state.customers.forEach(c => {
            data += `${c.id},"${c.name}","${c.phone}","${c.email}","${c.address}",${c.created}\n`;
        });
        filename = 'servicebiz_customers.csv';
        type = 'text/csv';
    } else {
        data = JSON.stringify(state.customers, null, 2);
        filename = 'servicebiz_customers.json';
        type = 'application/json';
    }
    
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data diexport: ' + filename, 'success');
}

// ==================== Utility Functions ====================
function generateId(prefix) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return prefix + timestamp + random;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getStatusText(status) {
    const statuses = {
        'pending': 'Menunggu',
        'completed': 'Selesai',
        'cancelled': 'Batal'
    };
    return statuses[status] || status;
}

function updateCustomerDropdowns() {
    const customerSelects = [
        document.getElementById('serviceCustomer'),
        document.getElementById('appointmentCustomer'),
        document.getElementById('invoiceCustomerFilter')
    ];
    
    customerSelects.forEach(select => {
        if (!select) return;
        const selectedValue = select.value;
        select.innerHTML = '<option value="">Pilih Customer...</option>';
        
        state.customers.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            select.appendChild(option);
        });
        
        if (selectedValue) select.value = selectedValue;
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function loadSettings() {
    const saved = localStorage.getItem('servicebiz_settings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };
    }
}

// ==================== Modal Functions ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ==================== Toast Notifications ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

// ==================== Refresh Function ====================
function refreshDashboard() {
    loadData();
    updateDashboardStats();
    loadRecentAppointments();
    loadRecentServices();
}