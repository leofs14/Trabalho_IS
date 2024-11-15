class User extends API {
    static async getAll() {
        try {
            const response = await super.get('/users', {});

            return await response.json();
        }catch(e) {
            return [];
        }
    }

    static async getOne(name) {
        const response = await super.get('/users/' + name, {});

        return await response.json();
    }

    static async create(params) {
        const response = await super.post('/users', params);

        return await response.json();
    }

    static async update(params, name) {
        const response = await super.put('/users/' + name, params);

        return await response.json();
    }

    static async delete(name) {
        const response = await super.delete('/users/' + name);

        return await response.json();
    }
}