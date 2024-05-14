document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    update();
  }
});


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const user = firebase.auth().currentUser;
    return user;
  }
})

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

if (!isNewUser()) {
  const uid = getUserUid();
  findUserByUid(uid);
}

function getUserUid() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("uid");
}

function isNewUser() {
  return getUserUid() ? false : true;
}

function findUserByUid(uid) {
  firebase
    .firestore()
    .collection("Usuários")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        fillUserScreen(doc.data());
      } else {
        alert("Documento não encontrado");
        window.location.href = "home.html";
      }
    });
}

function fillUserScreen(userinfo) {
  console.log("Dados do usuário:", userinfo);
  form.Primeiro_Nome.value = userinfo.Primeiro_Nome;
  form.Sobrenome().value = userinfo.Sobrenome;
  form.Email().value = userinfo.Email;
  form.Celular().value = userinfo.Celular;
  console.log("Primeiro Nome:", form.Primeiro_Nome().value);
  console.log("Sobrenome:", form.Sobrenome().value);
  console.log("Celular:", form.Celular().value);
  console.log("Email:", form.Email().value);
  if (userinfo.Genero == "Feminino") {
    form.Feminino().checked = true;
  } else if (userinfo.Genero == "Masculino") {
    form.Masculino().checked = true;
  } else if (userinfo.Genero == "Outros") {
    form.Outros().checked = true;
  }
}

function update() {
  const dados = dadosCadastro();
  const novoEmail = document.getElementById("Email").value;
  const novaSenha = document.getElementById("password").value;
  const user = firebase.auth().currentUser;

  console.log("Tentando atualizar o email para:", novoEmail);
  console.log("Tentando atualizar a senha para:", novaSenha);

  if (user) {
    user.updateEmail(novoEmail)
      .then(() => {
        console.log("Email atualizado com sucesso para:", novoEmail);
        alert("Email atualizado com sucesso");
        user.updatePassword(novaSenha)
          .then(() => {
            console.log("Senha atualizada com sucesso");
            alert("Senha atualizada com sucesso");
            firebase.firestore()
              .collection("Usuários")
              .doc(getUserUid())
              .update(dados)
              .then(() => {
                window.location.href = "home.html";
              })
              .catch(() => {
                alert("Erro ao atualizar informações no Firestore");
              });
          })
          .catch((error) => {
            console.error("Erro ao atualizar senha:", error);
            alert("Erro ao atualizar senha");
          });
      })
      .catch((error) => {
        console.error("Erro ao atualizar email:", error);
        alert("Erro ao atualizar email");
      });
  } else {
    console.error("Usuário não autenticado");
    alert("Por favor, faça login para atualizar suas informações.");
  }
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
  Primeiro_Nome: () => document.getElementById("Primeiro_Nome"),
  Sobrenome: () => document.getElementById("Sobrenome"),
  Email: () => document.getElementById("Email"),
  Celular: () => document.getElementById("Celular"),
  Genero: () => document.querySelector('input[name="Genero"]:checked'),
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
