//Récupération de la liste des produits depuis l'API.
fetch("http://localhost:3000/api/products")
    .then(kanapRes => kanapRes.json())
    .then(kanaps => displayKanaps(kanaps))
    .catch(error => error.console.log("Erreur de récupération de l'API produits"))
    
//Fonction qui permet d'afficher un produit.
const displayOneKanap = (kanap) => {
  //Injection litterale en HTML d'un produit.
  const nodeKanap = `<a href="./product.html?id=${kanap._id}">
  <article>
    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
    <h3 class="productName">${kanap.name}</h3>
    <p class="productDescription">${kanap.description}</p>
  </article>
  </a>`;
  document.getElementById('items').innerHTML += nodeKanap;
}

// Fonction qui permet d'afficher tous les produits un par un avec une boucle forEach.
function displayKanaps(kanaps) {
  kanaps.forEach(kanap => displayOneKanap(kanap))
}