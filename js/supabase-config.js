// Configurazione Supabase
// IMPORTANTE: Sostituisci questi valori con quelli del tuo progetto Supabase
const SUPABASE_URL = 'https://iexqedfjnmxvsmyezyxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHFlZGZqbm14dnNteWV6eXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTQxMjgsImV4cCI6MjA2ODA3MDEyOH0.1h0IZfARzWVcw3N-NTzQdiBkWhfM7VLEaqrG51Iy2bw';

// Inizializza il client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funzioni helper per il database
const db = {
    // Materiali
    async getMateriali() {
        const { data, error } = await supabase
            .from('materiali')
            .select('*')
            .order('nome');
        
        if (error) {
            console.error('Errore nel recupero materiali:', error);
            return [];
        }
        return data;
    },

    // Clienti
    async getClienti() {
        const { data, error } = await supabase
            .from('clienti')
            .select('*')
            .order('nome');
        
        if (error) {
            console.error('Errore nel recupero clienti:', error);
            return [];
        }
        return data;
    },

    async saveCliente(cliente) {
        const { data, error } = await supabase
            .from('clienti')
            .insert([cliente])
            .select();
        
        if (error) {
            console.error('Errore nel salvataggio cliente:', error);
            return null;
        }
        return data[0];
    },

    // Preventivi
    async savePreventivo(preventivo) {
        const { data, error } = await supabase
            .from('preventivi')
            .insert([preventivo])
            .select();
        
        if (error) {
            console.error('Errore nel salvataggio preventivo:', error);
            return null;
        }
        return data[0];
    },

    async saveArticolo(articolo) {
        const { data, error } = await supabase
            .from('articoli_preventivo')
            .insert([articolo])
            .select();
        
        if (error) {
            console.error('Errore nel salvataggio articolo:', error);
            return null;
        }
        return data[0];
    },

    async saveArticoloMateriali(articoloMateriali) {
        const { data, error } = await supabase
            .from('articoli_materiali')
            .insert(articoloMateriali)
            .select();
        
        if (error) {
            console.error('Errore nel salvataggio materiali articolo:', error);
            return null;
        }
        return data;
    },

    // Storage per immagini
    async uploadImmagine(file, path) {
        const { data, error } = await supabase.storage
            .from('immagini')
            .upload(path, file);
        
        if (error) {
            console.error('Errore upload immagine:', error);
            return null;
        }
        
        // Ottieni URL pubblico
        const { data: { publicUrl } } = supabase.storage
            .from('immagini')
            .getPublicUrl(path);
        
        return publicUrl;
    }
};