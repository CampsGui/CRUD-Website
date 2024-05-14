document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    login();
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

function login() {
  firebase
    .auth()
    .signInWithEmailAndPassword(form.email().value, form.password().value)
    .then(() => {
      window.location.href = "user.html";
      alert("Login feito com sucesso!");
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
}

function recuperarSenha() {
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      alert("Email enviado com sucesso");
    })
    .catch((error) => {
      alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
  if (error.code == "auth/user-not-found") {
    return "Usuário nao encontrado";
  }
  if (error.code == "auth/wrong-password") {
    return "Senha inválida";
  }
  return error.message;
}

function toggleEmailErrors() {
  const email = form.email().value;
  form.emailRequiredError().style.display = email ? "none" : "block";

  form.emailInvalidError().style.display = validateEmail(email)
    ? "none"
    : "block";
}

function togglePasswordErrors() {
  const password = form.password().value;
  form.passwordRequiredError().style.display = password ? "none" : "block";
}

function isEmailValid() {
  const email = form.email().value;
  if (!email) {
    return false;
  }
  return validateEmail(email);
}

function isPasswordValid() {
  return form.password().value ? true : false;
}

const form = {
  email: () => document.getElementById("email"),
  emailInvalidError: () => document.getElementById("email-invalid-error"),
  emailRequiredError: () => document.getElementById("email-required-error"),
  loginButton: () => document.getElementById("login-button"),
  password: () => document.getElementById("password"),
  passwordRequiredError: () =>
    document.getElementById("password-required-error"),
  recoverPasswordButton: () =>
    document.getElementById("recover-password-button"),
};
