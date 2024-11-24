document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Requisição para obter os favoritos do usuário logado
        const response = await fetch('/api/favorites', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Sem pokemons no momento');
        }

        const favorites = await response.json();
        displayFavorites(favorites);
    } catch (error) {
        document.getElementById('favorites-list').innerHTML = `<p>${error.message}</p>`;
    }
});

function displayFavorites(favorites) {
    const listDiv = document.getElementById('favorites-list');
    if (favorites.length === 0) {
        listDiv.innerHTML = '<p>Nenhum Pokémon favorito encontrado.</p>';
        return;
    }

    let html = '<ul>';
    favorites.forEach(fav => {
        html += `
            <li>
                ${fav.pokemon_name.charAt(0).toUpperCase() + fav.pokemon_name.slice(1)}
            </li>
        `;
    });
    html += '</ul>';
    
    listDiv.innerHTML = html;
}
