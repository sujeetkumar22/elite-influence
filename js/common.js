// This code runs on every page
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the user data from localStorage
    const user = JSON.parse(localStorage.getItem('eliteUser'));

    // 2. Check if a user exists
    if (user) {
        // If yes, the user is logged in.
        // Remove the "Login" link and add "Welcome" text and a "Logout" link.
        
        // ... code to change the navigation bar ...

        // 3. Add the click handler for the new Logout link
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the link from trying to navigate anywhere
            localStorage.removeItem('eliteUser'); // The most important part!
            window.location.href = 'index.html'; // Redirect to home page
        });
    }
});