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
    async generaPDF(datiPreventivo) {
        const html = this.generaHTML(datiPreventivo);
        
        // Crea un container temporaneo
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.innerHTML = html;
        document.body.appendChild(container);
        
        // Opzioni per html2pdf
        const opt = {
            margin: 10,
            filename: `preventivo_${datiPreventivo.cliente.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Genera PDF
        await html2pdf().set(opt).from(container).save();
        
        // Rimuovi container temporaneo
        document.body.removeChild(container);
    }
}

// Inizializza il generatore PDF
const pdfGenerator = new PDFGenerator();

// Carica logo base64 (da fare)
// pdfGenerator.logoBase64 = 'data:image/png;base64,...';