// Récupération de l'URL de la page et de ses parametres afin de récupérer l'id du produit
let url = new URL(window.location.href);
let productId = url.searchParams.get("id");

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
    document.getElementById('price').innerHTML = kanapInfo.price;
    document.getElementById('description').innerHTML = kanapInfo.description;

    kanapInfo.colors.forEach(
        color => document.getElementById('colors').innerHTML += `<option value="${color}">${color}</option>`
    )
}

/*1- Déclarer la variable cart.
  2- Si l'objet "kanap Order" n'est pas présent dans le localStorage initialiser cart comme étant un tableau vide
  3- Sinon récupérer l'objet "kanap Order" et initialiser cart avec ses valeurs.*/
let cart;

if (localStorage.getItem("kanap Order") === null) {
    cart = new Array();
} else {
    cart = JSON.parse(localStorage.getItem("kanap Order"));
}
AddToCart();
/*1- Ajout d'un eventListener sur le bouton ajouter au panier.
  2- Récupération de la couleur et de la quantité sélectionnée et initialisation de la variable IsInCart à false.
  3- Création d'une constante kanap avec pour clés id, color et quantity.
  4- Pour chaque produit du panier, comparer la couleur et l'id :
  5- Si le produit est déjà présent dans le panier, incrémenter la quantité et initialiser IsInCart à true.
  6- Si isInCart=false, ajouter le nouveau produit au panier.
  7- Enfin ajouter le panier au localStorage.*/
function AddToCart(){
    document.getElementById('addToCart').addEventListener('click', (e) => {
        let selectedColor = document.getElementById("colors");
        let productColor = selectedColor.options[selectedColor.selectedIndex].text;
        let productQuantity = Number(document.getElementById("quantity").value);
        let isInCart = false;

        MinMaxValueInput(e);
        const kanap = {id: productId, color: productColor,quantity: productQuantity};

        cart.forEach(cartProduct => {
            if (productId == cartProduct.id && productColor == cartProduct.color) {
                cartProduct.quantity = productQuantity + Number(cartProduct.quantity);
                isInCart = true;
            } 
        });

        if (isInCart == false) {
            cart.push(kanap);
        }
        localStorage.setItem("kanap Order", JSON.stringify(cart));
    })
}
// Appel de la fonction MinMaxValueInput sur le champ quantity pour éviter la saisie de valeur indésirables.
document.getElementById('quantity').addEventListener("input", (e) => {
    MinMaxValueInput(e.target);
});
/*1- Compare la valeur en entrée.
  2- Si elle est supérieure à 100, retourner 100.
  3- Si elle est inférieure à 1 retourner 1.
  4- Sinon ne rien faire.*/
function MinMaxValueInput(input) {
    if (input.value > 100) {
        input.value = 100;
        
    } else if (input.value < 1) {
        input.value = 1;
    } 
}


