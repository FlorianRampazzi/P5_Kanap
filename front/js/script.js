
/*1- Interroger l'API par l'id du produit à afficher présent dans l'URL de la page.
  2- Récupérer les données correspondantes au format JSON et les convertir en objet JavaScript.
  3- Appeler la fonction DisplayKanapInfo*/
fetch("http://localhost:3000/api/products")
  .then(kanapRes => kanapRes.json())
  .then(kanaps => DisplayKanaps(kanaps))
  .catch(error => console.log(error))
/*1- Création du noeud de contenu HTML
  2- Appel des éléments d'un produits.
  3- Affichage du noeud sur la page.*/
function DisplayOneKanap (kanap) {
  const nodeKanap = `<a href="./product.html?id=${kanap._id}">
  <article>
    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
    <h3 class="productName">${kanap.name}</h3>
    <p class="productDescription">${kanap.description}</p>
  </article>
  </a>`;
  document.getElementById('items').innerHTML += nodeKanap;
}
/* 1- Pour chaque produit, appelez la fonction DisplayOneKnap pour afficher le noeud HTML.*/
function DisplayKanaps(kanaps) {
  kanaps.forEach(kanap => DisplayOneKanap(kanap))
}

