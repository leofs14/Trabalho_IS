
async function start() {
    document.getElementById("form").onsubmit = handleFormRequest
}

async function handleFormRequest(evt) {
    evt.preventDefault();

    const errorElement = document.getElementById("error");

    errorElement.innerText = "";

    const formData = new FormData(this);

    try {
        // Faz login e armazena o estado no localStorage
        await Auth.login(formData);

        // Salvar ID de usuário ou qualquer outra informação necessária no localStorage
        localStorage.setItem('userLoggedIn', true);

        window.location.replace("../principal/filmes.html");
    } catch (e) {
        if (e.cause.status == 422) {
            const errors = await e.cause.json();
            errorElement.innerText = errors.credentials;
        }

        throw e;
    }
}
