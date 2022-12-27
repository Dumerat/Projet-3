const gallery = document.querySelector(".gallery"); //pour indiquer où ajouter les photos

function createElement(element) //ajoute un élément
{
    gallery.innerHTML +=`<figure class="imageFilter filter${element.category.id}"> <img crossorigin="anonymous" src="${element.imageUrl}" alt="${element.title}"> <figcaption>${element.title}</figcaption> </figure>` //code HTML d'une photo
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
    .then(function(res) 
    {
        if (res.ok) //si le fetch fonctionne
        {    
            return res.json(); //récupérer les données de l'api au format json
        }
    })
        .then(function(value)
        {
            for(i=0; i< value.length; i++) //boucle pour récupérer et séparer chaque élément
            {
                createElement(value[i]); //appelle la fonction createElement pour chaque photo reçu de l'api
            }
        })
        .catch(function(error)//en cas d'erreur
        {
            console.log(error);
        });