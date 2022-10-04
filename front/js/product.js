let url = new URL(window.location.href);
let productId = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${productId}`)
    .then(kanapInfoRes => kanapInfoRes.json())
    .then(kanapInfo => displayKanapInfo(kanapInfo))
    .catch(error => error.console.log("Erreur de récupération de l'API produits"))

// Affichage des informations d'un canapé
const displayKanapInfo = (kanapInfo) => {
    document.getElementsByClassName('item__img')[0].innerHTML = `<img src="${kanapInfo.imageUrl}" alt="${kanapInfo.altTxt}"></img>`;
    document.getElementById('title').innerHTML = kanapInfo.name;
    document.getElementById('price').innerHTML = kanapInfo.price;
    document.getElementById('description').innerHTML = kanapInfo.description;

    // Parcours du Array color et affichage de chacune
    kanapInfo.colors.forEach(
        color => document.getElementById('colors').innerHTML += `<option value="${color}">${color}</option>`
    )
}

let cart;

if (localStorage.getItem("kanap Order") == null) {
    cart = new Array();
} else {
    cart = JSON.parse(localStorage.getItem("kanap Order"));
}

document.getElementById('addToCart').addEventListener ('click', () => {
    let selectedColor = document.getElementById("colors");
    let productColor = selectedColor.options[selectedColor.selectedIndex].text;
    let productQuantity = Number(document.getElementById("quantity").value);
    let isInCart = false;
    
    const kanap = {
        id: productId,
        color: productColor,
        quantity: productQuantity
    };

    cart.forEach(cartProduct => {
        if (compareKanap(productId, cartProduct, productColor)) {
            cartProduct.quantity = productQuantity + Number(cartProduct.quantity);
            isInCart = true;
        } 
    });

    if (isInCart == false) {
        cart.push(kanap);
    }

    // cart.forEach(cartProduct => {
    //     if (productId == cartProduct[0] && productColor == cartProduct[1]) {
    //         cartProduct[2] = productQuantity + Number(cartProduct[2]);
    //         isInCart = true;
    //     } 
    // });

    // if (isInCart == false) {
    //     cart.push([`${productId}`,`${productColor}`,`${productQuantity}`]);
    // }      

    localStorage.setItem("kanap Order", JSON.stringify(cart));
});

function compareKanap(productId, kanap, productColor){
    return productId == kanap.id && productColor == kanap.color
}


