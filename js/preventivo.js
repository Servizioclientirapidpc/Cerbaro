// Variabili globali
let materialiDB = [];
let numeroArticolo = 0;

// Inizializzazione
document.addEventListener('DOMContentLoaded', async function() {
    // Imposta data odierna
    document.getElementById('data').value = new Date().toISOString().split('T')[0];
    
    // Carica materiali dal database
    materialiDB = await db.getMateriali();
    
    // Aggiungi primo articolo
    aggiungiArticolo();
    
    // Gestisci submit form
    document.getElementById('formPreventivo').addEventListener('submit', async (e) => {
        e.preventDefault();
        await generaPDF();
    });
});

// Funzione per aggiungere un articolo
function aggiungiArticolo() {
    numeroArticolo++;
    const container = document.getElementById('containerArticoli');
    const template = document.getElementById('templateArticolo');
    const clone = template.content.cloneNode(true);
    
    // Imposta numero articolo
    clone.querySelector('.numeroArticolo').textContent = numeroArticolo;
    
    container.appendChild(clone);
    
    // Aggiungi primo materiale
    const ultimoArticolo = container.lastElementChild;
    aggiungiMateriale(ultimoArticolo.querySelector('.btn-outline-primary'));
}

// Funzione per rimuovere un articolo
function rimuoviArticolo(button) {
    if (confirm('Sei sicuro di voler rimuovere questo articolo?')) {
        button.closest('.articolo').remove();
        calcolaTotale();
        // Rinumera articoli
        document.querySelectorAll('.numeroArticolo').forEach((el, i) => {
            el.textContent = i + 1;
        });
        numeroArticolo = document.querySelectorAll('.articolo').length;
    }
}

// Funzione per aggiungere un materiale
function aggiungiMateriale(button) {
    const materialiList = button.previousElementSibling;
    const template = document.getElementById('templateMateriale');
    const clone = template.content.cloneNode(true);
    
    // Popola select con materiali
    const select = clone.querySelector('.selectMateriale');
    materialiDB.forEach(mat => {
        const option = document.createElement('option');
        option.value = mat.id;
        option.textContent = `${mat.nome} (€${mat.prezzo_kg}/${mat.unita})`;
        option.dataset.prezzo = mat.prezzo_kg;
        select.appendChild(option);
    });
    
    // Aggiungi evento per aggiornare prezzo
    select.addEventListener('change', function() {
        const prezzoInput = this.closest('.materiale-row').querySelector('.prezzoMateriale');
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            prezzoInput.value = `€ ${selectedOption.dataset.prezzo}`;
        } else {
            prezzoInput.value = '';
        }
        calcolaTotale();
    });
    
    materialiList.appendChild(clone);
}

// Funzione per rimuovere un materiale
function rimuoviMateriale(button) {
    button.closest('.materiale-row').remove();
    calcolaTotale();
}

// Funzione per calcolare totali
function calcolaTotale() {
    let totaleGenerale = 0;
    const costoOrario = 30; // Costo fisso orario
    
    document.querySelectorAll('.articolo').forEach(articolo => {
        let totaleArticolo = 0;
        
        // Calcola totale materiali
        articolo.querySelectorAll('.materiale-row').forEach(row => {
            const select = row.querySelector('.selectMateriale');
            const quantita = parseFloat(row.querySelector('.quantitaMateriale').value) || 0;
            
            if (select.value && quantita > 0) {
                const prezzo = parseFloat(select.options[select.selectedIndex].dataset.prezzo);
                totaleArticolo += prezzo * quantita;
            }
        });
        
        // Aggiungi costo manodopera
        const ore = parseFloat(articolo.querySelector('.oreLavoro').value) || 0;
        totaleArticolo += ore * costoOrario;
        
        // Aggiorna totale articolo
        articolo.querySelector('.totaleArticolo').value = `€ ${totaleArticolo.toFixed(2).replace('.', ',')}`;
        
        totaleGenerale += totaleArticolo;
    });
    
    // Aggiorna totale generale
    document.getElementById('totalePreventivo').textContent = totaleGenerale.toFixed(2).replace('.', ',');
}

// Funzione per salvare bozza
async function salvaBozza() {
    alert('Funzione in sviluppo - La bozza verrà salvata nel database');
    // TODO: Implementare salvataggio bozza
}

// Funzione per generare PDF
async function generaPDF() {
    // Raccogli dati
    const datiPreventivo = {
        cliente: {
            nome: document.getElementById('clienteNome').value,
            indirizzo: document.getElementById('clienteIndirizzo').value,
            citta: document.getElementById('clienteCitta').value,
            cap: document.getElementById('clienteCap').value,
            provincia: document.getElementById('clienteProvincia').value,
            piva: document.getElementById('clientePIVA').value
        },
        preventivo: {
            data: document.getElementById('data').value,
            oggetto: document.getElementById('oggetto').value,
            totale: document.getElementById('totalePreventivo').textContent
        },
        articoli: []
    };
    
    // Raccogli articoli
    document.querySelectorAll('.articolo').forEach((articolo, index) => {
        const articoloData = {
            numero: index + 1,
            descrizione: articolo.querySelector('.descrizioneArticolo').value,
            oreLavoro: articolo.querySelector('.oreLavoro').value,
            totale: articolo.querySelector('.totaleArticolo').value,
            materiali: [],
            immagineUrl: null
        };
        
        // Raccogli materiali
        articolo.querySelectorAll('.materiale-row').forEach(row => {
            const select = row.querySelector('.selectMateriale');
            if (select.value) {
                articoloData.materiali.push({
                    nome: select.options[select.selectedIndex].text.split(' (')[0],
                    quantita: row.querySelector('.quantitaMateriale').value,
                    prezzo: row.querySelector('.prezzoMateriale').value
                });
            }
        });
        
        // Gestisci immagine se presente
        const fileInput = articolo.querySelector('.immagineArticolo');
        if (fileInput && fileInput.files[0]) {
            // TODO: Caricare su Supabase Storage e ottenere URL
            // Per ora usiamo un data URL locale
            const reader = new FileReader();
            reader.onload = function(e) {
                articoloData.immagineUrl = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
        
        datiPreventivo.articoli.push(articoloData);
    });
    
    // Usa html2pdf per generare il PDF con layout professionale
    if (window.html2pdf) {
        await pdfGenerator.generaPDF(datiPreventivo);
    } else {
        // Fallback a jsPDF semplice
        generaPDFSemplice(datiPreventivo);
    }
    
    // Salva nel database
    await salvaPreventivoDB(datiPreventivo);
}

// Fallback PDF semplice con jsPDF
function generaPDFSemplice(datiPreventivo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Intestazione
    doc.setFontSize(20);
    doc.text('CERBARO', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Via Lago di Bracciano, 17 - 36015 Schio (VI)', 105, 28, { align: 'center' });
    doc.text('Tel: 0445575494 - Email: info@cerbaro.it', 105, 34, { align: 'center' });
    
    // Resto del codice come prima...
    // [codice esistente per generazione PDF semplice]
    
    // Salva PDF
    const nomeFile = `preventivo_${datiPreventivo.cliente.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeFile);
    
    alert('Preventivo generato con successo!');
}

// Funzione per aggiungere condizioni finali al PDF
function aggiungiCondizioniFinali(doc) {
    // Prima pagina condizioni
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CONDIZIONI COMMERCIALI', 105, 20, { align: 'center' });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    let y = 40;
    const testoCondizioni = [
        'Le immagini contenute nella presente offerta sono solo a puro scopo dimostrativo, non vincolanti.',
        'Prezzi indicativi formulati per quantità, dimensioni richieste e per l\'intero lavoro.',
        'Da confermare dopo presa visione del cantiere.',
        'Eventuali profili di finitura che si rendessero necessari per un lavoro a regola d\'arte,',
        'saranno conteggiati a consuntivo.',
        'Le voci non comprese nella presente offerta sono da ritenersi escluse.',
        'La posa in opera è da intendersi non vincolante e sarà conteggiata a consuntivo.',
        '',
        'Condizioni commerciali:',
        '• Trasporto: incluso',
        '• Pratica Enea: esclusa',
        '• Smontaggio: escluso',
        '• Smaltimento: escluso',
        '• Eventuali opere murarie: escluse',
        '• Consegna: 60gg da conferma ordine',
        '• Pagamento: 60% acconto a firma contratto, 30% a merce pronta, 10% a fine lavori',
        '• Validità offerta: 30gg'
    ];
    
    testoCondizioni.forEach(riga => {
        doc.text(riga, 20, y);
        y += 6;
    });
    
    // Seconda pagina condizioni
    doc.addPage();
    y = 20;
    doc.setFont(undefined, 'bold');
    doc.text('GARANZIA E TERMINI', 105, y, { align: 'center' });
    doc.setFont(undefined, 'normal');
    y += 20;
    
    const testoGaranzia = [
        'Garanzia:',
        'Il cliente finale ha diritto alla garanzia totale sul prodotto per i primi due anni',
        'dalla data di acquisto, come da normativa vigente.',
        '',
        'Consegna:',
        'Le date di consegna sono indicative e dipendono dai giorni lavorativi dalla data',
        'di ricevimento dell\'ordine controfirmato per accettazione.',
        '',
        'Pagamenti:',
        'I pagamenti devono essere effettuati entro i termini precisati in fattura.',
        '',
        'IVA:',
        'I prezzi sono esclusi di IVA. L\'IVA applicata ordinariamente è pari al 22%.',
        '',
        'Reclami:',
        'Qualsiasi vizio o difetto evidente deve essere comunicato in forma scritta',
        'entro 8 giorni dalla consegna.'
    ];
    
    testoGaranzia.forEach(riga => {
        doc.text(riga, 20, y);
        y += 6;
    });
}

// Funzione per salvare preventivo nel database
async function salvaPreventivoDB(datiPreventivo) {
    try {
        // Salva o trova cliente
        let clienteId;
        const clientiEsistenti = await db.getClienti();
        const clienteEsistente = clientiEsistenti.find(c => 
            c.nome === datiPreventivo.cliente.nome && 
            c.partita_iva === datiPreventivo.cliente.piva
        );
        
        if (clienteEsistente) {
            clienteId = clienteEsistente.id;
        } else {
            // Crea nuovo cliente
            const nuovoCliente = await db.saveCliente({
                nome: datiPreventivo.cliente.nome,
                indirizzo: datiPreventivo.cliente.indirizzo,
                citta: datiPreventivo.cliente.citta,
                cap: datiPreventivo.cliente.cap,
                provincia: datiPreventivo.cliente.provincia,
                partita_iva: datiPreventivo.cliente.piva
            });
            clienteId = nuovoCliente.id;
        }
        
        // Genera numero preventivo
        const numeroPreventivo = `${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        
        // Salva preventivo
        const preventivo = await db.savePreventivo({
            numero: numeroPreventivo,
            cliente_id: clienteId,
            data: datiPreventivo.preventivo.data,
            oggetto: datiPreventivo.preventivo.oggetto,
            totale: parseFloat(datiPreventivo.preventivo.totale.replace(',', '.')),
            stato: 'completato'
        });
        
        // Salva articoli
        for (const articolo of datiPreventivo.articoli) {
            const articoloSalvato = await db.saveArticolo({
                preventivo_id: preventivo.id,
                descrizione: articolo.descrizione,
                ore_lavoro: parseFloat(articolo.oreLavoro) || 0,
                totale_articolo: parseFloat(articolo.totale.replace('€ ', '').replace(',', '.')),
                posizione: articolo.numero
            });
            
            // Salva materiali dell'articolo
            if (articoloSalvato && articolo.materiali.length > 0) {
                const materialiArticolo = articolo.materiali.map(mat => {
                    const materialDB = materialiDB.find(m => m.nome === mat.nome);
                    return {
                        articolo_id: articoloSalvato.id,
                        materiale_id: materialDB.id,
                        quantita: parseFloat(mat.quantita) || 0,
                        totale_materiale: (parseFloat(mat.quantita) || 0) * materialDB.prezzo_kg
                    };
                });
                
                await db.saveArticoloMateriali(materialiArticolo);
            }
        }
        
        console.log('Preventivo salvato nel database con successo!');
    } catch (error) {
        console.error('Errore nel salvataggio del preventivo:', error);
    }
}