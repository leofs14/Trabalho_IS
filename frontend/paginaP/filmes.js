// Adiciona o evento de submit no formulário de pesquisa
document.getElementById('pokemon-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const pokemonName = document.getElementById('pokemon-name').value.trim().toLowerCase();

    // Verificar se o nome do Pokémon foi fornecido
    if (pokemonName) {
        // Redireciona para a página de detalhes do Pokémon, passando o nome como parâmetro na URL
        window.location.href = `http://127.0.0.1:5500/frontend/pesquisados/pokemon_pesquisado.html?pokemon=${pokemonName}`;
    } else {
        alert("Por favor, insira o nome de um Pokémon.");
    }
});

let currentPage = 1;
const itemsPerPage = 15;
let totalPokemons = 0;
let maxPages = 0;

async function fetchPokemons(page) {
    const offset = (page - 1) * itemsPerPage;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage}`);
        if (!response.ok) throw new Error('Erro ao buscar a lista de Pokémons.');

        const data = await response.json();
        totalPokemons = data.count;
        maxPages = Math.ceil(totalPokemons / itemsPerPage);

        const pokemonDetails = await Promise.all(data.results.map(async (pokemon) => {
            const detailsResponse = await fetch(pokemon.url);
            if (!detailsResponse.ok) throw new Error('Erro ao buscar detalhes do Pokémon.');
            return detailsResponse.json();
        }));
        displayPokemons(pokemonDetails);

        updatePaginationInfo();

        // Atualizar estado dos botões
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page === maxPages;
    } catch (error) {
        document.getElementById('pokemon-table').innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayPokemons(pokemons) {
    const tableDiv = document.getElementById('pokemon-table');
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Imagem</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
    `;
    pokemons.forEach((pokemon) => {
        tableHTML += `
            <tr>
                <td>${pokemon.id}</td>
                <td><a href="http://127.0.0.1:5500/frontend/pesquisados/pokemon_pesquisado.html?pokemon=${pokemon.name}" class="pokemon-link">
                    ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </a></td>
                <td><img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" /></td>
                <td>
                <button data-id="${pokemon.id}" onclick="addToFavorites('${pokemon.id}', '${pokemon.name}')">
                    Adicionar aos Favoritos
                </button>

                </td>
            </tr>
        `;
    });
    tableHTML += `
            </tbody>
        </table>
    `;
    tableDiv.innerHTML = tableHTML;
}

function updatePaginationInfo() {
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Página ${currentPage} de ${maxPages}`;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPokemons(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < maxPages) {
        currentPage++;
        fetchPokemons(currentPage);
    }
});

document.getElementById('go-to-page').addEventListener('click', () => {
    const pageInput = document.getElementById('page-input').value;
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= maxPages) {
        currentPage = page;
        fetchPokemons(currentPage);
    } else {
        alert(`Por favor, insira um número entre 1 e ${maxPages}`);
    }
});
async function addToFavorites(pokemon_id, pokemon_name) {
    // Obter o id do usuário logado (de preferência da sessão ou do localStorage)
    const userId = localStorage.getItem('userLoggedIn'); // Exemplo de como pegar o id do usuário

    if (!userId) {
        alert('Você precisa estar logado para adicionar Pokémon aos favoritos.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:4000/pokemon_id/favorito', {
            method: 'POST', // Alterado de PATCH para POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,  // Passar o id do usuário logado
                pokemon_id: pokemon_id,
                pokemon_name: pokemon_name
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao adicionar Pokémon aos favoritos.');
        }

        const data = await response.json();
        
        // Atualizar o botão para mostrar que o Pokémon foi adicionado
        const button = document.querySelector(`button[data-id='${pokemon_id}']`);
        if (button) {
            button.textContent = "Adicionado aos Favoritos";
            button.disabled = true; // Desabilitar o botão após adicionar aos favoritos
        }

        alert(data.message); // Exibe a mensagem de sucesso
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userLoggedIn')) {
        // Se não estiver logado, redireciona para a página de login
        window.location.replace("../login/index.html");
    }
});

// Carregar a primeira página ao iniciar
fetchPokemons(currentPage);
