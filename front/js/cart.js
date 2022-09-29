let cart = JSON.parse(localStorage.getItem("kanap Order"));

let totalQuantity = 0;
let totalPrice = 0;

cart.forEach(cartProduct => {
    
    fetch(`http://localhost:3000/api/products/${cartProduct.id}`)
        .then(cartProductRes => cartProductRes.json())
        .then(productAPI => displayOneProduct(productAPI, cartProduct))
        .catch(error => error.console.log("Erreur de récupération de l'API produits"))
    
});
    
const displayOneProduct = (productAPI, cartProduct) => {
    // Calcul du prix total
    let productsPrice = productAPI.price * cartProduct.quantity;
    totalPrice += productsPrice;
    //Calcul de la quantité totale
    totalQuantity += cartProduct.quantity;
    // Affichage d'un produit du panier
    const nodeCart = `<article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
                        <div class="cart__item__img">
                          <img src="${productAPI.imageUrl}" alt="${productAPI.altTxt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${productAPI.name}</h2>
                            <p>${cartProduct.color}</p>
                            
                            <p>Prix unitaire : ${productAPI.price} €</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : </p>
                              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartProduct.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                              <p class="deleteItem">Supprimer</p>
                            </div>
                          </div>
                        </div>
                      </article>`;

    document.getElementById('cart__items').innerHTML += nodeCart;
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;
};



