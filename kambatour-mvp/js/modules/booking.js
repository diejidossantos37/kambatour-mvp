/**
 * Módulo 4: Motor de Reservas & Estado de Ordens (POO Class)
 * Aplica Zero Tolerância a Erros e Validação de Estado Imutável
 */
class BookingOrder {
    constructor(id, destinationId, destinationTitle, date, guests, totalKz, paymentMethod) {
        this.id = id;
        this.destinationId = destinationId;
        this.destinationTitle = destinationTitle;
        this.date = date;
        this.guests = guests;
        this.totalKz = totalKz;
        this.paymentMethod = paymentMethod;
        this.status = "CONFIRMADA_E_PAGA";
        this.createdAt = new Date().toISOString();
    }
}

class BookingModule {
    #orders = [];

    createOrder(destination, date, guests, paymentMethod) {
        if (!destination) throw new Error("ERRO_VAL: Destino é obrigatório.");
        if (!date) throw new Error("ERRO_VAL: Data de viagem é obrigatória.");
        
        // Garante parsing sem problemas de fusos horários
        const selectedDate = new Date(date + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            throw new Error("REGRA_NEGOCIO: Impossível efetuar reserva para datas passadas.");
        }

        if (isNaN(guests) || guests < 1 || guests > 10) {
            throw new Error("REGRA_NEGOCIO: Limite de participantes por reserva é entre 1 e 10 pessoas.");
        }

        const totalKz = destination.priceKz * guests;
        const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        const order = new BookingOrder(orderId, destination.id, destination.title, date, guests, totalKz, paymentMethod);
        this.#orders.push(order);
        return order;
    }

    getOrders() {
        return [...this.#orders];
    }
}