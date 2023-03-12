function setCookie(name, val, expireTime) { // timp expirare est in milisecunde 
    // aici se face setarea cookie-ului
    d = new Date();
    d.setTime(d.getTime()+expireTime)
    document.cookie = `${name}=${val}; expires=${d.toUTCString()}`;
}

function getCookie(name) {
    vectParam = document.cookie.split(";") // a=10 b=orice
    for(let param of vectParam) {
        // trim elimina blank-urile de dinainte si de dupa string
        if(param.trim().startsWith(name+"=")) // ca sa fim siguri ca acesta e numele parametrului
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(name) { // de ce se sterge ? data de expirare
    document.cookie = `${name}=0; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    // cand se incarca pagina vedem daca exista cookie-ul
    if(getCookie("accept_banner")) {
        document.getElementById("banner").style.display = "none";
    }

    // butonul asta in momentul in care apas pe el sa mi seteze un cookie "accept banner"
    // si daca acel cookie exista sa nu afisam tot banner-ul
    this.document.getElementById("ok_cookies").onclick = function() {
        setCookie("accept_banner", true, 60000);
        document.getElementById("banner").style.display = "none"; // aici dispare
    }
})
// sunt folosite sa memoreze informatii despre user
function deleteAllCookies() { 
    var Cookies = document.cookie.split(';');
    for (var i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();
    }
}

// set - document.coo - get - delete/all 