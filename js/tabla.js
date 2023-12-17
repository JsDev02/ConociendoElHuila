// Utilizando JavaScript para hacer una solicitud asíncrona al servidor (AJAX)
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("reportTable").innerHTML = this.responseText;
    }
};
xhttp.open("GET", "php/tabla.php", true);
xhttp.send();
