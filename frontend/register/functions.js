async function start() {
    document.getElementById("form").onsubmit = handleFormRequest;
}

async function handleFormRequest(evt) {
    evt.preventDefault(); // Impede o comportamento padrão do formulário.

    const errorElement = document.getElementById("error");
    errorElement.innerText = ""; // Limpa mensagens de erro.

    const formData = new FormData(evt.target); // Obtém os dados do formulário.

    try {
        await Auth.register(formData); // Chama o método de registro.

        window.location.replace("../login/index.html"); // Redireciona ao login.
    } catch (e) {
        if (e.cause && e.cause.status === 422) {
            const errors = await e.cause.json();
            errorElement.innerText = errors.message || "Erro ao registrar.";
        } else {
            errorElement.innerText = "Erro inesperado. Tente novamente.";
        }
        console.error(e); // Log para depuração.
    }
}
