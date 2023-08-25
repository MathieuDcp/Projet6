// Permet de générer le formulaire de connexion
document.querySelector(".form").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = {
    email: email,
    password: password,
  };

  // Requête Fetch au près de l'API pour envoyer grâce à la method " POST "
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })

    // Traitement de la réponse Api et creation et stockage du token dans local storage Ainsi qu'une section en cas de messages d'erreurs
    .then((data) => {
      const token = data.token;
      const invalidEmailDiv = document.querySelector(".invalidEmail");
      const invalidPasswordDiv = document.querySelector(".invalidPassword");
      const existingEmailErrorMessage = invalidEmailDiv.querySelector(".error-message");
      const existingPasswordErrorMessage = invalidPasswordDiv.querySelector(".error-message");
      localStorage.setItem("token", token);

    // Si le mail n'est pas correct
      if (data.message) {
        if (existingEmailErrorMessage) {
          existingEmailErrorMessage.innerText = "Email Incorrect";
        } else {
          const invalidEmail = document.createElement("p");
          invalidEmail.classList.add("error-message");
          invalidEmail.innerText = "Email Incorrect";
          invalidEmailDiv.appendChild(invalidEmail);
        }
      } else {
        if (existingEmailErrorMessage) {
          existingEmailErrorMessage.innerText = "";
        }

    // Si le mot de passe n'est pas correct
        if (data.error) {
          if (existingPasswordErrorMessage) {
            existingPasswordErrorMessage.innerText = "Mot de passe Incorrect";
          } else {
            const invalidPassword = document.createElement("p");
            invalidPassword.classList.add("error-message");
            invalidPassword.innerText = "Mot de passe Incorrect";
            invalidPasswordDiv.appendChild(invalidPassword);
          }
          
      // Si il n'y a pas d'erreur cela redirige vers le index.html
        } else {
          window.location.href = "index.html";
        }
      }
    });
});
