//on espère ça marche

let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const user = {
        email: emailInput.value,
        password: passwordInput.value,
    };
    fetch("http://localhost:5678/api/users/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(user) //pour envoyer user en Json
    })
    .then((response) => {
        if (response.status == 200)
        {
            return response.json();
        }
        else
        {
            //div.innerHTML += `<p> Erreur dans l'identifiant ou le mot de passe </p>`
            alert("Erreur dans l'identifiant ou le mot de passe")
        }
    })
    .then((data) => {
        localStorage.setItem("userId", data.userId); //stockage userId
        localStorage.setItem("token", data.token);  //stockage token
        document.location.href = "index.html";  //redirection
        console.log(user)
        console.log(data.token)
    })
    .catch((error) => {
        console.log(error);
    });

});




//token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"