/* --- js/main.js --- */
import { stemOpVerhaal, laadStemmen } from './voting.js';
import { initReacties } from './reacties.js';

// Universele Toggle — opent verhaal EN laadt reacties bij eerste opening
window.toggleStory = function(id, element) {
    const content = document.getElementById(id);
    if (!content) return;
    const isHidden = !content.style.display || content.style.display === "none";
    if (isHidden) {
        content.style.display = "block";
        element.innerHTML = '<i class="fas fa-chevron-up"></i> Sluit verhaal';
        element.closest('.story-item')?.classList.add('active-card');

        // Reacties laden bij eerste opening van een story-* element
        if (id.startsWith('story-')) {
            initReacties(id.slice(6)); // 'story-linskens' → 'linskens'
        }
    } else {
        content.style.display = "none";
        element.innerHTML = '<i class="fas fa-chevron-down"></i> Lees het verhaal';
        element.closest('.story-item')?.classList.remove('active-card');
    }
};

// Universele Sortering
window.sorteerVerhalen = function() {
    const items = Array.from(document.querySelectorAll('.story-item'));
    if (items.length === 0) return;

    const mainContainer = document.getElementById('story-container');
    if (!mainContainer) return;

    items.sort((a, b) => (parseInt(b.getAttribute('data-votes')) || 0) - (parseInt(a.getAttribute('data-votes')) || 0));
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
