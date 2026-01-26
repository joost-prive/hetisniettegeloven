import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// JOUW ECHTE CONFIGURATIE (uit je eerdere bestanden)
const firebaseConfig = {
  apiKey: "AIzaSyBvCi5SGAG_tHESnqAcjbzGOJUSBkzBnJQ",
  authDomain: "hetisniettegeloven-afda8.firebaseapp.com",
  projectId: "hetisniettegeloven-afda8",
  storageBucket: "hetisniettegeloven-afda8.firebasestorage.app",
  messagingSenderId: "366578026426",
  appId: "1:366578026426:web:b819207d50574d8a9abf83"
};

// Starten
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// --- FUNCTIE: VERHALEN OPHALEN ---
export async function laadVerhalen(momentNaam, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = "<em>Verhalen laden...</em>";

    try {
// NIEUWE VERSIE (werkt altijd direct)
const q = query(
    collection(db, "verhalen"), 
    where("moment", "==", momentNaam)
);

        const snapshot = await getDocs(q);

        container.innerHTML = "";
        
        if (snapshot.empty) {
            container.innerHTML = "<p style='color:#666; font-style:italic;'>Nog geen verhalen. Wees de eerste!</p>";
            return;
        }

snapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id; // Uniek ID van Firebase voor de stemknop
    let datumString = "";
    if(data.datum && data.datum.toDate) {
        datumString = data.datum.toDate().toLocaleDateString('nl-NL');
    }

    container.innerHTML += `
        <div class="story-item" data-votes="${data.likes || 0}" id="item-${id}">
            <div class="story-header-row">
                <div class="story-content-left">
                    <span class="story-tag tag-supporter">Supporter</span>
                    <h4 class="story-title">${data.naam || 'Anoniem'}</h4>
                    <p class="story-teaser">"${data.verhaal}"</p>
                    <span style="color: #999; font-size: 0.8rem;">Gepost op: ${datumString}</span>
                </div>
                <button id="btn-${id}" class="vote-btn-standard" onclick="voteAndSort('${id}')">
                    <i class="fas fa-heart"></i> <span id="count-${id}">${data.likes || 0}</span> Magisch!
                </button>
            </div>
        </div>
    `;
});

// Nadat alle verhalen zijn geladen, voeren we de sortering uit
if (typeof sorteerVerhalen === 'function') {
    sorteerVerhalen();
}
    } catch (error) {
        console.error("Fout bij laden:", error);
        container.innerHTML = "Er ging iets mis bij het laden van de verhalen. (Check console)";
    }
}

// --- FUNCTIE: VERHAAL VERSTUREN (VOOR INDEX PAGINA) ---
export function activeerFormulier(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const origineleTekst = btn.innerText;
        
        btn.disabled = true;
        btn.innerText = "Bezig met versturen...";

        try {
            await addDoc(collection(db, "verhalen"), {
                naam: document.getElementById('naam').value,
                moment: document.getElementById('moment').value, // Selectbox waarde
                verhaal: document.getElementById('verhaal').value,
                datum: new Date(),
                goedgekeurd: true, // Zet op false als je eerst wilt keuren
                likes: 0
            });
            
            alert("Bedankt! Je verhaal is ontvangen.");
            form.reset();
        } catch (error) {
            console.error("Fout:", error);
            alert("Er ging iets mis. Probeer het later nog eens.");
        } finally {
            btn.disabled = false;
            btn.innerText = origineleTekst;
        }
    });
}