/* --- js/voting.js --- */
import { doc, updateDoc, setDoc, getDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './firebase.js';

// Functie 1: Haal het huidige aantal stemmen op als de pagina laadt
export async function laadStemmen(uniekeId) {
    const countSpan = document.getElementById(`count-${uniekeId}`);
    const btn = document.getElementById(`btn-${uniekeId}`);
    
    // Check of gebruiker lokaal al gestemd heeft (om knop rood te maken)
    if (localStorage.getItem(`voted_${uniekeId}`)) {
        btn.classList.add('voted');
        btn.disabled = true; // Optioneel: voorkom dubbel klikken
    }

    try {
        const docRef = doc(db, "stemmen", uniekeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            countSpan.innerText = docSnap.data().aantal || 0;
        } else {
            countSpan.innerText = 0;
        }
    } catch (error) {
        console.error("Kon stemmen niet laden", error);
    }
}

// Functie 2: Voer de stem actie uit
export async function stemOpVerhaal(uniekeId) {
    // 1. Check of al gestemd
    if (localStorage.getItem(`voted_${uniekeId}`)) {
        alert("Je hebt dit verhaal al Magisch gevonden!");
        return;
    }

    const btn = document.getElementById(`btn-${uniekeId}`);
    const countSpan = document.getElementById(`count-${uniekeId}`);
    const docRef = doc(db, "stemmen", uniekeId);

    try {
        // 2. Probeer de teller op te hogen
        // We gebruiken setDoc met merge, zodat als het document nog niet bestaat, het wordt aangemaakt
        await setDoc(docRef, { aantal: increment(1) }, { merge: true });

        // 3. Update de interface direct (zodat het snel voelt)
        let huidig = parseInt(countSpan.innerText || "0");
        countSpan.innerText = huidig + 1;
        
        // 4. Markeer als gestemd
        localStorage.setItem(`voted_${uniekeId}`, "true");
        btn.classList.add('voted');
        btn.disabled = true;

    } catch (error) {
        console.error("Fout bij stemmen:", error);
        alert("Er ging iets mis bij het stemmen.");
    }
}