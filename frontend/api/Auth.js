class Auth extends API {
    static async login(params) {
        const response = await super.post('/auth/login', params);

        return await response.json();
    }

    static async register(formData) {
        const response = await API.post('/auth/register', formData);

        if (!response.ok) {
            throw Error("Erro ao registrar usuário", { cause: response });
        }

        return response.json(); // Opcional, dependendo da resposta da API.
    }
}