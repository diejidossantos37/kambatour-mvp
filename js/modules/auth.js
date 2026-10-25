/**
 * Módulo 2: IAM - Autenticação e Autorização (POO Class)
 * Aplica os pilares de Encapsulamento e Estado Imutável
 */
class AuthModule {
    #currentUser;

    constructor() {
        this.#currentUser = {
            id: "USR-88492",
            name: "Dieji Santos",
            role: "INVESTIDOR_ADMIN",
            email: "joanajoanaalmeida81@gmail.com"
        };
    }

    getUser() {
        return Object.freeze({ ...this.#currentUser });
    }

    isAuthenticated() {
        return this.#currentUser !== null;
    }

    renderAuthStatus(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.isAuthenticated()) {
            container.innerHTML = `
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-success"><i class="fa-solid fa-user-check me-1"></i> ${this.#currentUser.role}</span>
                    <span class="fw-bold small text-dark">${this.#currentUser.name}</span>
                </div>
            `;
        }
    }
}