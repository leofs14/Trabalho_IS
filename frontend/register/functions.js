import { Auth } from "../api/Auth.js";

export async function start() {
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

let userToUpdate = "";

let requestType = "create";

async function start() {
    const users = await User.getAll();

    renderUsers(users);

    document.getElementById("form").onsubmit = handleFormRequest;
}

function renderUsers(users) {
    const tableElement = document.getElementById("users");

    const existingBodyElement = tableElement.children[1];

    if(existingBodyElement != undefined) {
        existingBodyElement.remove();
    }

    const bodyElement = tableElement.createTBody();

    for(let user of users) {
        let rowElement = bodyElement.insertRow();

        let nameCell = rowElement.insertCell();

        let emailCell = rowElement.insertCell();

        let optionsCell = rowElement.insertCell();

        nameCell.innerText = user.name;

        emailCell.innerText = user.email;
        
        let updateButton = document.createElement("button");

        updateButton.innerText = "Update";

        updateButton.dataset.id = user.id;

        updateButton.onclick = handleUpdate;

        optionsCell.appendChild(updateButton);

        let deleteButton = document.createElement("button");

        deleteButton.innerText = "Delete";

        deleteButton.dataset.id = user.id;

        deleteButton.onclick = handleDelete;

        optionsCell.appendChild(deleteButton);
    }
}

async function handleUpdate(evt) {
    userToUpdate = this.dataset.id;

    requestType = "update";

    let nameElement = document.getElementById("name");

    let emailElement = document.getElementById("email");

    const user = await User.getOne(userToUpdate);

    nameElement.value = user.name;

    emailElement.value = user.email;
}

function handleDelete(evt) {
    const id = this.dataset.id;

    User.delete(id);

    start();
}

async function handleFormRequest(evt) {
    evt.preventDefault();

    const form = new FormData(this);

    if(requestType == "update") {
        await User.update(form, userToUpdate);

        userToUpdate = "";

        requestType = "create";
    } else {
        await User.create(form);
    }

    document.getElementById("name").value = "";

    document.getElementById("email").value = "";

    document.getElementById("password").value = "";

    start();
}