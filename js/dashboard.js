// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const campaignForm = document.getElementById('campaign-form');
    const logoutButton = document.getElementById('logout-button');
    const API_URL = 'http://localhost:3000/api/campaigns';
    
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // If no token, redirect to login page immediately
    if (!token) {
        alert('You are not logged in. Redirecting to login page.');
        window.location.href = 'login.html';
        return; // Stop executing the rest of the script
    }

    // --- Handle Campaign Form Submission ---
    if (campaignForm) {
        campaignForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            const campaignData = {
                title: campaignForm.title.value,
                brand: campaignForm.brand.value,
                description: campaignForm.description.value,
            };

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        // Add the token to the request header
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(campaignData),
                });

                if (response.status === 403) {
                     alert('Failed to post: You do not have permission.');
                } else if (response.ok) {
                    campaignForm.reset(); 
                    alert('Campaign posted successfully!');
                } else {
                    const data = await response.json();
                    alert(`Failed to post campaign: ${data.message}`);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    
    // --- Handle Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove the token from storage
            localStorage.removeItem('token');
            alert('You have been logged out.');
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
});