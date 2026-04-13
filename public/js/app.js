// Configuration
const API = '';
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser) {
        window.location.href = '/index.html';
    } else {
        initApp();
    }
});

// Initialiser l'application
function initApp() {
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userRole').textContent = currentUser.role.toUpperCase();
    setActiveNavLink();
}

// API helper - récupère le token à chaque fois
async function api(method, path, body) {
    const token = localStorage.getItem('token');
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (token) {
        opts.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(`${API}${path}`, opts);
    const data = await res.json();
    if (!res.ok) {
        if (res.status === 401) {
            logout();
            throw new Error('Authentification expirée');
        }
        throw new Error(data.error || 'Erreur');
    }
    return data;
}

// Toast notifications
function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

// Auth
function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
}

// Navigation
function navigate(page) {
    window.location.href = `/${page}.html`;
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.includes(currentPage)) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

// Modal
function openModal(html) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Helpers
function statusBadge(s) { 
    return `<span class="status status-${s}">${s.replace(/_/g, ' ')}</span>`;
}

function formatDate(d) {
    return d ? new Date(d).toLocaleDateString('fr-FR') : '-';
}

function formatDateTime(d) {
    return d ? new Date(d).toLocaleString('fr-FR') : '-';
}

// Table actions
function editItem(id, page) {
    window.dispatchEvent(new CustomEvent('editItem', { detail: { id, page } }));
}

function deleteItem(id, endpoint, callback) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        api('DELETE', `/api/${endpoint}/${id}`)
            .then(() => {
                toast('Élément supprimé');
                callback();
            })
            .catch(e => toast(e.message, 'error'));
    }
}

// Permissions
function canEdit(userRole, requiredRoles) {
    return requiredRoles.includes(userRole);
}

function canDelete(userRole, requiredRoles) {
    return requiredRoles.includes(userRole);
}
