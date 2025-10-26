// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    // --- Handle Registration ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const role = registerForm.role.value;

            try {
                const res = await fetch('https://elite-influence.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role })
                });

                if (res.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html'; // Redirect to login
                } else {
                    const data = await res.json();
                    alert(`Registration failed: ${data.message}`);
                }
            } catch (err) {
                console.error('Registration error:', err);
                alert('An error occurred during registration.');
            }
        });
    }

    // --- Handle Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const res = await fetch('http://elite-influence.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Login failed');
                }

                const { token, role } = await res.json();
                
                // Store the token in the browser's local storage
                localStorage.setItem('token', token);

                alert('Login successful!');
                
                // Redirect based on role
                if (role === 'company') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'campaigns.html';
                }

            } catch (err) {
                console.error('Login error:', err);
                alert(`Login failed: ${err.message}`);
            }
        });
    }
});