// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the campaigns page
    if (document.getElementById('campaign-list')) {
        const campaignList = document.getElementById('campaign-list');
        const formModal = document.getElementById('campaign-modal');
        const detailsModal = document.getElementById('details-modal'); // New details modal
        const openModalBtn = document.getElementById('open-modal-btn');
        const closeFormBtn = formModal.querySelector('.close-btn');
        const closeDetailsBtn = detailsModal.querySelector('.close-details-btn'); // New close button
        const campaignForm = document.getElementById('campaign-form');

        // Details modal content elements
        const modalTitle = document.getElementById('modal-title');
        const modalBrand = document.getElementById('modal-brand');
        const modalDescription = document.getElementById('modal-description');
        
        const API_URL = 'https://elite-influence.onrender.com/api/campaigns'; // Update with your actual API URL

        // --- Function to Fetch and Display Campaigns ---
        const fetchAndDisplayCampaigns = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                const campaigns = await response.json();

                campaignList.innerHTML = ''; // Clear existing list

                campaigns.forEach(campaign => {
                    const card = document.createElement('div');
                    card.className = 'campaign-card';
                    card.innerHTML = `
                        <h2>${campaign.title}</h2>
                        <p class="brand">Brand: ${campaign.brand}</p>
                        <p>${campaign.description.substring(0, 100)}...</p> 
                        <button class="apply-button">View & Apply</button>
                    `;

                    // --- Add click listener to the whole card ---
                    card.addEventListener('click', () => {
                        // Populate the details modal with campaign data
                        modalTitle.textContent = campaign.title;
                        modalBrand.textContent = `Brand: ${campaign.brand}`;
                        modalDescription.textContent = campaign.description;
                        // Show the details modal
                        detailsModal.style.display = 'block';
                    });

                    campaignList.appendChild(card);
                });
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                campaignList.innerHTML = '<p>Could not load campaigns. Is the server running?</p>';
            }
        };

        // --- Form Modal Logic ---
        openModalBtn.addEventListener('click', () => formModal.style.display = 'block');
        closeFormBtn.addEventListener('click', () => formModal.style.display = 'none');
        
        // --- Details Modal Logic ---
        closeDetailsBtn.addEventListener('click', () => detailsModal.style.display = 'none');

        // Close modals if user clicks outside of them
        window.addEventListener('click', (event) => {
            if (event.target == formModal) {
                formModal.style.display = 'none';
            }
            if (event.target == detailsModal) {
                detailsModal.style.display = 'none';
            }
        });

        // --- Form Submission Logic ---
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData),
                });

                if (response.ok) {
                    formModal.style.display = 'none';
                    campaignForm.reset(); 
                    fetchAndDisplayCampaigns(); 
                    alert('Campaign posted successfully!');
                } else {
                    alert('Failed to post campaign.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
        
        // Initial load of campaigns
        fetchAndDisplayCampaigns();
    }
});