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
  try {
    for (let i in products) {
      let APIproduct;

      await fetch(`http://localhost:3000/api/products/`+ products[i].id)
          .then(ResAPI => ResAPI.json())
          .then(data => (APIproduct = data))
          .catch(error => console.log(error))

      APIproduct.color = products[i].color;
      APIproduct.quantity = products[i].quantity;
      productsAPI.push(APIproduct);
    }

    DisplayCartProducts();

  } catch(error) {
    console.log(error);
  } 
}
/*1- Pour chaque produit contenu dans le panier :
  2- Générer le noeud html nodeCart.
  3- Intégrer les valeurs propres à chaques produit.
  4- Afficher le tout dans l'HTML.
  5- Appeler les fonctions de calcul totaux et de modification/suppression.*/
function DisplayCartProducts() {
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
  TotalQuantityAndPrice();
  InputQuantitytyUpdate();
  DeleteProductInCart();
};
/*1- Initialisation des variable totales quantité et prix à 0.
  2- Boucle parcourant le panier et récupérant l'id de chaque produits.
  3- Ajout de la quantité de chaque produit dans la variable totalQuantity.
  4- Ajout du prix de chaque produit dans la variable totalPrice et multiplication de chaque prix par la quantité de chaque produit.
  5- Affichage des valeurs totales.*/
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
        TotalQuantityAndPrice();
      }
    })
  })
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
      
      localStorage.setItem("kanap Order", JSON.stringify(cart));
      article.remove();

      TotalQuantityAndPrice();
    })
  })
}
/* --------------------------------------------------------------------------------------------------------------
  1- Récupération des saisie dans les champs du formulaire.
  2- Définition des regEx.
  3- Récupération de la balise pour l'affichage du message d'erreur.
  4- Message d'erreur à afficher.*/
//FIRST NAME INPUT
let firstName = document.getElementById('firstName');
let NameRegex = /^[^\n0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,20}$/;
let firstNameError = document.getElementById('firstNameErrorMsg');
let firstNameErrorMsg = "Saisie invalide : Le prénom doit être uniquement composé de lettres";
//LAST NAME INPUT
let lastName = document.getElementById('lastName');
let lastNameError = document.getElementById('lastNameErrorMsg');
let lastNameErrorMsg = "Saisie invalide : Le nom doit être uniquement composé de lettres";
//ADDRESS INPUT
let address = document.getElementById('address');
let addressRegex = /^[^\n_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,50}$/;
let addressError = document.getElementById('addressErrorMsg');
let addressErrorMsg = "Saisie invalide : L'adresse ne doit être pas comporter de caractères spéciaux";
//CITY INPUT
let city = document.getElementById('city');
let cityRegex = /^[^\n0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,50}$/;
let cityError = document.getElementById('cityErrorMsg');
let cityErrorMsg = "Saisie invalide : La ville doit être uniquement composée de lettres";
//EMAIL INPUT
let email = document.getElementById('email');
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let emailError = document.getElementById('emailErrorMsg');
let emailErrorMsg = "Saisie invalide : Le format d'adresse mail n'est pas correct";

FormControl();
/*1- Récupération des champs du formulaire
  2- Pour chaque champ de saisie :
  3- Ecouter l'évenement de saisie.
  4- Récupérer le nom de l'input.
  5- Comparer le nom de l'input avec la liste des cas et appeler la fonction correspondante.*/
function FormControl() {
  let allInputs = document.querySelectorAll('.cart__order__form__question > input')
  allInputs.forEach(input => {
    input.addEventListener('input', () => {

     let inputName = input.getAttribute('name');
      switch (inputName) {
        case 'firstName':
          InputValidityControl(firstName, NameRegex, firstNameError, firstNameErrorMsg);
        case 'lastName':
          InputValidityControl(lastName, NameRegex, lastNameError, lastNameErrorMsg);
        case 'address':
          InputValidityControl(address, addressRegex, addressError, addressErrorMsg);
        case 'city':
          InputValidityControl(city, cityRegex, cityError, cityErrorMsg);
        case 'email':
          InputValidityControl(email, emailRegex, emailError, emailErrorMsg);
        break;
        default:
          console.log('Empty action received.');
      }
    });
  })
}
/*1- Fonction de validation générique
  2- Prendre en paramètres les variables définies précédement.
  3- Si la valeur du champs est valide par rapport à la regEx utilisée :
  4- Ne pas afficher de message d'erreur et attribuer la couleur de texte noire.
  5- Définir la fonction disableSubmit sur false.
  6- Si la valeur du champs n'est pas valide par rapport à la regEx utilisée :
  7- Afficher le message d'erreur et attribuer la couleur de texte rouge.
  8- Définir la fonction disableSubmit sur true.*/
function InputValidityControl(input, regex, error, errorMsg) {
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
  2- Appel de la fonction SetDataOrder.
  3- Nettoyage du localStorage.*/
function SubmitOrder() {
  let submit = document.getElementById('order');

  submit.addEventListener('click', (e) => {
    e.preventDefault();
    SetDataOrder();
    // localStorage.clear();
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
  3- Redirection vers la page confirmation avec pour paramètre d'URL l'id de la commande.*/
async function PostOrder(form, order) {
  try {
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
    .then(result =>  window.location.assign(`confirmation.html?id=${result.orderId}`))
  } catch (error) {
    console.log(error);
  }
}