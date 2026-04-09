/* --- js/reacties.js --- */
import { db } from './firebase.js';
import {
    collection, addDoc, getDocs, query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function laadReacties(storyId) {
    const lijst = document.getElementById(`reacties-lijst-${storyId}`);
    if (!lijst) return;

    lijst.innerHTML = '<em class="reacties-laden">Reacties laden...</em>';

    try {
        const q = query(
            collection(db, 'reacties'),
            where('storyId', '==', storyId)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
            lijst.innerHTML = '<p class="geen-reacties">Nog geen reacties — wees de eerste!</p>';
            return;
        }

        const reacties = [];
        snap.forEach(doc => reacties.push({ id: doc.id, ...doc.data() }));

        // Sorteren op timestamp (oudste eerst)
        reacties.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

        lijst.innerHTML = reacties.map(r => {
            const datum = r.timestamp?.toDate
                ? r.timestamp.toDate().toLocaleDateString('nl-NL', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
                : '';
            return `
                <div class="reactie-item">
                    <div class="reactie-meta">
                        <strong>${escapeHtml(r.naam)}</strong>
                        ${datum ? `<span class="reactie-datum">${datum}</span>` : ''}
                    </div>
                    <p class="reactie-tekst">${escapeHtml(r.tekst)}</p>
                </div>`;
        }).join('');

    } catch (e) {
        lijst.innerHTML = '<p class="geen-reacties">Reacties tijdelijk niet beschikbaar.</p>';
        console.error('Fout bij laden reacties:', e);
    }
}

async function slaReactieOp(storyId, naam, tekst) {
    await addDoc(collection(db, 'reacties'), {
        storyId,
        naam: naam.trim(),
        tekst: tekst.trim(),
        timestamp: serverTimestamp()
    });
}

export function initReacties(storyId) {
    const storyEl = document.getElementById(`story-${storyId}`);
    if (!storyEl || storyEl.dataset.reactiesInit) return;
    storyEl.dataset.reactiesInit = '1';

    const sectie = document.createElement('div');
    sectie.className = 'reacties-sectie';
    sectie.innerHTML = `
        <div class="reacties-header">
            <i class="fas fa-comments"></i> Reacties
        </div>
        <div class="reacties-lijst" id="reacties-lijst-${storyId}"></div>
        <form class="reactie-form" id="form-${storyId}" novalidate>
            <div class="reactie-form-velden">
                <input
                    type="text"
                    id="naam-${storyId}"
                    placeholder="Jouw naam"
                    required
                    maxlength="50"
                    autocomplete="nickname"
                >
                <textarea
                    id="tekst-${storyId}"
                    placeholder="Laat een reactie achter... (&quot;Ik was erbij!&quot;, &quot;Top verhaal!&quot;)"
                    required
                    maxlength="500"
                    rows="3"
                ></textarea>
            </div>
            <button type="submit" class="reactie-submit-btn">
                <i class="fas fa-paper-plane"></i> Reageer
            </button>
        </form>`;

    storyEl.appendChild(sectie);

    laadReacties(storyId);

    document.getElementById(`form-${storyId}`).addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const naamEl = document.getElementById(`naam-${storyId}`);
        const tekstEl = document.getElementById(`tekst-${storyId}`);
        const naam = naamEl.value.trim();
        const tekst = tekstEl.value.trim();

        if (!naam || !tekst) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Versturen...';

        try {
            await slaReactieOp(storyId, naam, tekst);
            e.target.reset();
            await laadReacties(storyId);
            btn.innerHTML = '<i class="fas fa-check"></i> Verstuurd!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Reageer';
            }, 2500);
        } catch (err) {
            console.error('Fout bij plaatsen reactie:', err);
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Reageer';
            alert('Er ging iets mis. Probeer het opnieuw.');
        }
    });
}
