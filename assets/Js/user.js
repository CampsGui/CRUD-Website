function logout() {
  firebase.auth().signOut().then(() =>{
    window.location.href = "login.html";
  }).catch(() =>{
    alert("Erro ao fazer logout");
  });
}

function handleAuthStateChange(user) {
  if (user) {
    findUserInfo(user);
  }
}

firebase.auth().onAuthStateChanged(handleAuthStateChange);

// Chamar findUserInfo com o usuário atualmente autenticado
const user = firebase.auth().currentUser;
if (user) {

  findUserInfo(user, uid);
}

function findUserInfo(user) {
  var uid = user.uid;
  firebase
    .firestore()
    .collection("Usuários")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        const userinfo = {
          ...doc.data(),
          uid: doc.id
        };
        console.log(userinfo);
        addUserToScreen(userinfo);
      } else {
        console.log("Nenhum documento encontrado com o ID do usuário:", uid);
        alert("Nenhuma informação encontrada para este usuário.");
      }
    })
    .catch(error => {
      console.error("Erro ao recuperar informações do usuário:", error);
      alert("Erro ao recuperar informações do usuário. Por favor, tente novamente mais tarde.");
    });
}

function addUserToScreen(userinfo) {
  const orderedList = document.getElementById("userinfo");

  const li = document.createElement("li");
  li.classList.add("input_group");
  li.id = userinfo.uid;
  li.addEventListener("click", () => {
    window.location.href = "edit_info.html?uid=" + userinfo.uid;
  });

  var nome = document.createElement("div");
  const Primeiro_Nome = document.createElement("div");
  Primeiro_Nome.innerHTML = userinfo.Primeiro_Nome;
  Primeiro_Nome.classList.add("input_box");
  nome.classList.add("input_group");
  nome.innerHTML = "Primeiro Nome:";
  li.appendChild(nome);
  li.appendChild(Primeiro_Nome);

  var sobrenome = document.createElement("div");
  const Sobrenome = document.createElement("div");
  Sobrenome.innerHTML = userinfo.Sobrenome;
  Sobrenome.classList.add("input_box");
  sobrenome.classList.add("input_group");
  sobrenome.innerHTML = "Sobrenome:";
  li.appendChild(sobrenome);  li.appendChild(Sobrenome);



  var email = document.createElement("div");
  const Email = document.createElement("div");
  Email.innerHTML = userinfo.Email;
  Email.classList.add("input_box");
  email.innerHTML = "Email:";
  email.classList.add("input_group");
  li.appendChild(email);
  li.appendChild(Email);

  var celular = document.createElement("div");
  const Celular = document.createElement("div");
  Celular.innerHTML = userinfo.Celular;
  Celular.classList.add("input_box");
  celular.classList.add("input_group");
  celular.innerHTML = "Celular:";
  li.appendChild(celular);
  li.appendChild(Celular);

  
  var genero = document.createElement("div");
  const Genero = document.createElement("div");
  Genero.innerHTML = userinfo.Genero;
  Genero.classList.add("input_box");
  genero.classList.add("input_group");
  genero.innerHTML = "Genêro:";
  li.appendChild(genero);
  li.appendChild(Genero);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Remover";
  deleteButton.classList.add("bt-delete");
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    askRemoveUser(userinfo);
  });
  li.appendChild(deleteButton);

  orderedList.appendChild(li);
}

function askRemoveUser(userinfo) {
  const shouldRemove = confirm("Deseja remover a solicitação?");
  if (shouldRemove) {
    RemoveUser(userinfo);
  }
}

function RemoveUser(userinfo) {
  var user = firebase.auth().currentUser;
  firebase
    .firestore()
    .collection("Usuários")
    .doc(userinfo.uid)
    .delete()
    .then(() => {
      document.getElementById(userinfo.uid).remove();
      user.delete();
      window.location.href = "register.html";
      alert("Usuário Deletado!");
    })
    .catch((error) => {
      console.log(error);
      alert("Erro ao remover informações do usuário");
    });
}
