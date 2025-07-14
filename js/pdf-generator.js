<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crea Preventivo - Cerbaro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
        }
        .card {
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: none;
        }
        .card-header {
            border-radius: 10px 10px 0 0 !important;
            font-weight: 500;
        }
        .form-control, .form-select {
            border-radius: 8px;
        }
        .articolo {
            background-color: #f8f9fa;
            transition: all 0.3s ease;
        }
        .articolo:hover {
            background-color: #e9ecef;
        }
        .materiale-row {
            align-items: center;
        }
        #totalePreventivo {
            font-size: 1.5rem;
            font-weight: 600;
            color: #28a745;
        }
        .totaleArticolo {
            background-color: #e9ecef;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Crea Nuovo Preventivo</h2>
            <a href="index.html" class="btn btn-outline-secondary">← Torna alla Home</a>
        </div>

        <form id="formPreventivo">
            <!-- Dati Cliente -->
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Dati Cliente</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Nome Cliente</label>
                            <input type="text" class="form-control" id="clienteNome" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Indirizzo</label>
                            <input type="text" class="form-control" id="clienteIndirizzo">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-4">
                            <label class="form-label">Città</label>
                            <input type="text" class="form-control" id="clienteCitta">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">CAP</label>
                            <input type="text" class="form-control" id="clienteCap">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Provincia</label>
                            <input type="text" class="form-control" id="clienteProvincia" maxlength="2">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">P.IVA / C.F.</label>
                            <input type="text" class="form-control" id="clientePIVA">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dati Preventivo -->
            <div class="card mb-4">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Dati Preventivo</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <label class="form-label">Oggetto</label>
                            <input type="text" class="form-control" id="oggetto" value="Preventivo spesa - aggiornamento" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Data</label>
                            <input type="date" class="form-control" id="data" value="">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Articoli -->
            <div class="card mb-4">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Articoli</h5>
                    <button type="button" class="btn btn-light btn-sm" onclick="aggiungiArticolo()">
                        + Aggiungi Articolo
                    </button>
                </div>
                <div class="card-body" id="containerArticoli">
                    <!-- Gli articoli verranno aggiunti dinamicamente qui -->
                </div>
            </div>

            <!-- Totale e Azioni -->
            <div class="card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h4>Totale: € <span id="totalePreventivo">0,00</span></h4>
                        </div>
                        <div class="col-md-6 text-end">
                            <button type="button" class="btn btn-primary" onclick="generaPDF()">
                                Genera PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- Template Articolo (nascosto) -->
    <template id="templateArticolo">
        <div class="articolo border rounded p-3 mb-3">
            <div class="d-flex justify-content-between mb-3">
                <h6>Articolo <span class="numeroArticolo"></span></h6>
                <button type="button" class="btn btn-sm btn-danger" onclick="rimuoviArticolo(this)">
                    × Rimuovi
                </button>
            </div>
            
            <div class="mb-3">
                <label class="form-label">Descrizione</label>
                <textarea class="form-control descrizioneArticolo" rows="2" placeholder="Es: Finestra 1 anta Dim 1000x1350"></textarea>
            </div>

            <div class="materiali-container mb-3">
                <label class="form-label">Materiali</label>
                <div class="materiali-list">
                    <!-- I materiali verranno aggiunti qui -->
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="aggiungiMateriale(this)">
                    + Aggiungi Materiale
                </button>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Ore Lavoro</label>
                    <input type="number" class="form-control oreLavoro" step="0.5" min="0" value="0" onchange="calcolaTotale()">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Costo Orario</label>
                    <input type="number" class="form-control costoOrario" value="30" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Totale Articolo</label>
                    <input type="text" class="form-control totaleArticolo" value="€ 0,00" readonly>
                </div>
            </div>
        </div>
    </template>

    <!-- Template Materiale (nascosto) -->
    <template id="templateMateriale">
        <div class="row materiale-row mb-2">
            <div class="col-md-5">
                <select class="form-select selectMateriale" onchange="calcolaTotale()">
                    <option value="">Seleziona materiale...</option>
                    <option value="1" data-prezzo="2.50">Ferro (€2.50/kg)</option>
                    <option value="2" data-prezzo="3.80">Alluminio (€3.80/kg)</option>
                    <option value="3" data-prezzo="1.60">PVC (€1.60/kg)</option>
                    <option value="4" data-prezzo="2.20">Legno (€2.20/kg)</option>
                    <option value="5" data-prezzo="5.00">Inox (€5.00/kg)</option>
                    <option value="6" data-prezzo="4.50">Vetro (€4.50/kg)</option>
                </select>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control quantitaMateriale" placeholder="Quantità (kg)" step="0.1" min="0" onchange="calcolaTotale()">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control prezzoMateriale" placeholder="€/kg" readonly>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="rimuoviMateriale(this)">×</button>
            </div>
        </div>
    </template>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        // Variabili globali
        let numeroArticolo = 0;
        const materialiDB = [
            { id: 1, nome: 'Ferro', prezzo_kg: 2.50 },
            { id: 2, nome: 'Alluminio', prezzo_kg: 3.80 },
            { id: 3, nome: 'PVC', prezzo_kg: 1.60 },
            { id: 4, nome: 'Legno', prezzo_kg: 2.20 },
            { id: 5, nome: 'Inox', prezzo_kg: 5.00 },
            { id: 6, nome: 'Vetro', prezzo_kg: 4.50 }
        ];

        // Inizializzazione
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('data').value = new Date().toISOString().split('T')[0];
            aggiungiArticolo();
        });

        // Funzione per aggiungere un articolo
        function aggiungiArticolo() {
            numeroArticolo++;
            const container = document.getElementById('containerArticoli');
            const template = document.getElementById('templateArticolo');
            const clone = template.content.cloneNode(true);
            
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
            
            // Aggiungi evento per aggiornare prezzo
            const select = clone.querySelector('.selectMateriale');
            select.addEventListener('change', function() {
                const prezzoInput = this.closest('.materiale-row').querySelector('.prezzoMateriale');
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.value) {
                    prezzoInput.value = `€ ${selectedOption.dataset.prezzo}`;
                } else {
                    prezzoInput.value = '';
                }
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
            const costoOrario = 30;
            
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

        // Funzione per generare PDF professionale stile Cerbaro
        function generaPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Raccogli dati
            const cliente = {
                nome: document.getElementById('clienteNome').value || 'Cliente',
                indirizzo: document.getElementById('clienteIndirizzo').value,
                citta: document.getElementById('clienteCitta').value,
                cap: document.getElementById('clienteCap').value,
                provincia: document.getElementById('clienteProvincia').value
            };
            
            const preventivo = {
                data: document.getElementById('data').value,
                oggetto: document.getElementById('oggetto').value || 'Preventivo',
                totale: document.getElementById('totalePreventivo').textContent
            };
            
            // Variabili layout
            let yPos = 15;
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const marginLeft = 20;
            const marginRight = 20;
            const contentWidth = pageWidth - marginLeft - marginRight;
            
            // Funzione per aggiungere watermark
            function addWatermark() {
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({opacity: 0.05}));
                doc.setFontSize(100);
                doc.setTextColor(204, 0, 0);
                doc.text('CERBARO', pageWidth/2, pageHeight/2, {
                    align: 'center',
                    angle: -45
                });
                doc.restoreGraphicsState();
                doc.setTextColor(0, 0, 0);
            }
            
            // Funzione per aggiungere footer
            function addFooter(pageNum) {
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('CERBARO snc - Via Lago di Bracciano, 17 - 36015 Schio Vicenza - P.IVA 00897290243', pageWidth/2, pageHeight - 15, { align: 'center' });
                doc.text('Tel e Fax: 0445575494 - Email: info@cerbaro.it - Web: http://www.cerbaro.it/', pageWidth/2, pageHeight - 10, { align: 'center' });
                doc.text(`Pag.${pageNum}`, pageWidth - marginRight, pageHeight - 10, { align: 'right' });
                doc.setTextColor(0, 0, 0);
            }
            
            // Prima pagina
            addWatermark();
            
            // Logo e intestazione
            doc.setFontSize(36);
            doc.setTextColor(204, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('CERBARO', pageWidth/2, yPos + 10, { align: 'center' });
            
            yPos += 20;
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            doc.text('Lavorazione Ferro battuto, Alluminio e Inox - serramenti in Alluminio, PVC - cancellate, ringhiere, inferriate', pageWidth/2, yPos, { align: 'center' });
            yPos += 5;
            doc.text('basculanti, portoni scorrevoli e a libro - protezioni, soppalchi, tettoie - dispositivi e carpenteria industriale', pageWidth/2, yPos, { align: 'center' });
            
            yPos += 15;
            
            // Data e riferimento
            doc.setFontSize(10);
            const oggi = new Date(preventivo.data);
            doc.text(`Data ${oggi.toLocaleDateString('it-IT')}`, marginLeft, yPos);
            const anno = oggi.getFullYear().toString().substr(-2);
            const numero = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            doc.text(`Rif. ${anno}-${numero}.04 MG`, marginLeft + 50, yPos);
            
            // Cliente
            doc.text('Spett.', pageWidth - marginRight - 70, yPos);
            yPos += 6;
            doc.setFont(undefined, 'bold');
            doc.text(cliente.nome, pageWidth - marginRight - 70, yPos);
            doc.setFont(undefined, 'normal');
            if (cliente.indirizzo) {
                yPos += 5;
                doc.text(cliente.indirizzo, pageWidth - marginRight - 70, yPos);
            }
            if (cliente.citta) {
                yPos += 5;
                doc.text(`${cliente.cap} ${cliente.citta} ${cliente.provincia}`, pageWidth - marginRight - 70, yPos);
            }
            
            yPos += 15;
            
            // Oggetto
            doc.setFont(undefined, 'bold');
            doc.text('Oggetto: ', marginLeft, yPos);
            doc.setFont(undefined, 'normal');
            const oggetto = doc.splitTextToSize(preventivo.oggetto, contentWidth - 30);
            doc.text(oggetto, marginLeft + 20, yPos);
            yPos += oggetto.length * 5 + 10;
            
            doc.text('Di seguito nostra migliore offerta per la fornitura e posa di:', marginLeft, yPos);
            yPos += 15;
            
            // Tabella articoli
            doc.setFillColor(240, 240, 240);
            doc.rect(marginLeft, yPos, contentWidth, 8, 'F');
            doc.setFont(undefined, 'bold');
            doc.text('Pos.', marginLeft + 2, yPos + 6);
            doc.text('Descrizione', marginLeft + 15, yPos + 6);
            doc.text('Prezzo Unit. €', marginLeft + 120, yPos + 6);
            doc.text('Q.tà', marginLeft + 150, yPos + 6);
            doc.text('Totale €', marginLeft + 165, yPos + 6);
            
            yPos += 12;
            doc.setFont(undefined, 'normal');
            
            // Articoli
            let totaleGenerale = 0;
            document.querySelectorAll('.articolo').forEach((articolo, index) => {
                // Check nuova pagina
                if (yPos > pageHeight - 60) {
                    addFooter(1);
                    doc.addPage();
                    addWatermark();
                    yPos = 30;
                }
                
                const descrizione = articolo.querySelector('.descrizioneArticolo').value || `Articolo ${index + 1}`;
                const totaleStr = articolo.querySelector('.totaleArticolo').value;
                const totaleNum = parseFloat(totaleStr.replace('€', '').replace(',', '.')) || 0;
                totaleGenerale += totaleNum;
                
                // Riga principale
                doc.setFont(undefined, 'normal');
                doc.text(`${index + 1}`, marginLeft + 2, yPos);
                
                // Descrizione (multilinea se necessario)
                const descLines = doc.splitTextToSize(descrizione, 100);
                doc.text(descLines, marginLeft + 15, yPos);
                
                // Prezzi
                doc.text(totaleNum.toFixed(2).replace('.', ','), marginLeft + 120, yPos);
                doc.text('1', marginLeft + 150, yPos);
                doc.text(totaleNum.toFixed(2).replace('.', ','), marginLeft + 165, yPos);
                
                yPos += descLines.length * 5 + 3;
                
                // Caratteristiche tecniche se presenti
                const haCaratteristiche = descrizione.toLowerCase().includes('caratteristiche') || 
                                         descrizione.toLowerCase().includes('camere') ||
                                         descrizione.toLowerCase().includes('vetro');
                
                if (haCaratteristiche) {
                    doc.setFontSize(9);
                    doc.setTextColor(60, 60, 60);
                    
                    // Estrai caratteristiche tipiche Cerbaro
                    const caratteristiche = [
                        '- Bianco massa interno ed esterno',
                        '- telaio a Z con aletta da 35mm',
                        '- anta squadrata con fermavetro dritto',
                        '- ferramenta standard',
                        '- apertura anta e ribalta',
                        '- maniglie col. Argento',
                        '- triplo vetro con doppia camera sp. 48mm'
                    ];
                    
                    // Mostra solo alcune caratteristiche per spazio
                    const maxCaratteristiche = 3;
                    for (let i = 0; i < Math.min(caratteristiche.length, maxCaratteristiche); i++) {
                        if (yPos < pageHeight - 40) {
                            doc.text(caratteristiche[i], marginLeft + 20, yPos);
                            yPos += 4;
                        }
                    }
                    
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(10);
                }
                
                // Materiali
                const materialiElems = articolo.querySelectorAll('.materiale-row');
                if (materialiElems.length > 0) {
                    doc.setFontSize(8);
                    doc.setTextColor(80, 80, 80);
                    materialiElems.forEach(row => {
                        const select = row.querySelector('.selectMateriale');
                        const quantita = row.querySelector('.quantitaMateriale').value;
                        if (select.value && quantita && yPos < pageHeight - 40) {
                            const nome = select.options[select.selectedIndex].text.split(' (')[0];
                            doc.text(`• ${nome}: ${quantita} kg`, marginLeft + 20, yPos);
                            yPos += 4;
                        }
                    });
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(10);
                }
                
                yPos += 8;
            });
            
            // Linea totale
            yPos += 5;
            doc.setDrawColor(0, 0, 0);
            doc.line(marginLeft, yPos, pageWidth - marginRight, yPos);
            yPos += 10;
            
            // Totale
            doc.setFont(undefined, 'bold');
            doc.setFontSize(14);
            doc.text(`TOTALE iva esclusa   ${totaleGenerale.toFixed(2).replace('.', ',')}`, pageWidth - marginRight, yPos, { align: 'right' });
            
            addFooter(1);
            
            // Pagina condizioni commerciali
            doc.addPage();
            addWatermark();
            yPos = 30;
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            
            const testoCondizioni = [
                'Le immagini contenute nella presente offerta sono solo a puro scopo dimostrativo, non vincolanti.',
                'Prezzi indicativi formulati per quantità, dimensioni richieste e per l\'intero lavoro. Da confermare dopo presa',
                'visione del cantiere. Eventuali profili di finitura che si rendessero necessari per un lavoro a regola d\'arte,',
                'saranno conteggiati a consuntivo. Le voci non comprese nella presente offerta sono da ritenersi escluse.',
                'La posa in opera è da intendersi non vincolante e sarà conteggiata a consuntivo.',
                'Durante il periodo dei lavori ci riserviamo la facoltà di scattare foto che potranno essere usate anche a scopo',
                'pubblicitario sia cartaceo che elettronico.',
                '',
                'Condizioni commerciali:',
                '• Trasporto: incluso',
                '• Pratica Enea: esclusa',
                '• Smontaggio: escluso',
                '• Smaltimento: escluso',
                '• Eventuali opere murarie: escluse',
                '• Consegna: 60gg da conferma ordine',
                '• Pagamento: 60% acconto a firma contratto, 30% a merce pronta, 10% a fine lavori',
                '• Validità offerta: 30gg',
                '',
                'Rimane a vs. carico:',
                '• Cantiere libero da impedimenti',
                '• Fornitura di energia elettrica',
                '• Esecuzione di eventuali opere murarie',
                '• Impianto elettrico fino a ns. quadri',
                '• Pulizie finali del cantiere e delle opere installate',
                '• Smaltimento del materiale residuo derivante dalla posa',
                '',
                '',
                'Timbro e/o firma per accettazione:'
            ];
            
            testoCondizioni.forEach(riga => {
                if (riga.startsWith('Condizioni commerciali:') || riga.startsWith('Rimane a vs. carico:')) {
                    doc.setFont(undefined, 'bold');
                } else {
                    doc.setFont(undefined, 'normal');
                }
                doc.text(riga, marginLeft, yPos);
                yPos += 6;
            });
            
            // Box firma
            doc.rect(marginLeft, yPos, 80, 30);
            
            // Distinti saluti
            yPos = pageHeight - 50;
            doc.text('Distinti saluti', pageWidth - marginRight - 30, yPos);
            yPos += 6;
            doc.text('Massimo Grotto', pageWidth - marginRight - 30, yPos);
            yPos += 6;
            doc.setFont(undefined, 'bold');
            doc.setTextColor(204, 0, 0);
            doc.text('CERBARO', pageWidth - marginRight - 30, yPos);
            
            addFooter(2);
            
            // Pagina garanzie
            doc.addPage();
            addWatermark();
            yPos = 30;
            
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(12);
            doc.text('Garanzia:', marginLeft, yPos);
            yPos += 8;
            
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            const testoGaranzia = [
                'Il cliente finale ha diritto alla garanzia totale sul prodotto per i primi due anni dalla data di acquisto, come da normativa vigente. La',
                'garanzia copre esclusivamente il valore del materiale se riconosciuto difettoso dall\'origine. Per i vetri di fa riferimento al "Disciplinare',
                'sulla qualità ottica e visiva delle vetrate per serramenti" di Assovetro. Restano escluse in tutti i casi le spese per la sostituzione (mano',
                'd\'opera, consegna). I prodotti costruiti artigianalmente possono presentare delle differenze di tonalità di colore sia dalla campionatura,',
                'oppure per la diversità di materiali forniti su cui viene eseguita la verniciatura, oppure per problemi strettamente legati alla non',
                'ripetibilità nel tempo di speciali verniciature.',
                '',
                'Consegna:',
                'Le date di consegna sono indicativamente di giorni lavorativi dalla data di ricevimento dell\'ordine controfirmato per accettazione,',
                'completo di dati anagrafici per la fatturazione. Eventuali ritardi non daranno diritto a richieste di danni, pagamento di penali da parte',
                'del cliente o risoluzione del contratto.',
                '',
                'Pagamenti, ritardi e inadempimenti:',
                'I pagamenti devono essere effettuati entro i termini precisati in fattura. Per la prima fornitura la modalità di pagamento è bonifico',
                'bancario all\'ordine. In caso di insolvenza, Cerbaro snc ha diritto di sospendere ogni altra consegna successiva.',
                '',
                'IVA:',
                'I prezzi sono esclusi di IVA e l\'IVA applicata ordinariamente è pari al 22%. Applichiamo su richiesta IVA agevolata previo ricevimento',
                'della documentazione necessaria prima della fatturazione.',
                '',
                'Spedizioni:',
                'La merce viaggia a rischio e pericolo del cliente, anche se spedita in porto franco.',
                '',
                'Reclami:',
                'Qualsiasi vizio o difetto evidente dovrà essere comunicato in forma scritta dal cliente entro 8 giorni.',
                '',
                'Certificazioni:',
                'Richieste di certificazione specifiche devono essere fatte prima o al momento dell\'ordine.',
                '',
                '',
                'Timbro e/o firma per accettazione:',
                '',
                '',
                '_______________________________'
            ];
            
            testoGaranzia.forEach(riga => {
                if (riga.endsWith(':') && riga !== 'Timbro e/o firma per accettazione:') {
                    doc.setFont(undefined, 'bold');
                } else {
                    doc.setFont(undefined, 'normal');
                }
                
                if (yPos > pageHeight - 30) {
                    addFooter(3);
                    doc.addPage();
                    addWatermark();
                    yPos = 30;
                }
                
                doc.text(riga, marginLeft, yPos);
                yPos += 6;
            });
            
            addFooter(3);
            
            // Salva PDF
            const nomeFile = `preventivo_${cliente.nome.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(nomeFile);
            
            alert('PDF generato con successo!');
        }
    </script>
</body>
</html>