const gallery = document.querySelector(".gallery");
const imageFilter = document.getElementsByClassName("imageFilter");

function createElement(element)
{
    gallery.innerHTML +=`<figure class="imageFilter filter${element.category.id}"> <img crossorigin="anonymous" src="${element.imageUrl}" alt="${element.title}"> <figcaption>${element.title}</figcaption> <figure>`
}

function filter(filterId)
{
    if (filterId == 'filter'+element.category.id)
    {
        imageFilter.classList.add("filtered");
    }
}

fetch('http://localhost:5678/api/works')
    .then(function(res) 
    {     
        if (res.ok) 
        {       
            return res.json();    
        }  
    })   
        .then(function(value) 
        {          
            for(i=0; i< value.length;++i) 
            {         
                createElement(value[i]);     
            }   
        })   
        .catch(function(error)
        {    
        // Une erreur est survenue   
    });