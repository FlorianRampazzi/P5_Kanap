let url = new URL(window.location.href);
let orderId = url.searchParams.get("id");

document.getElementById('orderId').innerHTML = orderId;