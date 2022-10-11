// Stockage des objets contenu dans le localStorage dans un tableau panier.
let cart = JSON.parse(localStorage.getItem("kanap Order"));

let productsAPI = [];

GetProductsFromAPI(cart);
/*1- Pour chaque produit contenu dans le panier :
  2- Interroger l'API par l'id du produit présent dans le panier.
  3- Récupérer les données correspondantes au format JSON et les convertir en objet JavaScript.
  4- Intégrer les valeurs de couleur et de quantité présentes dans le panier dans les objets précédents.
  5- Stocker les nouveaux objets dans un tableau.*/
async function GetProductsFromAPI(products) {
  for (let i in products) {
    let APIresult;

    await fetch(`http://localhost:3000/api/products/`+ products[i].id)
        .then(response => response.json())
        .then(result =>  APIresult = result)
        .catch(error => console.log(error))

    APIresult.color = products[i].color;
    APIresult.quantity = products[i].quantity;
    productsAPI.push(APIresult);
  }
  DisplayCartProducts(productsAPI);
}
/*1- Pour chaque produit contenu dans le panier :
  2- Générer le noeud html nodeCart.
  3- Intégrer les valeurs propres à chaques produit.
  4- Afficher le tout dans l'HTML.
  5- Appeler les fonctions de calcul totaux et de modification/suppression.*/
function DisplayCartProducts(product) {
  product.forEach(products => {

    const nodeCart = `<article class="cart__item" data-id="${products._id}" data-color="${products.color}">
                      <div class="cart__item__img">
                        <a href="product.html?id=${products._id}"><img src="${products.imageUrl}" alt="${products.altTxt}"></a>
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
  TotalQuantityAndPrice();
  InputQuantitytyUpdate();
  DeleteProductInCart();
};
/*1- Initialisation des variable totales quantité et prix à 0.
  2- Condition : si le panier est vide afficher le message "panier vide" sinon :
  3- Boucle parcourant le panier et récupérant l'id de chaque produits.
  4- Ajout de la quantité de chaque produit dans la variable totalQuantity.
  5- Ajout du prix de chaque produit dans la variable totalPrice et multiplication de chaque prix par la quantité de chaque produit.
  6- Affichage des valeurs totales.*/
function TotalQuantityAndPrice() {
  let totalQuantity = 0;
  let totalPrice = 0;
  
  for (let i in cart) {
    let currentIndex = productsAPI.findIndex(product => product._id == cart[i].id);

    totalQuantity += cart[i].quantity;
    totalPrice += cart[i].quantity * productsAPI[currentIndex].price;
  }
  document.querySelector("#totalQuantity").innerHTML = totalQuantity;
  document.querySelector("#totalPrice").innerHTML = totalPrice;
  CartIsEmpty();
}
/*1- Récupération des inputs de quantité et ajout d'un eventListener change.
  2- Récupération du noeud (article) contenant le produit et ses datas id et color.
  3- Comparaison des datas avec le panier.
  4- Restriction de saisie à une valeur comprise entre 1 et 100.
  5- Mis à jour de la quantité avec une valeur comprise entre 1 et 100.
  5- Ajout du tableau panier avec la nouvelle quantité dans le localStorage.
  6- Recalcul des totaux.*/
function InputQuantitytyUpdate() {
  let inputQuantity = document.querySelectorAll(".itemQuantity");

  inputQuantity.forEach((inputQuantity) => {
    inputQuantity.addEventListener("change", (e) => {

      MinMaxValueInput(e.target);

      let article = inputQuantity.closest("article");
      let dataId = article.getAttribute("data-id");
      let dataColor = article.getAttribute("data-color");

      for (let i in cart) {
        if (cart[i].id === dataId && cart[i].color === dataColor) {
          cart[i].quantity = parseInt(e.target.value);
          localStorage.setItem("kanap Order", JSON.stringify(cart));
        }
        TotalQuantityAndPrice();
      }
    })
  })
}
/*1- Compare la valeur en entrée.
  2- Si elle est supérieure à 100, retourner 100.
  3- Si elle est inférieure à 1 retourner 1.
  4- Sinon ne rien faire.
*/
function MinMaxValueInput(input) {
  if (input.value > 100) {
    input.value = 100;

  } else if (input.value < 1) {
   input.value = 1;
  } 
}
/*1- Récupération des boutons "supprimer" et ajout d'une écoute d'evennement clic.
  2- Récupération du noeud (article) contenant le produit et ses datas id et color.
  3- Comparaison des datas avec le tableaux du panier et suppression du produit correspondant dans le tableau.
  4- Mis à jour du tableau de panier dans le localStorage.
  5- Suppression du noeud html.
  6- Recalcul des totaux.*/
function DeleteProductInCart() {
  let inputDelete = document.querySelectorAll(".deleteItem");

  inputDelete.forEach((inputDelete) => {

    inputDelete.addEventListener('click', () => {

      let article = inputDelete.closest("article");
      let dataId = article.getAttribute("data-id");
      let dataColor = article.getAttribute("data-color");
      
      let productIndex = cart.findIndex(element => element.id === dataId && element.color === dataColor);
      cart.splice(productIndex, 1);
      
      if(cart.length == 0) {
        localStorage.removeItem("kanap Order");
        cart = null;
      } else {
        localStorage.setItem("kanap Order", JSON.stringify(cart));
      }
      article.remove();

      TotalQuantityAndPrice();
      CartIsEmpty()
    })
  })
}
function CartIsEmpty() {
  if(cart === null || localStorage.getItem("kanap Order") === null) {
    document.querySelector("h1").innerHTML =
    "Votre panier est vide";
  }
}
/* --------------------------------------------------------------------------------------------------------------
  1- Définition des regEx.
  2- Message d'erreur à afficher.*/
const regexs = {
  firstName:"^[a-zA-ZÀ-ú\\.\\-\\'\\ ]{2,20}$", 
  lastName:"^[a-zA-ZÀ-ú\\.\\-\\'\\ ]{2,20}$", 
  address:"^[0-9a-zA-ZÀ-ú\\.\\-\\'\\ ]{2,50}$", 
  city:"^[a-zA-ZÀ-ú\\.\\-\\'\\ ]{2,50}$", 
  email:"^[0-9a-zA-ZÀ-ú._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
}
const errorsMsg = {
  firstName:"Saisie invalide : Le prénom doit être uniquement composé de lettres", 
  lastName:"Saisie invalide : Le nom doit être uniquement composé de lettres", 
  address:"Saisie invalide : L'adresse ne doit être pas comporter de caractères spéciaux", 
  city:"Saisie invalide : La ville doit être uniquement composée de lettres", 
  email:"Saisie invalide : Le format d'adresse mail n'est pas correct"
}
/*1- Récupération des champs du formulaire
  2- Pour chaque champ de saisie :
  3- Ecouter l'évenement de saisie.
  4- Récupérer le nom de l'input via l'evennement en cours.
  5- Appeler la fonction InputValidityControl.*/
let formInputs = document.querySelectorAll('.cart__order__form__question > input');
formInputs.forEach(input => {
   input.addEventListener('input', (e) => {
    InputValidityControl(document.getElementById(e.currentTarget.name));
   })
})
/*1- Fonction de validation générique
  2- Prendre en paramètres les variables définies précédement.
  3- Si la valeur du champs est valide par rapport à la regEx utilisée :
  4- Ne pas afficher de message d'erreur et attribuer la couleur de texte noire.
  5- Définir la fonction disableSubmit sur false.
  6- Si la valeur du champs n'est pas valide par rapport à la regEx utilisée :
  7- Afficher le message d'erreur et attribuer la couleur de texte rouge.
  8- Définir la fonction disableSubmit sur true.*/
function InputValidityControl(input,) {
  let inputName = input.name;
  let regex = new RegExp(regexs[inputName]);
  let error = document.getElementById(`${inputName}ErrorMsg`)
  let errorMsg = errorsMsg[inputName];

  if (regex.test(input.value)) {
    error.innerHTML = "";
    input.style.color = "black";
    disableSubmit(false);
  } else {
    error.innerHTML = errorMsg;
    input.style.color = "red";
    disableSubmit(true);
  }
}
/*1- Si la valeur de disableSubmit est égale à false :
  2- Ajouter l'attribut disable=true a l'input submit dans l'HTML afin de le rendre inopérant.
  3- Sinon enlever l'attribut disable.*/
function disableSubmit(disabled) {
  if (disabled) {
    document
      .getElementById("order")
      .setAttribute("disabled", true);
  } else {
    document
      .getElementById("order")
      .removeAttribute("disabled");
  }
}
// Création d'un constructeur pour l'objet contact
class Form {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName.value;
    this.lastName = lastName.value;
    this.address = address.value;
    this.city = city.value;
    this.email = email.value;
  }
}
SubmitOrder();
/*1- Récupération du bouton submit et ajout d'un listener au clic.
  2- Appel de la fonction SetDataOrder.*/
function SubmitOrder() {
  let submit = document.getElementById('order');

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    SetDataOrder();
  })
}
/*1- Création de l'object contact.
  2- Création du tableau des ids produits
  3- Pour chaque produit contenu dans le panier, ajpouter son id dans le tableau productsId.*/
function SetDataOrder() {
  let contactForm = new Form(firstName, lastName, address, city, email);
  let productsId = [];

  cart.forEach( product => {
    productsId.push(product.id);
  });

  PostOrder(contactForm, productsId); 
}
/*1- Envoie des infos contact et des id produits à l'API par méthode POST
  2- Récupération de l'id renvoyé par l'API
  3- Redirection vers la page confirmation avec pour paramètre d'URL l'id de la commande.
  4- Nettoyage du localStorage.*/
async function PostOrder(form, order) {
    await fetch("http://localhost:3000/api/products/order" , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON'
        },
        body: JSON.stringify({
          contact: form,
          products: order,
        })
      })
    .then(response => response.json())
    .then(result => window.location.assign(`confirmation.html?id=${result.orderId}`))
    .catch (error => console.log(error))
  localStorage.clear();
}