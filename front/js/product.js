// Récupération de l'URL de la page et de ses parametres afin de récupérer l'id du produit
let url = new URL(window.location.href);
let productId = url.searchParams.get("id");
let productName;
let cart;

/*1- Interroger l'API par l'id du produit à afficher présent dans l'URL de la page.
  2- Récupérer les données correspondantes au format JSON et les convertir en objet JavaScript.
  3- Appeler la fonction DisplayKanapInfo*/
fetch(`http://localhost:3000/api/products/${productId}`)
        .then(response => response.json())
        .then(resultKanap => DisplayKanapInfo(resultKanap))
        .catch(error => console.log(error))
/*1- Afficher dans l'HTML les informations concernant le produit
  2- Pour chaque couleur de produit, injecter une balise option correspondant à la couleur*/
function DisplayKanapInfo(kanapInfo) {
    document.querySelector('.item__img').innerHTML = `<img src="${kanapInfo.imageUrl}" alt="${kanapInfo.altTxt}"></img>`;
    document.getElementById('title').innerHTML = kanapInfo.name;
    document.querySelector('title').innerHTML = kanapInfo.name;
    productName = kanapInfo.name;
    document.getElementById('price').innerHTML = kanapInfo.price;
    document.getElementById('description').innerHTML = kanapInfo.description;
    kanapInfo.colors.forEach(
        color => document.getElementById('colors').innerHTML += `<option value="${color}">${color}</option>`
    )
    MinMaxValueInput()
    CartAlreadyExist()
    SetProductData()
}

/*2- Si l'objet "kanap Order" n'est pas présent dans le localStorage initialiser cart comme étant un tableau vide
  3- Sinon récupérer l'objet "kanap Order" et initialiser cart avec ses valeurs.*/
function CartAlreadyExist() {
    if (localStorage.getItem("kanap Order") === null) {
        cart = new Array();
    } else {
        cart = JSON.parse(localStorage.getItem("kanap Order"));
    }
}
/*1- Ajout d'un eventListener sur le bouton ajouter au panier.
  2- Récupération de la couleur et de la quantité sélectionnée.
  3- Appel de la fonction VerifyProductSelect.*/
function SetProductData() {
    document.getElementById('addToCart').addEventListener('click', (e) => {
        e.preventDefault();
        let selectedColor = document.getElementById("colors");
        let productColor = selectedColor.options[selectedColor.selectedIndex].text;
        let productQuantity = Number(document.getElementById("quantity").value);
      
        VerifyProductSelect(productColor, productQuantity)
    })
}
/*1- Si le panier est vide, afficher l'alerte correspondante et empêcher l'envoi de la commande
  2- Si le formulaire est vide, afficher l'alerte correspondante et empêcher l'envoi de la commande
  3- Autoriser l'envoie de la commande.*/
function VerifyProductSelect(productColor, productQuantity) {
    if(productColor === '--SVP, choisissez une couleur --'){
        alert('Veuillez sélectionner une couleur')
    } else if (productQuantity === 0){
        alert('Veuillez renseigner une quantité')
    } else {
        AddToCart(productColor, productQuantity);
    }
}
/*1- Compare la valeur en entrée sur le champs quantité.
  2- Si elle est supérieure à 100, retourner 100.
  3- Si elle est inférieure à 1 retourner 1.
  4- Sinon ne rien faire.*/
function MinMaxValueInput() {
  document.getElementById('quantity').addEventListener("input", (e) => {
      if (e.target.value > 100) {
          e.target.value = 100;
      } else if (e.target.value < 1) {
          e.target.value = 1;
      } 
  });
}
/*1- Création d'une constante kanap avec pour clés id, color et quantity.
  2- Pour chaque produit du panier, comparer la couleur et l'id :
  3- Si le produit est déjà présent dans le panier, incrémenter la quantité et initialiser IsInCart à true.
  4- Si isInCart=false, ajouter le nouveau produit au panier.
  5- Enfin ajouter le panier au localStorage.*/
function AddToCart(color, quantity){   
        let isInCart = false;
        const kanap = {id: productId, color: color, quantity: quantity};

        cart.forEach(cartProduct => {
            if (productId == cartProduct.id && color == cartProduct.color) {
                cartProduct.quantity = quantity + Number(cartProduct.quantity);
                isInCart = true;
            } 
        });

        if (isInCart == false) {
            cart.push(kanap);
        }
        localStorage.setItem("kanap Order", JSON.stringify(cart));
        alert(`${productName} à bien été ajouté au panier`)
}



