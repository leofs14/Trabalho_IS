start();

async function start() {

  document.getElementById("form").onsubmit = handleFormRegister;
}

async function handleFormRegister(evt) {

  evt.preventDefault();


  const form = new FormData(this);

  console.log(form);

  
  await Auth.auth("users", form);
}