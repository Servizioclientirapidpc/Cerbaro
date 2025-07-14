// Generatore PDF per preventivi Cerbaro
class PDFGenerator {
    constructor() {
        this.logoBase64 = ''; // Da caricare
        this.costoOrario = 30;
    }

    // Genera HTML del preventivo
    generaHTML(datiPreventivo) {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page {
                    size: A4;
                    margin: 10mm;
                }
                body {
                    font-family: Arial, sans-serif;
                    font-size: 11pt;
                    line-height: 1.4;
                    color: #333;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #ccc;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .logo {
                    height: 60px;
                }
                .company-name {
                    font-size: 36pt;
                    font-weight: bold;
                    color: #CC0000;
                    letter-spacing: 2px;
                }
                .company-info {
                    text-align: center;
                    font-size: 9pt;
                    color: #666;
                    margin-top: 5px;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 20px 0;
                }
                .info-left, .info-right {
                    width: 48%;
                }
                .info-label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120pt;
                    color: rgba(204, 0, 0, 0.05);
                    font-weight: bold;
                    z-index: -1;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th {
                    background-color: #f0f0f0;
                    border: 1px solid #999;
                    padding: 8px;
                    text-align: left;
                    font-weight: bold;
                }
                td {
                    border: 1px solid #999;
                    padding: 8px;
                    vertical-align: top;
                }
                .prezzo, .totale {
                    text-align: right;
                    white-space: nowrap;
                }
                .quantita {
                    text-align: center;
                }
                .descrizione-dettagliata {
                    background-color: #f9f9f9;
                    padding: 10px;
                    margin: 10px 0;
                    border-left: 4px solid #CC0000;
                }
                .totale-finale {
                    text-align: right;
                    font-size: 14pt;
                    font-weight: bold;
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #f0f0f0;
                }
                .footer {
                    position: fixed;
                    bottom: 10mm;
                    left: 10mm;
                    right: 10mm;
                    text-align: center;
                    font-size: 9pt;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 5px;
                }
                .page-break {
                    page-break-before: always;
                }
                .immagine-articolo {
                    max-width: 100%;
                    max-height: 300px;
                    margin: 10px 0;
                }
                .condizioni {
                    font-size: 10pt;
                    line-height: 1.6;
                }
                .condizioni h3 {
                    color: #CC0000;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="watermark">CERBARO</div>
            
            <!-- Header -->
            <div class="header">
                <div class="logo-section">
                    <img src="${this.logoBase64}" class="logo" alt="Logo">
                    <div>
                        <div class="company-name">CERBARO</div>
                    </div>
                </div>
            </div>
            
            <div class="company-info">
                Lavorazione Ferro battuto, Alluminio e Inox - serramenti in Alluminio, PVC - cancellate, ringhiere, inferriate<br>
                basculanti, portoni scorrevoli e a libro - protezioni, soppalchi, tettoie - dispositivi e carpenteria industriale
            </div>
            
            <!-- Info cliente e preventivo -->
            <div class="info-row">
                <div class="info-left">
                    <div class="info-label">Data ${new Date(datiPreventivo.preventivo.data).toLocaleDateString('it-IT')}</div>
                    <div>Rif. ${this.generaNumeroRiferimento()}</div>
                </div>
                <div class="info-right">
                    <div class="info-label">Spett.</div>
                    <div><strong>${datiPreventivo.cliente.nome}</strong></div>
                    <div>${datiPreventivo.cliente.indirizzo}</div>
                    <div>${datiPreventivo.cliente.cap} ${datiPreventivo.cliente.citta} ${datiPreventivo.cliente.provincia}</div>
                </div>
            </div>
            
            <div style="margin: 20px 0;">
                <strong>Oggetto:</strong> ${datiPreventivo.preventivo.oggetto}
            </div>
            
            <p>Di seguito nostra migliore offerta per la fornitura e posa di:</p>
            
            <!-- Tabella articoli -->
            <table>
                <thead>
                    <tr>
                        <th style="width: 5%;">Pos.</th>
                        <th style="width: 55%;">Descrizione</th>
                        <th style="width: 15%;" class="prezzo">Prezzo Unit. €</th>
                        <th style="width: 10%;" class="quantita">Q.tà</th>
                        <th style="width: 15%;" class="totale">Totale €</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generaRigheArticoli(datiPreventivo.articoli)}
                </tbody>
            </table>
            
            <div class="totale-finale">
                TOTALE iva esclusa €${datiPreventivo.preventivo.totale}
            </div>
            
            <!-- Immagini articoli se presenti -->
            ${this.generaImmaginiArticoli(datiPreventivo.articoli)}
            
            <!-- Condizioni commerciali - Prima pagina -->
            <div class="page-break"></div>
            ${this.generaCondizioniCommerciali()}
            
            <!-- Condizioni commerciali - Seconda pagina -->
            <div class="page-break"></div>
            ${this.generaCondizioniGenerali()}
            
            <!-- Footer -->
            <div class="footer">
                CERBARO snc - Via Lago di Bracciano, 17 - 36015 Schio Vicenza - P.IVA 00897290243<br>
                Tel e Fax: 0445575494 - Email: info@cerbaro.it - Web: http://www.cerbaro.it/
            </div>
        </body>
        </html>
        `;
        
        return html;
    }

    // Genera righe articoli per la tabella
    generaRigheArticoli(articoli) {
        let html = '';
        let totaleGenerale = 0;
        
        articoli.forEach((articolo, index) => {
            // Calcola totale articolo
            let totaleArticolo = 0;
            
            // Calcola costo materiali
            if (articolo.materiali && articolo.materiali.length > 0) {
                articolo.materiali.forEach(mat => {
                    const materialDB = materialiDB.find(m => m.nome === mat.nome);
                    if (materialDB) {
                        totaleArticolo += parseFloat(mat.quantita) * materialDB.prezzo_kg;
                    }
                });
            }
            
            // Aggiungi costo manodopera
            totaleArticolo += parseFloat(articolo.oreLavoro || 0) * this.costoOrario;
            
            // Riga principale
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${articolo.descrizione}</strong>
                        ${this.generaDettagliArticolo(articolo)}
                    </td>
                    <td class="prezzo">${totaleArticolo.toFixed(2)}</td>
                    <td class="quantita">1</td>
                    <td class="totale">${totaleArticolo.toFixed(2)}</td>
                </tr>
            `;
            
            totaleGenerale += totaleArticolo;
        });
        
        return html;
    }

    // Genera dettagli articolo
    generaDettagliArticolo(articolo) {
        let dettagli = '<div class="descrizione-dettagliata">';
        
        if (articolo.materiali && articolo.materiali.length > 0) {
            dettagli += '<strong>Materiali:</strong><br>';
            articolo.materiali.forEach(mat => {
                dettagli += `- ${mat.nome}: ${mat.quantita} kg<br>`;
            });
        }
        
        if (articolo.oreLavoro > 0) {
            dettagli += `<strong>Ore lavoro:</strong> ${articolo.oreLavoro}<br>`;
        }
        
        dettagli += '</div>';
        return dettagli;
    }

    // Genera sezione immagini articoli
    generaImmaginiArticoli(articoli) {
        let html = '';
        articoli.forEach((articolo, index) => {
            if (articolo.immagineUrl) {
                html += `
                    <div class="page-break"></div>
                    <h3>Posizione ${index + 1}</h3>
                    <img src="${articolo.immagineUrl}" class="immagine-articolo" alt="Immagine articolo ${index + 1}">
                `;
            }
        });
        return html;
    }

    // Genera condizioni commerciali
    generaCondizioniCommerciali() {
        return `
            <div class="condizioni">
                <h3>Condizioni commerciali:</h3>
                <p>
                Le immagini contenute nella presente offerta sono solo a puro scopo dimostrativo, non vincolanti.<br>
                Prezzi indicativi formulati per quantità, dimensioni richieste e per l'intero lavoro. Da confermare dopo presa visione del cantiere.<br>
                Eventuali profili di finitura che si rendessero necessari per un lavoro a regola d'arte, saranno conteggiati a consuntivo.<br>
                Le voci non comprese nella presente offerta sono da ritenersi escluse.<br>
                La posa in opera è da intendersi non vincolante e sarà conteggiata a consuntivo.
                </p>
                
                <ul>
                    <li>Trasporto: incluso</li>
                    <li>Pratica Enea: esclusa</li>
                    <li>Smontaggio: escluso</li>
                    <li>Smaltimento: escluso</li>
                    <li>Eventuali opere murarie: escluse</li>
                    <li>Consegna: 60gg da conferma ordine</li>
                    <li>Pagamento: 60% acconto a firma contratto, 30% a merce pronta, 10% a fine lavori</li>
                    <li>Validità offerta: 30gg</li>
                </ul>
                
                <h3>Rimane a vs. carico:</h3>
                <ul>
                    <li>Cantiere libero da impedimenti</li>
                    <li>Fornitura di energia elettrica</li>
                    <li>Esecuzione di eventuali opere murarie</li>
                    <li>Impianto elettrico fino a ns. quadri</li>
                    <li>Pulizie finali del cantiere e delle opere installate</li>
                    <li>Smaltimento del materiale residuo derivante dalla posa</li>
                </ul>
                
                <div style="margin-top: 50px; border: 1px solid #999; padding: 20px;">
                    <p>Timbro e/o firma per accettazione:</p>
                    <br><br><br>
                    <p>_______________________________</p>
                </div>
            </div>
        `;
    }

    // Genera condizioni generali
    generaCondizioniGenerali() {
        return `
            <div class="condizioni">
                <h3>Garanzia:</h3>
                <p>
                Il cliente finale ha diritto alla garanzia totale sul prodotto per i primi due anni dalla data di acquisto, 
                come da normativa vigente. La garanzia copre esclusivamente il valore del materiale se riconosciuto difettoso 
                dall'origine. Per i vetri fa riferimento al "Disciplinare sulla qualità ottica e visiva delle vetrate per 
                serramenti" di Assovetro. Restano escluse in tutti i casi le spese per la sostituzione (mano d'opera, consegna).
                </p>
                
                <h3>Consegna:</h3>
                <p>
                Le date di consegna sono indicative e dipendono dai giorni lavorativi dalla data di ricevimento dell'ordine 
                controfirmato per accettazione, completo di dati anagrafici per la fatturazione.
                </p>
                
                <h3>Pagamenti, ritardi e inadempimenti:</h3>
                <p>
                I pagamenti devono essere effettuati entro i termini precisati in fattura. Forme di pagamento diverse vanno 
                concordate all'ordine. In caso di insolvenza, Cerbaro snc ha diritto di sospendere ogni altra consegna e 
                richiedere immediato saldo di quanto già consegnato.
                </p>
                
                <h3>IVA:</h3>
                <p>
                I prezzi sono esclusi di IVA e l'IVA applicata ordinariamente è pari al 22%. IVA agevolata su richiesta 
                con documentazione prima della fatturazione.
                </p>
                
                <h3>Spedizioni:</h3>
                <p>
                La merce viaggia a rischio e pericolo del cliente anche se spedita in porto franco. Eventuali danni devono 
                essere segnalati immediatamente al trasportatore.
                </p>
                
                <h3>Reclami:</h3>
                <p>
                Qualsiasi vizio o difetto evidente deve essere comunicato in forma scritta entro 8 giorni dalla consegna.
                </p>
                
                <h3>Certificazioni:</h3>
                <p>
                Richieste di certificazione specifiche devono essere fatte prima o al momento dell'ordine.
                </p>
                
                <div style="margin-top: 50px; text-align: right;">
                    <p>Distinti saluti<br>
                    Massimo Grotto<br>
                    <strong style="color: #CC0000;">CERBARO</strong></p>
                </div>
            </div>
        `;
    }

    // Genera numero riferimento
    generaNumeroRiferimento() {
        const anno = new Date().getFullYear().toString().substr(-2);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${anno}-${random}.04 MG`;
    }

    // Genera PDF usando html2pdf.js
    // Sostituisci la funzione generaPDF() nel tuo preventivo.js con questa:

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
            materiali: []
        };
        
        // Raccogli materiali
        articolo.querySelectorAll('.materiale-row').forEach(row => {
            const select = row.querySelector('.selectMateriale');
            if (select.value) {
                const materialDB = materialiDB.find(m => m.id == select.value);
                if (materialDB) {
                    articoloData.materiali.push({
                        nome: materialDB.nome,
                        quantita: row.querySelector('.quantitaMateriale').value,
                        prezzo: materialDB.prezzo_kg
                    });
                }
            }
        });
        
        datiPreventivo.articoli.push(articoloData);
    });
    
    // Genera PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    
    // Funzione per verificare se serve una nuova pagina
    function checkNewPage(requiredSpace) {
        if (yPos + requiredSpace > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
            addPageHeader();
        }
    }
    
    // Funzione per aggiungere header su ogni pagina
    function addPageHeader() {
        // Watermark
        doc.setFontSize(80);
        doc.setTextColor(240, 240, 240);
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.1}));
        doc.text('CERBARO', pageWidth/2, pageHeight/2, {
            align: 'center',
            angle: -45
        });
        doc.restoreGraphicsState();
        
        // Reset colore testo
        doc.setTextColor(0, 0, 0);
    }
    
    // Prima pagina - Header
    addPageHeader();
    
    // Logo e intestazione
    doc.setFontSize(32);
    doc.setTextColor(204, 0, 0); // Rosso
    doc.setFont(undefined, 'bold');
    doc.text('CERBARO', pageWidth/2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('Lavorazione Ferro battuto, Alluminio e Inox - serramenti in Alluminio, PVC', pageWidth/2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('cancellate, ringhiere, inferriate - basculanti, portoni scorrevoli e a libro', pageWidth/2, yPos, { align: 'center' });
    yPos += 8;
    
    // Linea separatrice
    doc.setDrawColor(200, 200, 200);
    doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
    yPos += 10;
    
    // Info azienda
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Via Lago di Bracciano, 17 - 36015 Schio (VI) - P.IVA 00897290243', pageWidth/2, yPos, { align: 'center' });
    yPos += 5;
    doc.text('Tel/Fax: 0445575494 - Email: info@cerbaro.it - Web: www.cerbaro.it', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;
    
    // Data e riferimento
    doc.setFontSize(10);
    doc.text(`Data: ${new Date(datiPreventivo.preventivo.data).toLocaleDateString('it-IT')}`, marginLeft, yPos);
    
    // Genera numero preventivo
    const anno = new Date().getFullYear().toString().substr(-2);
    const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    doc.text(`Rif. ${anno}-${numero}.04 MG`, marginLeft, yPos + 6);
    
    // Cliente
    doc.text('Spett.le', pageWidth - marginRight - 60, yPos);
    doc.setFont(undefined, 'bold');
    doc.text(datiPreventivo.cliente.nome, pageWidth - marginRight - 60, yPos + 6);
    doc.setFont(undefined, 'normal');
    if (datiPreventivo.cliente.indirizzo) {
        doc.text(datiPreventivo.cliente.indirizzo, pageWidth - marginRight - 60, yPos + 12);
    }
    if (datiPreventivo.cliente.citta) {
        doc.text(`${datiPreventivo.cliente.cap} ${datiPreventivo.cliente.citta} ${datiPreventivo.cliente.provincia}`, 
                 pageWidth - marginRight - 60, yPos + 18);
    }
    
    yPos += 30;
    
    // Oggetto
    doc.setFont(undefined, 'bold');
    doc.text('Oggetto: ', marginLeft, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(datiPreventivo.preventivo.oggetto, marginLeft + 20, yPos);
    yPos += 10;
    
    doc.text('Di seguito nostra migliore offerta per la fornitura e posa di:', marginLeft, yPos);
    yPos += 15;
    
    // Tabella articoli
    checkNewPage(40);
    
    // Header tabella
    doc.setFillColor(240, 240, 240);
    doc.rect(marginLeft, yPos, contentWidth, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    doc.text('Pos.', marginLeft + 2, yPos + 6);
    doc.text('Descrizione', marginLeft + 15, yPos + 6);
    doc.text('Prezzo Unit.', marginLeft + 120, yPos + 6);
    doc.text('Q.tà', marginLeft + 145, yPos + 6);
    doc.text('Totale €', marginLeft + 160, yPos + 6);
    
    yPos += 10;
    doc.setFont(undefined, 'normal');
    
    // Righe articoli
    let totaleGenerale = 0;
    datiPreventivo.articoli.forEach((articolo, index) => {
        checkNewPage(30);
        
        // Calcola totale articolo
        let totaleArticolo = 0;
        articolo.materiali.forEach(mat => {
            totaleArticolo += parseFloat(mat.quantita || 0) * parseFloat(mat.prezzo || 0);
        });
        totaleArticolo += parseFloat(articolo.oreLavoro || 0) * 30; // €30/ora
        
        // Riga principale
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}`, marginLeft + 2, yPos);
        doc.text(articolo.descrizione || 'Articolo', marginLeft + 15, yPos);
        doc.text(totaleArticolo.toFixed(2), marginLeft + 120, yPos);
        doc.text('1', marginLeft + 145, yPos);
        doc.text(totaleArticolo.toFixed(2), marginLeft + 160, yPos);
        
        yPos += 6;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        
        // Dettagli materiali
        if (articolo.materiali.length > 0) {
            articolo.materiali.forEach(mat => {
                doc.text(`- ${mat.nome}: ${mat.quantita} kg`, marginLeft + 20, yPos);
                yPos += 4;
            });
        }
        
        if (articolo.oreLavoro > 0) {
            doc.text(`- Ore lavoro: ${articolo.oreLavoro}`, marginLeft + 20, yPos);
            yPos += 4;
        }
        
        yPos += 6;
        doc.setFontSize(9);
        totaleGenerale += totaleArticolo;
    });
    
    // Linea totale
    yPos += 5;
    doc.setDrawColor(0, 0, 0);
    doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
    yPos += 8;
    
    // Totale
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(`TOTALE iva esclusa   € ${totaleGenerale.toFixed(2).replace('.', ',')}`, pageWidth - marginRight, yPos, { align: 'right' });
    
    // Condizioni commerciali - Prima pagina
    doc.addPage();
    addPageHeader();
    yPos = 30;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Condizioni commerciali:', marginLeft, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const condizioniTesto = [
        'Le immagini contenute nella presente offerta sono solo a puro scopo dimostrativo, non vincolanti.',
        'Prezzi indicativi formulati per quantità, dimensioni richieste e per l\'intero lavoro.',
        'Da confermare dopo presa visione del cantiere.',
        'Eventuali profili di finitura che si rendessero necessari per un lavoro a regola d\'arte,',
        'saranno conteggiati a consuntivo.',
        'Le voci non comprese nella presente offerta sono da ritenersi escluse.',
        'La posa in opera è da intendersi non vincolante e sarà conteggiata a consuntivo.',
        '',
        'Durante il periodo dei lavori ci riserviamo la facoltà di scattare foto che potranno',
        'essere usate anche a scopo pubblicitario sia cartaceo che elettronico.'
    ];
    
    condizioniTesto.forEach(riga => {
        doc.text(riga, marginLeft, yPos);
        yPos += 5;
    });
    
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Condizioni:', marginLeft, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    
    const condizioni = [
        '• Trasporto: incluso',
        '• Pratica Enea: esclusa',
        '• Smontaggio: escluso',
        '• Smaltimento: escluso',
        '• Eventuali opere murarie: escluse',
        '• Consegna: 60gg da conferma ordine',
        '• Pagamento: 60% acconto, 30% a merce pronta, 10% a fine lavori',
        '• Validità offerta: 30gg'
    ];
    
    condizioni.forEach(cond => {
        doc.text(cond, marginLeft + 5, yPos);
        yPos += 5;
    });
    
    // Seconda pagina condizioni
    doc.addPage();
    addPageHeader();
    yPos = 30;
    
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Garanzia:', marginLeft, yPos);
    yPos += 8;
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    const garanziaTesto = [
        'Il cliente finale ha diritto alla garanzia totale sul prodotto per i primi due anni dalla data',
        'di acquisto, come da normativa vigente. La garanzia copre esclusivamente il valore del',
        'materiale se riconosciuto difettoso dall\'origine.'
    ];
    
    garanziaTesto.forEach(riga => {
        doc.text(riga, marginLeft, yPos);
        yPos += 5;
    });
    
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Consegna:', marginLeft, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.text('Le date di consegna sono indicative e dipendono dai giorni lavorativi.', marginLeft, yPos);
    
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.text('Pagamenti:', marginLeft, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.text('I pagamenti devono essere effettuati entro i termini precisati in fattura.', marginLeft, yPos);
    
    // Footer
    yPos = pageHeight - 30;
    doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
    yPos += 5;
    doc.setFontSize(8);
    doc.text('CERBARO snc - Via Lago di Bracciano, 17 - 36015 Schio Vicenza - P.IVA 00897290243', pageWidth/2, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Tel e Fax: 0445575494 - Email: info@cerbaro.it - Web: http://www.cerbaro.it/', pageWidth/2, yPos, { align: 'center' });
    
    // Salva il PDF
    const nomeFile = `preventivo_${datiPreventivo.cliente.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(nomeFile);
    
    // Mostra messaggio di successo
    alert('Preventivo generato con successo!');
    
    // Salva nel database
    await salvaPreventivoDB(datiPreventivo);
}