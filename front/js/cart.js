// Stockage des objets contenu dans le localStorage dans un tableau panier.
let cart = JSON.parse(localStorage.getItem("kanap Order"));

let productsAPI = [];

getProductsFromAPI(cart);
/* --------------------------------------------------------------------------------------------------------------
  1- Pour chaque produit contenu dans le panier :
  2- Interroger l'API par l'id du produit présent dans le panier.
  3- Récupérer les données correspondantes au format JSON et les convertir en objet JavaScript.
  4- Intégrer les valeurs de couleur et de quantité présentes dans le panier dans les objets précédents.
  5- Stocker les nouveaux objets dans un tableau.
*/
async function getProductsFromAPI(products) {
  try {
    for (let i in products) {
      let APIproduct;

      await fetch(`http://localhost:3000/api/products/`+ products[item].id)
          .then(ResAPI => ResAPI.json())
          .then(data => (APIproduct = data))
          .catch(error => console.log(error))

      APIproduct.color = products[i].color;
      APIproduct.quantity = products[i].quantity;
      productsAPI.push(APIproduct);
    }

    displayCartProducts();

  } catch(error) {
    console.log(error);
  } 
}
/* --------------------------------------------------------------------------------------------------------------
  1- Pour chaque produit contenu dans le panier :
  2- Générer le noeud html nodeCart.
  3- Intégrer les valeurs propres à chaques produit.
  4- Afficher le tout dans l'HTML.
  5- Appeler les fonctions de calcul totaux et de modification/suppression.
*/
function displayCartProducts() {
  productsAPI.forEach(products => {

    const nodeCart = `<article class="cart__item" data-id="${products._id}" data-color="${products.color}">
                      <div class="cart__item__img">
                        <img src="${products.imageUrl}" alt="${products.altTxt}">
                      </div>
                      <div class="cart__item__content">
                        <div class="cart__item__content__description">
                          <h2>${products.name}</h2>
                          <p>${products.color}</p>
                          <p>Prix : ${products.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                          <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${products.quantity}">
                          </div>
                          <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                          </div>
                        </div>
                      </div>
                    </article>`;

    document.getElementById("cart__items").innerHTML += nodeCart;

  })
  totalQuantityAndPrice();
  inputQuantitytyUpdate();
  deleteProductInCart();
};
/* --------------------------------------------------------------------------------------------------------------
  1- Initialisation des variable totales quantité et prix à 0.
  2- Boucle parcourant le panier et récupérant l'id de chaque produits.
  3- Ajout de la quantité de chaque produit dans la variable totalQuantity.
  4- Ajout du prix de chaque produit dans la variable totalPrice et multiplication de chaque prix par la quantité de chaque produit.
  5- Affichage des valeurs totales.
*/
function totalQuantityAndPrice() {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i in cart) {
      let currentIndex = productsAPI.findIndex(product => product._id == cart[i].id);

      totalQuantity += cart[i].quantity;
      totalPrice += cart[i].quantity * productsAPI[currentIndex].price;
    }

    document.querySelector("#totalQuantity").innerHTML = totalQuantity;
    document.querySelector("#totalPrice").innerHTML = totalPrice;
}
/* --------------------------------------------------------------------------------------------------------------
  1- Récupération des inputs de quantité et ajout d'un eventListener change.
  2- Récupération du noeud (article) contenant le produit et ses datas id et color.
  3- Comparaison des datas avec le panier.
  4- Restriction de saisie à une valeur comprise entre 1 et 100.
  5- Mis à jour de la quantité avec une valeur comprise entre 1 et 100.
  5- Ajout du tableau panier avec la nouvelle quantité dans le localStorage.
  6- Recalcul des totaux.
*/
function inputQuantitytyUpdate() {
  let inputQuantity = document.querySelectorAll(".itemQuantity");

  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener("change", (e) => {

      let article = inputQuantity.closest("article");
      let dataId = article.getAttribute("data-id");
      let dataColor = article.getAttribute("data-color");

      for (let i in cart) {
        if (cart[i].id === dataId && cart[i].color === dataColor) {

          if (e.target.value > 100) {
            e.target.value = 100;

          } else if (e.target.value < 1) {
            e.target.value = 1;
          } 

          cart[i].quantity = parseInt(e.target.value);
          localStorage.setItem("kanap Order", JSON.stringify(cart));
        }
        totalQuantityAndPrice();
      }
    })
  })
}
/* --------------------------------------------------------------------------------------------------------------
  1- Récupération des boutons "supprimer" et ajout d'une écoute d'evennement clic.
  2- Récupération du noeud (article) contenant le produit et ses datas id et color.
  3- Comparaison des datas avec le tableaux du panier et suppression du produit correspondant dans le tableau.
  4- Mis à jour du tableau de panier dans le localStorage.
  5- Suppression du noeud html.
  6- Recalcul des totaux.
*/
function deleteProductInCart() {
  let inputDelete = document.querySelectorAll(".deleteItem");

  inputDelete.forEach((inputDelete) => {

    inputDelete.addEventListener('click', () => {

      let article = inputDelete.closest("article");
      let dataId = article.getAttribute("data-id");
      let dataColor = article.getAttribute("data-color");
      
      let productIndex = cart.findIndex(element => element.id === dataId && element.color === dataColor);
      cart.splice(productIndex, 1);
      
      localStorage.setItem("kanap Order", JSON.stringify(cart));
      article.remove();

      totalQuantityAndPrice();
    })
  })
}
