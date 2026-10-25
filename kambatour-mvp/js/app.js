/**
 * CONTROLADOR CENTRAL (Orquestrador SPA & Mapeamento GIS)
 */
class AppController {
    constructor() {
        this.auth = new AuthModule();
        this.catalog = new CatalogModule();
        this.booking = new BookingModule();
        this.recommendation = new RecommendationEngine();
        this.payment = new PaymentGatewayModule();
        this.map = null;
        this.markers = [];
        this.selectedDestinationForBooking = null;
    }

    init() {
        this.auth.renderAuthStatus("auth-status-container");
        this.renderCatalog(this.catalog.getAll());
        this.initGISMap();
        this.logAudit("M10", "Ecossistema de 10 Módulos Inicializado com sucesso sem exceções.");
    }

    logAudit(moduleTag, message) {
        const consoleContainer = document.getElementById("audit-log-container");
        if (!consoleContainer) return;

        const timeStr = new Date().toLocaleTimeString("pt-AO");
        const entry = document.createElement("div");
        entry.className = "audit-log-entry";
        entry.innerHTML = `<span class="text-warning">[${timeStr}] [${moduleTag}]</span> ${message}`;
        consoleContainer.prepend(entry);
    }

    renderCatalog(destinations) {
        const container = document.getElementById("catalog-cards-container");
        if (!container) return;

        container.innerHTML = "";
        destinations.forEach(d => {
            const cardHtml = `
                <div class="col-md-6 col-lg-3">
                    <div class="card card-destination h-100">
                        <img src="${d.image}" class="card-img-top" alt="${d.title}" style="height: 180px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge badge-province">${d.province}</span>
                                <span class="small text-warning fw-bold"><i class="fa-solid fa-star"></i> ${d.rating}</span>
                            </div>
                            <h5 class="card-title fw-bold">${d.title}</h5>
                            <p class="card-text text-muted small flex-grow-1">${d.description}</p>
                            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-muted d-block small">A partir de</span>
                                    <span class="fw-bold text-dark fs-6">${d.priceKz.toLocaleString()} Kz</span>
                                </div>
                                <button class="btn btn-brand-primary btn-sm" onclick="app.openBookingModal('${d.id}')">
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });
    }

    filterCatalog(province) {
        const filtered = this.catalog.getByProvince(province);
        this.renderCatalog(filtered);
        this.logAudit("M3_CATALOG", `Filtro aplicado para província: ${province}. ${filtered.length} itens encontrados.`);
    }

    initGISMap() {
        const defaultCoords = [-12.5, 18.5]; // Coordenadas centrais de Angola
        this.map = L.map('map-container').setView(defaultCoords, 6);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.catalog.getAll().forEach(d => {
            const marker = L.marker([d.lat, d.lng]).addTo(this.map);
            marker.bindPopup(`<b>${d.title}</b><br>${d.province}<br><b>${d.priceKz.toLocaleString()} Kz</b>`);
            this.markers.push(marker);
        });

        this.logAudit("M9_GIS", "Mapas geoespaciais e marcadores de pontos de interesse renderizados via Leaflet.");
    }

    handleIARecommendation(event) {
        event.preventDefault();
        const style = document.getElementById("ia-style").value;
        const duration = document.getElementById("ia-duration").value;

        const result = this.recommendation.generateItinerary(style, duration, this.catalog.getAll());

        const resultBox = document.getElementById("ia-result-box");
        let listItems = result.destinations.map(d => `<li class="list-group-item d-flex justify-content-between align-items-center"><span>${d.title} (${d.province})</span><span class="fw-bold text-success">${d.priceKz.toLocaleString()} Kz</span></li>`).join('');

        resultBox.innerHTML = `
            <div class="w-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold text-dark mb-0">${result.title}</h5>
                    <span class="badge bg-success">Acurácia IA: ${result.aiConfidenceScore}</span>
                </div>
                <p class="small text-muted mb-3"><i class="fa-clock fa-regular me-1"></i> Duração estimada: ${result.duration}</p>
                <ul class="list-group mb-3">
                    ${listItems}
                </ul>
                <div class="alert alert-info py-2 d-flex justify-content-between align-items-center mb-0">
                    <span class="small fw-semibold">Custo Estimado do Pacote:</span>
                    <span class="fw-bold fs-5">${result.estimatedBudgetKz.toLocaleString()} Kz</span>
                </div>
            </div>
        `;

        this.logAudit("M5_IA", `Inferência de Roteiro executada para estilo [${style}] com pontuação de confiança de ${result.aiConfidenceScore}.`);
    }

    openBookingModal(destinationId) {
        this.selectedDestinationForBooking = this.catalog.getById(destinationId);
        if (!this.selectedDestinationForBooking) return;

        document.getElementById("modal-destination-id").value = destinationId;
        document.getElementById("modal-booking-summary").innerHTML = `
            <strong>Destino Selecionado:</strong> ${this.selectedDestinationForBooking.title} (${this.selectedDestinationForBooking.province})<br>
            <strong>Preço Individual:</strong> ${this.selectedDestinationForBooking.priceKz.toLocaleString()} Kz
        `;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById("booking-date").value = tomorrow.toISOString().split('T')[0];

        this.updateCheckoutTotal();

        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();

        this.logAudit("M4_BOOKING", `Interface de checkout aberta para o recurso [${destinationId}].`);
    }

    updateCheckoutTotal() {
        if (!this.selectedDestinationForBooking) return;
        const guests = parseInt(document.getElementById("booking-guests").value) || 1;
        const total = this.selectedDestinationForBooking.priceKz * guests;
        document.getElementById("modal-total-price").innerText = total.toLocaleString() + " Kz";
    }

    handleCheckoutSubmit(event) {
        event.preventDefault();
        try {
            const date = document.getElementById("booking-date").value;
            const guests = parseInt(document.getElementById("booking-guests").value);
            const paymentMethod = document.getElementById("booking-payment").value;

            const order = this.booking.createOrder(this.selectedDestinationForBooking, date, guests, paymentMethod);
            const paymentResult = this.payment.processPayment(order);

            this.logAudit("M6_PAYMENT", `Transação aprovada [Ref: ${paymentResult.transactionRef}] - Valor: ${paymentResult.amountPaid.toLocaleString()} Kz via ${paymentMethod}.`);

            const modalEl = document.getElementById('bookingModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            alert(`✅ RESERVA CONFIRMADA COM SUCESSO!\n\nCódigo da Ordem: ${order.id}\nTransação: ${paymentResult.transactionRef}\nTotal Pago: ${order.totalKz.toLocaleString()} Kz\n\nO seu Voucher de Viagem foi emitido e associado ao seu perfil.`);

        } catch (error) {
            alert(`❌ ERRO NA OPERAÇÃO: ${error.message}`);
            this.logAudit("M10_ERROR", `Falha de Validação de Negócio: ${error.message}`);
        }
    }
}

const app = new AppController();
document.addEventListener("DOMContentLoaded", () => app.init());