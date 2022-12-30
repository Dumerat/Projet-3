const gallery = document.querySelector(".gallery"); //pour indiquer où ajouter les photos
const modalGallery = document.querySelector(".modalGallery"); //pareil pour les modales

function createElement(element) //ajoute un élément
{
    gallery.innerHTML +=`<figure class="imageFilter filter${element.category.id}"> <img crossorigin="anonymous" src="${element.imageUrl}" alt="${element.title}"> <figcaption>${element.title}</figcaption> </figure>`; //code HTML d'une photo
    modalGallery.innerHTML +=`<figure class="figureModal"><img class="imageModal" crossorigin="anonymous" src="${element.imageUrl}"  alt="${element.title}"><i class="fa-solid fa-trash-can trashCan"></i><i class="fa-solid fa-arrows-up-down-left-right arrowMove"></i><figcaption>Éditer</figcaption></figure>`;
}

function filter(filterId) //filtre les photos par leur id
{
    const imageFilter = document.getElementsByClassName("imageFilter"); //récupère les photo pour vérifier leur id
    //console.log(imageFilter)

    for(i=0; i<imageFilter.length; i++) //boucle pour check toutes les photos
    {
        if (imageFilter[i].classList.contains(filterId)) //si l'id de la photo correspond au filtre du boutton
        {
            imageFilter[i].classList.remove("filtered"); //affiche l'image
        }
        else if (filterId == "filter0") //boutton TOUT
        {
            imageFilter[i].classList.remove("filtered"); //affiche toutes les images
        }
        else //si l'image ne doit pas être affiché
        {
            imageFilter[i].classList.add("filtered"); //cache l'image
            //console.log(filterId);
        }
    }
}

fetch('http://localhost:5678/api/works')
    .then((res) =>
    {
        if (res.ok) //si le fetch fonctionne
        {    
            return res.json(); //récupérer les données de l'api au format json
        }
    })
    .then((value) =>
    {
        for(i=0; i< value.length; i++) //boucle pour récupérer et séparer chaque élément
        {
            createElement(value[i]); //appelle la fonction createElement pour chaque photo reçu de l'api
        }
    })
    .catch((error) =>//en cas d'erreur
    {
        console.log(error);
    });

function loggedIn() //fonction pour faire disparaitre la barre des filtres et apparaitre le bouton modifier
{
    const token = sessionStorage.getItem("token");
    if (!token) {return 0}
    else if (token)
    {
        document.getElementById("buttonFilter").style.display = 'none';
        document.getElementById("loginA").textContent = "logout";
        document.getElementById("editMode").style.display = "inline";
        document.getElementById("adminPanel").style.display = "flex";
    }
}
loggedIn()

const login = document.querySelector("#loginA");
login.addEventListener('click', loginButton);

function loginButton() //fonction pour changer le bouton login pour logout et inversement
{
    const token = sessionStorage.getItem("token");
    if (!token)
    {
        document.location.href = "login.html";
    }
    else if(token)
    {
        sessionStorage.clear("token")
        document.location.href = "index.html"
    }
};

const editMode = document.getElementById("editMode");
editMode.addEventListener("click", () => {document.getElementById("modal").style.visibility = "visible"});

const editModeClose = document.getElementById("buttonCloseModal");
editModeClose.addEventListener("click", () => {document.getElementById("modal").style.visibility = "hidden"});