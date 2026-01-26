/* --- js/main.js --- */
import { stemOpVerhaal, laadStemmen } from './voting.js';

// Universele Toggle
window.toggleStory = function(id, element) {
    const content = document.getElementById(id);
    if (!content) return;
    const isHidden = !content.style.display || content.style.display === "none";
    if (isHidden) {
        content.style.display = "block";
        element.innerHTML = '<i class="fas fa-chevron-up"></i> Sluit verhaal';
        element.closest('.story-item')?.classList.add('active-card');
    } else {
        content.style.display = "none";
        element.innerHTML = '<i class="fas fa-chevron-down"></i> Lees het verhaal';
        element.closest('.story-item')?.classList.remove('active-card');
    }
};

// Universele Sortering
window.sorteerVerhalen = function() {
    // Zoek in alle mogelijke containers waar story-items in kunnen staan
    const items = Array.from(document.querySelectorAll('.story-item')); 
    if (items.length === 0) return;

    // Pak de hoofdcontainer waar alles in moet komen te staan
    const mainContainer = document.getElementById('story-container');
    if (!mainContainer) return;

    // Sorteer op basis van de data-votes attribuut
    items.sort((a, b) => (parseInt(b.getAttribute('data-votes')) || 0) - (parseInt(a.getAttribute('data-votes')) || 0));
    
    // Verplaats alle items naar de hoofdcontainer in de juiste volgorde
    items.forEach(item => mainContainer.appendChild(item));
};

// De gedeelde stem-functie
window.voteAndSort = async function(id) {
    await stemOpVerhaal(id);
    const countSpan = document.getElementById('count-' + id);
    const storyItem = document.getElementById('item-' + id);
    if (countSpan && storyItem) {
        storyItem.setAttribute('data-votes', parseInt(countSpan.innerText) || 0);
    }
    sorteerVerhalen();
};