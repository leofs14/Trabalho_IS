
start();

async function start() {

  document.getElementById("form").onsubmit = handleFormRequest;
}

async function handleFormRequest(evt) {

  evt.preventDefault();

  const form = new FormData(this);

  console.log(form);

  await Auth.auth("login", form);
}