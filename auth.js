async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
    return JSON.parse(localStorage.getItem('logfilms_users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('logfilms_users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('logfilms_current') || 'null');
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('logfilms_current', JSON.stringify(user));
    } else {
        localStorage.removeItem('logfilms_current');
    }
}

async function registerUser(username, password) {
    const users = getUsers();
    if (users[username]) {
        return { ok: false, error: 'Користувач вже існує' };
    }
    const passwordHash = await sha256(password);
    const uuid = crypto.randomUUID();
    users[username] = { uuid, passwordHash, createdAt: new Date().toISOString() };
    saveUsers(users);
    setCurrentUser({ username, uuid });
    return { ok: true };
}

async function loginUser(username, password) {
    const users = getUsers();
    const user = users[username];
    if (!user) {
        return { ok: false, error: 'Користувача не знайдено' };
    }
    const passwordHash = await sha256(password);
    if (passwordHash !== user.passwordHash) {
        return { ok: false, error: 'Невірний пароль' };
    }
    setCurrentUser({ username, uuid: user.uuid });
    return { ok: true };
}

function logoutUser() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        if (getCurrentUser()) {
            window.location.href = 'index.html';
            return;
        }
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');
            errorEl.textContent = '';
            const result = await loginUser(username, password);
            if (result.ok) {
                window.location.href = 'index.html';
            } else {
                errorEl.textContent = result.error;
            }
        });
    }

    if (registerForm) {
        if (getCurrentUser()) {
            window.location.href = 'index.html';
            return;
        }
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value.trim();
            const password = document.getElementById('registerPassword').value;
            const errorEl = document.getElementById('registerError');
            errorEl.textContent = '';
            if (username.length < 3) {
                errorEl.textContent = 'Ім\'я має бути мінімум 3 символи';
                return;
            }
            if (password.length < 4) {
                errorEl.textContent = 'Пароль має бути мінімум 4 символи';
                return;
            }
            const result = await registerUser(username, password);
            if (result.ok) {
                window.location.href = 'index.html';
            } else {
                errorEl.textContent = result.error;
            }
        });
    }
});