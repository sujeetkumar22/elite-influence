// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the campaigns page
    if (document.getElementById('campaign-list')) {
        const campaignList = document.getElementById('campaign-list');
        const detailsModal = document.getElementById('details-modal');
        
        // Make sure the details modal and its close button exist
        if (detailsModal) {
            const closeDetailsBtn = detailsModal.querySelector('.close-details-btn');
            
            // Details modal content elements
            const modalTitle = document.getElementById('modal-title');
            const modalBrand = document.getElementById('modal-brand');
            const modalDescription = document.getElementById('modal-description');
            
            const API_URL = 'https://elite-influence.onrender.com/api/campaigns';

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
                            modalTitle.textContent = campaign.title;
                            modalBrand.textContent = `Brand: ${campaign.brand}`;
                            modalDescription.textContent = campaign.description;
                            detailsModal.style.display = 'block';
                        });
                        campaignList.appendChild(card);
                    });
                } catch (error) {
                    console.error('Error fetching campaigns:', error);
                    campaignList.innerHTML = '<p>Could not load campaigns. Is the server running?</p>';
                }
            };

            // --- Details Modal Logic ---
            closeDetailsBtn.addEventListener('click', () => detailsModal.style.display = 'none');

            window.addEventListener('click', (event) => {
                if (event.target == detailsModal) {
                    detailsModal.style.display = 'none';
                }
            });
            
            // Initial load of campaigns
            fetchAndDisplayCampaigns();
        }
    }
});