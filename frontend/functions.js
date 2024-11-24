
async function start() {
    document.getElementById("form").onsubmit = handleFormRequest
}

async function handleFormRequest(evt) {
    evt.preventDefault();

    const errorElement = document.getElementById("error");

    errorElement.innerText = "";

    const formData = new FormData(this);

    try {
        await Auth.login(formData);

        window.location.replace("users")
    }catch(e) {
        if(e.cause.status == 422) {
            const errors = await e.cause.json();

            errorElement.innerText = errors.credentials;
        }

        throw e;
    }
    
}