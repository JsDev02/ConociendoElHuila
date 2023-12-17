var map = L.map('map').setView([2.4419653782340154, -75.61161644762937], 8);
//Capas base
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});
//Fin de capas base

//Mini mapa
var miniMapLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 0, maxZoom: 13, attribution: '© OpenStreetMap contributors'
});
var miniMap = new L.Control.MiniMap(miniMapLayer).addTo(map);
//Fin mini mapa

//capas activables
var huilatiff = L.tileLayer.wms("http://localhost:8088/geoserver/wms", {
    layers: 'proyecto-final:huila-tiff',
    format: 'image/png',
    transparent: true,
    tiled: true,
    attribution: "Natural Earth"
});
var lugares = L.geoJSON([], {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function (feature, layer) {
        layer.on({
            mouseover: highlightFeatureLugares,
            mouseout: resetHighlightLugares,
            click: function (event) {
                map.setView(event.latlng, 10);
                // Extract properties
                var rating = feature.properties.rating || 'Sin datos';
                var name = feature.properties.name || 'Sin datos';
                var category = feature.properties.category || 'Sin datos';

                // Create and bind popup content
                var popupContent = '<img src="img/san_agustin.jpg" alt="San Agustin Image"><br>' +
                    '<b>Nombre:</b> ' + name + '<br>' +
                    '<b>Categoria:</b> ' + category + '<br>' +
                    '<b>Rating:</b> ' + rating + '<br>' +
                    '<button onclick="ActivarFormulario(\'' + name + '\', ' + JSON.stringify(feature.geometry.coordinates) + ')">Reservar</button>';

                // Open popup at the clicked point
                layer.bindPopup(popupContent).openPopup();
            }
        });
    }
});
var sectores = L.geoJSON([], {
    style: function (feature) {
        return {
            fillColor: 'red',
            fillOpacity: 0.5,
            color: 'red',
        };
    },
    onEachFeature: function (feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
        // Agregar popup al hacer clic en el polígono
        layer.on('click', function (e) {
            var popupContent = `Codigo: ${feature.properties.codigo.slice(0, 5)}`;
            L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);
        });
    }
});
//Fin de capas activables

//AJAX
$.ajax({//lugares
    url: 'http://localhost:8088/geoserver/proyecto-final/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&' +
        'typename=proyecto-final:lugares&' +
        'outputFormat=application/json&srsname=EPSG:4326',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        lugares.addData(data);
    },
    error: function (error) {
        console.error('Error en la petición WFS para lugares:', error);
    }
});
$.ajax({//sectores
    url: 'http://localhost:8088/geoserver/proyecto-final/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&' +
        'typename=proyecto-final:sectores&' +
        'outputFormat=application/json&srsname=EPSG:4326&',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        sectores.addData(data);
    },
    error: function (error) {
        console.error('Error en la petición WFS para departamentos:', error);
    }
});
//Fin AJAX

//Escala
L.control.scale().addTo(map);
//fin de escala

//control de capas
var baseMaps = {
    "OpenStreetMap": osmLayer,
    "Google Satélite": googleSat
};
var overlayMaps = {
    "Imagen satelital": huilatiff,
    "Sectores": sectores,
    "Sitios turísticos": lugares
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
//Fin de control de capas

// Control de búsqueda
var searchControl = new L.Control.Search({
    layer: lugares,
    propertyName: 'name',
    circleLocation: false
}).addTo(map);
map.on('overlayadd', function (eventLayer) {
    if (eventLayer.name === 'Sitios turísticos') {
        searchControl._container.style.display = 'block';
    }
});
map.on('overlayremove', function (eventLayer) {
    if (eventLayer.name === 'Sitios turísticos') {
        searchControl._container.style.display = 'none';
    }
});

// Eventos
searchControl.on('search:locationfound', function (event) {
    var feature = event.layer.feature;
    map.setView(event.latlng, 10);
    // Extract properties
    var rating = feature.properties.rating || 'Sin datos';
    var name = feature.properties.name || 'Sin datos';
    var category = feature.properties.category || 'Sin datos';

    // Create and bind popup content
    var popupContent = '<img src="img/san_agustin.jpg" alt="San Agustin Image"><br>' +
        '<b>Nombre:</b> ' + name + '<br>' +
        '<b>Categoria:</b> ' + category + '<br>' +
        '<b>Rating:</b> ' + rating + '<br>' +
        '<button onclick="ActivarFormulario(\'' + name + '\', ' + JSON.stringify(feature.geometry.coordinates) + ')">Reservar</button>';

    // Open popup at the found location
    event.layer.bindPopup(popupContent).openPopup();
});
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: 'blue',
        fillColor: 'lightgray'
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlight(e) {
    sectores.resetStyle(e.target);
}
function highlightFeatureLugares(e) {
    var layer = e.target;
    layer.setStyle({
        fillColor: "#ff0000",
        color: "#000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
    });
}
function resetHighlightLugares(e) {
    lugares.resetStyle(e.target);
}
var geomValue = 0;
function ActivarFormulario(name, geometry) {
    document.getElementById('nombreLugar').value = name;
    geomValue = geometry;
    $("#nombrePersona").prop("disabled", false);
    $("#telefono").prop("disabled", false);
    $("#correo").prop("disabled", false);
}
function reservar() {
    var nombreLugar = document.getElementById('nombreLugar').value;
    var nombrePersona = document.getElementById('nombrePersona').value;
    var telefono = document.getElementById('telefono').value;
    var correo = document.getElementById('correo').value;

    if (nombreLugar.trim() === "") {
        alert('Primero debe seleccionar un lugar');
        return;
    }

    if (nombrePersona.trim() === "" || telefono.trim() === "" || correo.trim() === "") {
        alert('Por favor, complete todos los campos.');
        return;
    }

    $.ajax({
        type: 'POST',
        url: 'php/guardarDatos.php',
        data: {
            nombreP: nombrePersona,
            telefonoP: telefono,
            correoP: correo,
            nombrelugar: nombreLugar,
            geomLugar: JSON.stringify(geomValue)
        },
        success: function (response) {
            alert('Información enviada');
            location.reload(); // Recargar la página después de enviar la información con éxito
        },
        error: function (error) {
            console.error('Error al enviar datos al servidor:', error);
        }
    });
}

// ... (tu código existente)

// Agregar leyenda a la izquierda del mapa
var legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<p><strong>Satélite</strong>: Imagen del huila vista desde un satélites</p>';
    div.innerHTML += '<p><strong>Sectores</strong>: Sectores rurales del huila</p>';
    div.innerHTML += '<p><strong>Turismo</strong>: Sitios turísticos del huila</p>';
    // Puedes agregar más capas y descripciones según sea necesario

    return div;
};

legend.addTo(map);

// Estilos CSS para la leyenda
var legendStyle = document.createElement('style');
legendStyle.textContent = `
    .info.legend {
        font-size: 12px;
        line-height: 1;
    }

    .info.legend h5 {
        margin-bottom: 3px;
    }
`;

document.head.appendChild(legendStyle);

// Fin del script
