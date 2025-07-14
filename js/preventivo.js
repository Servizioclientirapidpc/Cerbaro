// Variabili globali
let materialiDB = [];
let numeroArticolo = 0;

// Inizializzazione
document.addEventListener('DOMContentLoaded', async function() {
    // Imposta data odierna
    document.getElementById('data').value = new Date().toISOString().split('T')[0];
    
    // Carica materiali dal database
    try {
        materialiDB = await db.getMateriali();
    } catch (error) {
        console.error('Errore caricamento materiali:', error);
        // Materiali di default se il database non è disponibile
        materialiDB = [
            { id: 1, nome: 'Ferro', prezzo_kg: 2.50, unita: 'kg' },
            { id: 2, nome: 'Alluminio', prezzo_kg: 3.80, unita: 'kg' },
            { id: 3, nome: 'PVC', prezzo_kg: 1.60, unita: 'kg' },
            { id: 4, nome: 'Legno', prezzo_kg: 2.20, unita: 'kg' },
            { id: 5, nome: 'Inox', prezzo_kg: 5.00, unita: 'kg' },
            { id: 6, nome: 'Vetro', prezzo_kg: 4.50, unita: 'kg' }
        ];
    }
    
    // Aggiungi primo articolo
    aggiungiArticolo();
    
    // Gestisci submit form - IMPORTANTE: previeni l'invio del form
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
}

// FUNZIONE PRINCIPALE PER GENERARE PDF
async function generaPDF() {
    try {
        console.log('Inizio generazione PDF...');
        
        // Raccogli dati
        const datiPreventivo = {
            cliente: {
                nome: document.getElementById('clienteNome').value || 'Cliente',
                indirizzo: document.getElementById('clienteIndirizzo').value || '',
                citta: document.getElementById('clienteCitta').value || '',
                cap: document.getElementById('clienteCap').value || '',
                provincia: document.getElementById('clienteProvincia').value || '',
                piva: document.getElementById('clientePIVA').value || ''
            },
            preventivo: {
                data: document.getElementById('data').value,
                oggetto: document.getElementById('oggetto').value || 'Preventivo',
                totale: document.getElementById('totalePreventivo').textContent
            },
            articoli: []
        };
        
        // Raccogli articoli
        document.querySelectorAll('.articolo').forEach((articolo, index) => {
            const articoloData = {
                numero: index + 1,
                descrizione: articolo.querySelector('.descrizioneArticolo').value || `Articolo ${index + 1}`,
                oreLavoro: articolo.querySelector('.oreLavoro').value || '0',
                totale: articolo.querySelector('.totaleArticolo').value || '€ 0,00',
                materiali: []
            };
            
            // Raccogli materiali
            articolo.querySelectorAll('.materiale-row').forEach(row => {
                const select = row.querySelector('.selectMateriale');
                if (select && select.value) {
                    const materialDB = materialiDB.find(m => m.id == select.value);
                    if (materialDB) {
                        articoloData.materiali.push({
                            nome: materialDB.nome,
                            quantita: row.querySelector('.quantitaMateriale').value || '0',
                            prezzo: materialDB.prezzo_kg
                        });
                    }
                }
            });
            
            datiPreventivo.articoli.push(articoloData);
        });
        
        console.log('Dati raccolti:', datiPreventivo);
        
        // Genera PDF con jsPDF
        if (!window.jspdf) {
            alert('Libreria PDF non caricata. Ricarica la pagina.');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const marginLeft = 20;
        const marginRight = 20;
        const contentWidth = pageWidth - marginLeft - marginRight;
        
        // Intestazione
        doc.setFontSize(28);
        doc.setTextColor(204, 0, 0);
        doc.text('CERBARO', pageWidth/2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Via Lago di Bracciano, 17 - 36015 Schio (VI)', pageWidth/2, yPos, { align: 'center' });
        yPos += 5;
        doc.text('Tel: 0445575494 - Email: info@cerbaro.it', pageWidth/2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
        yPos += 10;
        
        // Data e Cliente
        doc.setFontSize(11);
        doc.text(`Data: ${new Date(datiPreventivo.preventivo.data).toLocaleDateString('it-IT')}`, marginLeft, yPos);
        
        doc.text('Spett.le', 120, yPos);
        doc.setFont(undefined, 'bold');
        doc.text(datiPreventivo.cliente.nome, 120, yPos + 6);
        doc.setFont(undefined, 'normal');
        
        if (datiPreventivo.cliente.indirizzo) {
            doc.text(datiPreventivo.cliente.indirizzo, 120, yPos + 12);
        }
        if (datiPreventivo.cliente.citta) {
            doc.text(`${datiPreventivo.cliente.cap} ${datiPreventivo.cliente.citta} ${datiPreventivo.cliente.provincia}`, 120, yPos + 18);
        }
        
        yPos += 30;
        
        // Oggetto
        doc.setFont(undefined, 'bold');
        doc.text('Oggetto: ', marginLeft, yPos);
        doc.setFont(undefined, 'normal');
        const oggetto = doc.splitTextToSize(datiPreventivo.preventivo.oggetto, contentWidth - 30);
        doc.text(oggetto, marginLeft + 25, yPos);
        yPos += oggetto.length * 5 + 10;
        
        // Tabella articoli
        doc.text('Di seguito nostra migliore offerta:', marginLeft, yPos);
        yPos += 10;
        
        // Header tabella
        doc.setFillColor(240, 240, 240);
        doc.rect(marginLeft, yPos, contentWidth, 8, 'F');
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('Pos.', marginLeft + 2, yPos + 6);
        doc.text('Descrizione', marginLeft + 15, yPos + 6);
        doc.text('Totale €', marginLeft + 150, yPos + 6);
        
        yPos += 12;
        doc.setFont(undefined, 'normal');
        
        // Articoli
        datiPreventivo.articoli.forEach(articolo => {
            // Controlla se serve nuova pagina
            if (yPos > pageHeight - 40) {
                doc.addPage();
                yPos = 20;
            }
            
            doc.text(`${articolo.numero}`, marginLeft + 2, yPos);
            
            // Descrizione
            const desc = doc.splitTextToSize(articolo.descrizione, 120);
            doc.text(desc, marginLeft + 15, yPos);
            
            // Totale
            const totaleNumerico = articolo.totale.replace('€', '').trim();
            doc.text(totaleNumerico, marginLeft + 150, yPos);
            
            yPos += desc.length * 5 + 2;
            
            // Dettagli materiali
            if (articolo.materiali.length > 0) {
                doc.setFontSize(8);
                articolo.materiali.forEach(mat => {
                    doc.text(`• ${mat.nome}: ${mat.quantita} kg`, marginLeft + 20, yPos);
                    yPos += 4;
                });
                doc.setFontSize(10);
            }
            
            if (articolo.oreLavoro && parseFloat(articolo.oreLavoro) > 0) {
                doc.setFontSize(8);
                doc.text(`• Ore lavoro: ${articolo.oreLavoro}`, marginLeft + 20, yPos);
                yPos += 4;
                doc.setFontSize(10);
            }
            
            yPos += 8;
        });
        
        // Totale
        yPos += 5;
        doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text(`TOTALE iva esclusa: € ${datiPreventivo.preventivo.totale}`, pageWidth - marginRight, yPos, { align: 'right' });
        
        // Salva PDF
        const nomeFile = `preventivo_${datiPreventivo.cliente.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(nomeFile);
        
        console.log('PDF generato con successo!');
        alert('Preventivo generato con successo!');
        
        // Prova a salvare nel database (se disponibile)
        if (typeof salvaPreventivoDB === 'function') {
            try {
                await salvaPreventivoDB(datiPreventivo);
            } catch (error) {
                console.error('Errore salvataggio database:', error);
            }
        }
        
    } catch (error) {
        console.error('Errore generazione PDF:', error);
        alert('Errore nella generazione del PDF. Controlla la console per dettagli.');
    }
}

// Funzione per salvare preventivo nel database (opzionale)
async function salvaPreventivoDB(datiPreventivo) {
    // Solo se db è disponibile
    if (typeof db === 'undefined') {
        console.log('Database non disponibile, salvataggio saltato');
        return;
    }
    
    try {
        // Codice per salvare nel database...
        console.log('Tentativo salvataggio nel database...');
    } catch (error) {
        console.error('Errore salvataggio:', error);
    }
}