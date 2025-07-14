// auth-check.js - Da includere in ogni pagina protetta

// Configurazione Supabase - SOSTITUISCI CON I TUOI DATI
const SUPABASE_URL = 'https://iexqedfjnmxvsmyezyxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHFlZGZqbm14dnNteWV6eXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTQxMjgsImV4cCI6MjA2ODA3MDEyOH0.1h0IZfARzWVcw3N-NTzQdiBkWhfM7VLEaqrG51Iy2bw';

// Inizializza Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Verifica autenticazione
async function verificaAutenticazione() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
            // Utente non autenticato, redirect al login
            window.location.href = 'login.html';
            return false;
        }
        
        // Salva info utente per uso nelle pagine
        window.utenteCorrente = session.user;
        
        // Aggiungi info utente alla navbar se esiste
        const navbarText = document.querySelector('.navbar-text');
        if (navbarText) {
            navbarText.innerHTML = `
                <span class="text-white me-3">
                    <i class="bi bi-person-circle"></i> ${session.user.email}
                </span>
                <button class="btn btn-sm btn-outline-light" onclick="logout()">
                    <i class="bi bi-box-arrow-right"></i> Esci
                </button>
            `;
        }
        
        return true;
    } catch (error) {
        console.error('Errore verifica autenticazione:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Funzione di logout
async function logout() {
    if (confirm('Vuoi davvero uscire?')) {
        try {
            await supabaseClient.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Errore durante il logout:', error);
            alert('Errore durante il logout. Riprova.');
        }
    }
}

// Esegui verifica al caricamento della pagina
document.addEventListener('DOMContentLoaded', verificaAutenticazione);

// Ascolta cambiamenti di stato autenticazione
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        window.location.href = 'login.html';
    }
});