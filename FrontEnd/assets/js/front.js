const gallery = document.querySelector(".gallery"); //pour indiquer où ajouter les photos
const modalGallery = document.getElementById("modalGallery"); //pareil pour les modales

function createElement(element) //ajoute un élément
{
    gallery.innerHTML +=`<figure data-Id='${element.id}' class="imageFilter filter${element.category.id}"> <img crossorigin="anonymous" src="${element.imageUrl}" alt="${element.title}"> <figcaption>${element.title}</figcaption> </figure>`; //code HTML d'une photo
    modalGallery.innerHTML +=`<figure data-Id='${element.id}' class="figureModal"><img class="imageModal" crossorigin="anonymous" src="${element.imageUrl}"  alt="${element.title}"><i class="fa-solid fa-trash-can trashCan"></i><i class="fa-solid fa-arrows-up-down-left-right arrowMove"></i><figcaption>Éditer</figcaption></figure>`;
}

document.getElementById("buttonFilter").addEventListener("click", (event)=> //crée un event qui appelle filter en fonction du boutton utilisé
{
    const dataId = event.target.getAttribute("data-Id")
    filter("filter"+dataId)
});

function filter(filterId) //filtre les photos par leur id
{
    const imageFilter = document.getElementsByClassName("imageFilter"); //récupère les photo pour vérifier leur id

    for(i=0; i<imageFilter.length; i++) //boucle pour check toutes les photos aurait pu être une boucle foreach
    {
        if (imageFilter[i].classList.contains(filterId)) //si l'id de la photo correspond au filtre du boutton
        {
            imageFilter[i].classList.remove("filtered"); //affiche l'image
        }
        else if (filterId === "filter0") //boutton TOUT
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

document.querySelector("#loginA").addEventListener('click', loginButton);

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

document.getElementById("editMode").addEventListener("click", editOpen);
document.getElementById("buttonBackModal").addEventListener("click", editOpen);

function editOpen() //ouverture de la modale de base
{
    document.getElementById("modal").style.visibility = "visible";
    document.querySelectorAll(".galleryEdit").forEach(element => {element.style.display = "flex"})
    document.getElementById("titreModal").textContent = "Galerie photo"
    document.querySelectorAll(".galleryAdd").forEach(element => {element.style.display = "none"})
    modalGallery.style.display = "grid"
    document.getElementById("buttonBackModal").style.visibility = "hidden"
    trashListener()
};

document.getElementById("buttonAddImage").addEventListener("click", () => //passe en mode ajout d'image
{
    document.querySelectorAll(".galleryEdit").forEach(element => {element.style.display = "none"})
    modalGallery.style.display = "none"
    document.getElementById("buttonBackModal").style.visibility = "visible"
    document.querySelectorAll(".galleryAdd").forEach(element => {element.style.display = "flex"})
    document.getElementById("titreModal").textContent = "Ajout photo"
});

document.getElementById("buttonCloseModal").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", (event) =>{ if(event.target.id === document.getElementById("modal").id) {closeModal()}});

function closeModal() //ferme la page modale 
{
    document.getElementById("modal").style.visibility = "hidden";
    document.querySelectorAll(".galleryEdit").forEach(element => {element.style.display = "none"})
    document.querySelectorAll(".galleryAdd").forEach(element => {element.style.display = "none"})
    document.getElementById("buttonBackModal").style.visibility = "hidden"
};

const imagePreview = document.getElementById("buttonSearchImage"); 
imagePreview.addEventListener("change", (event) => //event pour afficher l'image à la place de la fenêtre d'ajout
{
    const file = event.target.files[0];
    if(file.size < 4194304) //vérifie la taille de l'image
    {
        const imagePreviewBox = document.getElementById("imageShowPreview");
        const fileUrl = URL.createObjectURL(file);
        imagePreviewBox.src = fileUrl; // ajouter la preview de l'image

        const sendImageContentElements = document.querySelectorAll(".sendImageContent");
        for (const element of sendImageContentElements)
        {
            element.style.display = "none";
            imagePreviewBox.style.display = "block";
        }
    }
    else {alert("image trop volumineuse")}
});

function deleteWork(id) //supprime un travail au niveau de l'api avec le bouton trash assigné 
{
    fetch(`http://localhost:5678/api/works/${id}`,
    {
        method: 'DELETE',
        headers:
        {
            Authorization: `Bearer ${sessionStorage["token"]}`,
        }
    })
    .then(res =>
    {
        if(res.ok)
        {
            console.log("Projet supprimé avec succès")
        }
    })
    .catch((error) => {console.log(error)});
}

function trashListener() //event icone poubelle pour supprimé un proje dynamiquement
{
    const work = document.getElementById("modalMain");
    const buttonDelete = Array.from(document.getElementsByClassName("trashCan"));
    work.addEventListener("click",(event) => 
    {
        if (buttonDelete.includes(event.target)) 
        {
            const dataId = event.target.parentElement.getAttribute("data-Id")
            const galleryFigures = Array.from(gallery.querySelectorAll("figure"))
            deleteWork(dataId);
            galleryFigures.forEach(figure => 
            {
                if(figure.getAttribute("data-Id") === dataId) {figure.remove()}
            });
            event.target.parentElement.remove(); //supprime la photo modale
        }
    });
}

document.getElementById("sendImage").addEventListener("change", verifySendData) //verifie les changement dans le form
document.getElementById("buttonSendImage").addEventListener("click", () => {if(verifySendData){createNewWork()}}); //si le bouton est valide(vert) createNewWork() quand cliqué

function verifySendData() //vérifie si les éléments photo et titre sont bien remplis
{
    const buttonCheck = document.getElementById("buttonSendImage")
    const newImage = document.getElementById("buttonSearchImage");
    const newTitle = document.getElementById("sendImageTitle");
    console.log(newImage.value)
    if (newImage.value != "" && newTitle.value != "") { buttonCheck.style.backgroundColor = "#1D6154"; return true}
    else { buttonCheck.style.backgroundColor = "A7A7A7"; return false}
}

function createNewWork() //crée la nouvelle image
{
    const data = new FormData();
    const newImage = document.getElementById("buttonSearchImage");
    const newTitle = document.getElementById("sendImageTitle");
    const newCategory = document.getElementById("sendImageCategory");
    data.append("image", newImage.files[0]);
    data.append("title", newTitle.value);
    data.append("category", newCategory.value);
    console.log(data)

    fetch('http://localhost:5678/api/works', //envoie une requête à l'api pour crée une nouvelle image
    {
        method: "POST",
        accept: "application/json",
        headers: {
            Authorization: `Bearer ${sessionStorage["token"]}`,
        },
        body: data,
    })
    .then((res) =>
    {
        if(res.ok)
        {
            alert("Projet ajouté !")
            createWorkDynamic()
        }
        else {alert("Erreur dans la réception du nouveau travaux")}
    })
    .then((data) => {console.log(data)})
    .catch((error) => {console.log(error)});
}

function createWorkDynamic() //ajoute dynamiquement le projet ajouter en utilisant d'ancienne fonction
{
    fetch('http://localhost:5678/api/works')
    .then((res) =>
    {
        if (res.ok)
        {    
            return res.json();
        }
    })
    .then(value =>
    {
        createElement(value[value.length-1]);
    })
}