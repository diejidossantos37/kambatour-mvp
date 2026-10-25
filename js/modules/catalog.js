/**
 * Módulo 3: Catálogo e Inventário de Serviços Turísticos (POO Class)
 */
class Destination {
    constructor(id, title, province, priceKz, rating, image, lat, lng, description) {
        this.id = id;
        this.title = title;
        this.province = province;
        this.priceKz = priceKz;
        this.rating = rating;
        this.image = image;
        this.lat = lat;
        this.lng = lng;
        this.description = description;
    }
}

class CatalogModule {
    #destinations = [];

    constructor() {
        this.#initData();
    }

    #initData() {
        this.#destinations = [
            new Destination(
                "DEST-01",
                "Quedas de Kalandula",
                "MALANJE",
                45000,
                4.9,
                "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80",
                -9.0761, 16.0022,
                "Uma das maiores quedas de água da África. Espetáculo natural imperdível em Malanje."
            ),
            new Destination(
                "DEST-02",
                "Serra da Leba",
                "HUÍLA",
                38000,
                4.8,
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
                -15.0719, 13.2403,
                "Famosa estrada em caracol com vistas panorâmicas deslumbrantes da curvatura da montanha."
            ),
            new Destination(
                "DEST-03",
                "Ilha do Mussulo",
                "LUANDA",
                25000,
                4.7,
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
                -8.9500, 13.1667,
                "Santuário de praias calmas, coqueiros e resorts de descanso a poucos minutos da capital."
            ),
            new Destination(
                "DEST-04",
                "Deserto do Namibe & Arco",
                "NAMIBE",
                52000,
                4.9,
                "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
                -15.1961, 12.1522,
                "Paisagens desérticas únicas, contacto com a planta Welwitschia Mirabilis e praias selvagens."
            )
        ];
    }

    getAll() {
        return [...this.#destinations];
    }

    getById(id) {
        return this.#destinations.find(d => d.id === id) || null;
    }

    getByProvince(province) {
        if (province === 'TODOS') return this.getAll();
        return this.#destinations.filter(d => d.province === province);
    }
}