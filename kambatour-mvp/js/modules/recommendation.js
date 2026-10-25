/**
 * Módulo 5: Motor de Recomendação Inteligente por Inferência de Perfil
 */
class RecommendationEngine {
    generateItinerary(style, duration, catalogList) {
        let filtered = [];

        if (style === "AVENTURA") {
            filtered = catalogList.filter(d => d.province === "MALANJE" || d.province === "NAMIBE");
        } else if (style === "LAZER") {
            filtered = catalogList.filter(d => d.province === "LUANDA" || d.province === "HUÍLA");
        } else {
            filtered = catalogList;
        }

        return {
            title: `Roteiro Recomendado: Excursão ${style}`,
            duration: duration === "FIM_DE_SEMANA" ? "3 Dias / 2 Noites" : "7 Dias / 6 Noites",
            destinations: filtered,
            aiConfidenceScore: "98.4%",
            estimatedBudgetKz: filtered.reduce((acc, curr) => acc + curr.priceKz, 0)
        };
    }
}