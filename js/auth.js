// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const toggleLink = document.getElementById('toggle-link');
    const toggleLinkContainer = document.getElementById('toggle-link-container');
    const roleSelection = document.getElementById('role-selection');
    const messageArea = document.getElementById('message-area');
    
    let isLoginMode = true;

    // Function to switch between Login and Register modes
    const toggleMode = () => {
        isLoginMode = !isLoginMode;
        formTitle.textContent = isLoginMode ? 'Login' : 'Sign Up';
        submitButton.textContent = isLoginMode ? 'Login' : 'Create Account';
        roleSelection.classList.toggle('hidden', isLoginMode);
        
        if (isLoginMode) {
            toggleLinkContainer.innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Sign Up</a>';
        } else {
            toggleLinkContainer.innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
        }
        
        document.getElementById('toggle-link').addEventListener('click', (e) => {
            e.preventDefault();
            toggleMode();
        });
        messageArea.textContent = '';
    };

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMode();
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;
        const role = form.role.value;
        
        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
        const body = isLoginMode ? { email, password } : { email, password, role };

        try {
            const response = await fetch(`https://elite-influence.onrender.com${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            // Find this 'if' block
            if (response.ok) {
                messageArea.style.color = 'green';
                messageArea.textContent = data.message;

                // Find this nested 'if' block for login mode
                if(isLoginMode) {
                    // ▼▼▼ THIS IS THE LINE TO ADD ▼▼▼
                    localStorage.setItem('eliteUser', JSON.stringify(data.user));

                    // On successful login, redirect to the campaigns page after a short delay
                    setTimeout(() => {
                        window.location.href = 'campaigns.html';
                    }, 1500);
                }
            } else {
                messageArea.style.color = 'red';
                messageArea.textContent = data.message;
            }
        } catch (error) {
            messageArea.style.color = 'red';
            messageArea.textContent = 'An error occurred. Please try again.';
            console.error('Auth error:', error);
        }
    });
});
