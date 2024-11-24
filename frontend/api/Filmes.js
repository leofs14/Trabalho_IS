// Pokemon.js

class Pokemon extends API {
    static async search() {
        try {
            const response = await super.get('/pokemons', {});

            return await response.json();
        } catch (e) {
            return [];
        }
    }

    static async getOne(name) {
        const response = await super.get('/pokemons/' + name, {});

        return await response.json();
    }

    static async addFavorito(userId, pokemonId, pokemonName) {
        try {
            const response = await super.post('/pokemon_id/favorito', {
                user_id: userId,
                pokemon_id: pokemonId,
                pokemon_name: pokemonName
            });

            return await response.json();
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
            throw error;
        }
    }
}
