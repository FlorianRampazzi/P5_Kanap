DisplayOrderID();
/* 1- Récupère l'URL de la page actuelle
   2- Récpère l'id contenu dans l'URL
   3- Affiche l'id correspondant au numéro de commande dans l'HTML*/
function DisplayOrderID() {
    let url = new URL(window.location.href);
    let orderId = url.searchParams.get("id");

    document.getElementById('orderId').innerHTML = orderId;
}
   