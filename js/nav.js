/**
 * nav.js - De definitieve versie voor lokale mappenstructuur
 */

// 1. Bereken dynamisch de 'base' prefix (hoeveel stappen terug naar de hoofdmap)
const pathParts = window.location.pathname.split('/');
const momentenIndex = pathParts.indexOf('momenten');

let prefix = '';
if (momentenIndex !== -1) {
    // Tel hoeveel mappen we ná de hoofdmap zitten
    const diepte = (pathParts.length - 1) - momentenIndex;
    prefix = '../'.repeat(diepte);
}

// 2. Gebruik de 'prefix' variabele voor ALLE links en afbeeldingen
const menuHTML = `
<nav class="navbar">
    <a href="${prefix}index.html" class="nav-logo">
        <img src="${prefix}img/logo_psv.svg" alt="PSV Logo">
        HET IS NIET <span>TE GELOVEN</span>
    </a>
    <div class="nav-links">
        <a href="${prefix}index.html" class="nav-link">Home</a>
        <div class="nav-item">
            <a href="#" class="nav-link">Momenten <i class="fas fa-caret-down"></i></a>
            <div class="dropdown-content">
                <a href="${prefix}1963.html">1963 - Kampioensduel</a>
                <a href="${prefix}1988.html">1988 - Rollertje</a>
                <a href="${prefix}1991.html">1991 - Volendam</a>
                <a href="${prefix}1999.html">1999 - Mirakel</a>
                <a href="${prefix}dying-seconds.html">Dying Seconds</a>
                <a href="${prefix}2007.html">2007 - 5-1 Vitesse</a>
                <a href="${prefix}2010.html">2010 - De 10-0</a>
                <a href="${prefix}2016.html">2016 - Vijverberg</a>
                <a href="${prefix}2025.html">2025 - Remontada</a>
                <a href="${prefix}andere-kant.html">De andere kant</a>
            </div>
        </div>
        <a href="${prefix}boek-info.html" class="nav-link">Het Boek</a>
        <a href="${prefix}index.html#meedoen" class="btn-cta">Deel Verhaal</a>
    </div>
</nav>
`;

function laadOnderdelen() {
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) menuContainer.innerHTML = menuHTML;

    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `<footer>&copy; 2026 Het is niet te geloven. Voor en door PSV-supporters.</footer>`;
    }
}

laadOnderdelen();