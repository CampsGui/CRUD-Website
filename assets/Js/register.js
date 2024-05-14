document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    register();
  }
});

function onChangeEmail() {
  toggleButtonsDisable();
  toggleEmailErrors();
}

function onChangePassword() {
  toggleButtonsDisable();
  togglePasswordErrors();
}

function toggleEmailErrors() {
  const email = form.Email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";

  form.emailInvalidError().style.display = validateEmail(email)
    ? "none"
    : "block";
}

function togglePasswordErrors() {
  const password = form.password().value;
  form.passwordRequiredError().style.display = password ? "none" : "block";

  form.passwordMinLengthError().style.display =
    password.length >= 6 ? "none" : "block";
}

function register() {
  const email = document.getElementById("Email").value;
  const password = document.getElementById("password").value;
  const dados = dadosCadastro();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;
      return firebase
      .firestore()
      .collection("Usuários")
      .doc(userId)
      .set(dados);
    })
    .then(() => {
      window.location.href = "home.html";
      alert("Usuário Cadastrado!");
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
}

function dadosCadastro() {
  return {
    Primeiro_Nome: document.getElementById("Primeiro_Nome").value,
    Sobrenome: document.getElementById("Sobrenome").value,
    Email: document.getElementById("Email").value,
    Celular: document.getElementById("Celular").value,
    Genero: document.querySelector('input[name="Genero"]:checked').value
  }
}

function getErrorMessage(error) {
  if (error.code == "auth/email-already-in-use") {
    return "Email já está em uso";
  }
  return error.message;
}

function isFormValid() {
  const email = form.Email().value;
  if (!email || !validateEmail(email)) {
    return false;
  }

  const password = form.password().value;
  if (!password || password.length < 6) {
    return false;
  }

  const confirmPassword = form.confirmPassword().value;
  if (password != confirmPassword) {
    return false;
  }

  return true;
}

function toggleButtonsDisable() {
  const emailValid = isEmailValid();
  const passwordValid = isPasswordValid();
  document.getElementById("register-button").disabled =
    !emailValid || !passwordValid;
}

function isEmailValid() {
  const email = form.Email().value;
  if (!email) {
    return false;
  }
  return validateEmail(email);
}

function isPasswordValid() {
  return form.password().value ? true : false;
}

const form = {
  Primeiro_Nome: () => document.getElementById("Primeiro_Nome").value,
  Sobrenome: () => document.getElementById("Sobrenome").value,
  Email: () => document.getElementById("Email"),
  Celular: () => document.getElementById("Celular").value,
  Genero: () => document.querySelector('input[name="Genero"]:checked').value,
  Feminino: () => document.getElementById("Feminino"),
  Masculino: () => document.getElementById("Masculino"),
  Outros: () => document.getElementById("Outros"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  password: () => document.getElementById("senha"),
  passwordMinLengthError: () =>
    document.getElementById("password-min-length-error"),
  passwordRequiredError: () =>
    document.getElementById("password-required-error"),
  registerButton: () => document.getElementById("register-button"),
};
