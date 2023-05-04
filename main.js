/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt, Variabel Definition => dann kann ich später die variabel abrufen
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118, // wichtig getrennt durch Kommas 
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map('map').setView([
    stephansdom.lat, stephansdom.lng
], 15);
map.addControl(new L.Control.Fullscreen())

//thematische Layer
let themaLayer = {
    stops: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    sites: L.featureGroup().addTo(map),
    hotels: L.featureGroup().addTo(map)
}

// Hintergrundlayer, leaftlet Provider
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map), // ad to map sagt, welcher Layer der Standardlayer ist
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
}, {
//checkbox ein-/ausschalten der Layer
"Wien Sehenswürdigkeiten Haltestellen": themaLayer.stops,
"Wien Sehenswürdigkeiten Linien": themaLayer.lines,
"Fußgängerzonen Wien": themaLayer.zones,
"Sehenswürdigkeiten Wien": themaLayer.sites,
"Hotels in Wien": themaLayer.hotels,
}).addTo(map);

// Marker Stephansdom
/*L.marker([
    stephansdom.lat, stephansdom.lng
]).addTo(map).bindPopup(stephansdom.title).openPopup(); // hier soll der Marker mit bestm. lat und lng angezeigt werden und als titel stephansdom auf popen (openPopup)
*/
// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Geo Json Daten in die Karte einbinden
//Vienna Sightseeing Haltestellen

async function showStops (url){ 
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            //console.log(feature.properties)
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
                    iconSize: [32, 37],
                    iconAnchor: [16, 37], //beschreibt die Position von der Ecke des popups
                    popupAnchor: [0, -37] //popup Anchor bedeutet, wo der Popup dann aufgemacht wird
                }),      
            });
        },
    
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
                <h4><i class="fa-solid fa-bus"></i> ${prop.LINE_NAME} </h4>
                <p>${prop.STAT_NAME}</p>
                `);
            //console.log(prop);
        }
    }).addTo(themaLayer.stops);

     // console.log(response, jsondata) 
} 
async function showLines (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    let lineNames = {}; //geschwungene Klammern = Objekt
    let lineColors = { // website für die Farben: https://clrs.cc/
        "1": "#FF4136", //red
        "2": "#FFDC00",//yellow
        "3": "#0074D9",//blue
        "4": "#2ECC40",//green
        "5": "#AAAAAA",//grey
        "6": "#FF851B"//orange
    }
      
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {
                color: lineColors[feature.properties.LINE_ID],
                weight: 3, //dicke
                dashArray: [10,6] //gestrichelte Linie : 10 Einheiten Strich, 6 kein Strich
            };
        },
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
                <h3><i class="fa-solid fa-bus"></i> ${prop.LINE_NAME} </h3 >
                <p><i class="fa-regular fa-circle-stop"> </i>${prop.FROM_NAME}</p>
                <p><i class="fa-solid fa-down-long"></i></p>
                <p><i class="fa-regular fa-circle-stop"> </i></i>${prop.TO_NAME}</p>
                `);
                lineNames[prop.LINE_ID] = prop.LINE_NAME;
              //  console.log(lineNames)
           // console.log(prop);
        }
    }).addTo(themaLayer.lines);
   // L.geoJSON(jsondata).addTo(themaLayer.lines);
};

 // console.log(response, jsondata) 

// https://mapicons.mapsmarker.com/ => icon runterladen und in den Projektordner abspeichern

async function showSights (url){ 
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            //console.log(feature.properties)
            return L.marker(latlng, {
                icon: L.icon({
                   iconUrl: 'icons/photo.png',
                    iconSize: [32, 37],
                    iconAnchor: [16, 37], //beschreibt die Position von der Ecke des popups
                    popupAnchor: [0, -37] //popup Anchor bedeutet, wo der Popup dann aufgemacht wird
                }),      
            });
        },
    
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
                <h4><i class="fa-solid fa-bus"></i> ${prop.LINE_NAME} </h4>
                <p>${prop.STAT_NAME}</p>
                `);
            //console.log(prop);
        }
    }).addTo(themaLayer.sites);

     // console.log(response, jsondata) 
} 
async function showZones (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        style: function (feature) {
            return {
                color: "#F012BE", 
                opacity: 0.4, //dicke
                fillOpacity: 0.1,
                weight: 1
            };
        },
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4> Fußgängerzone ${prop.ADRESSE}</address></h4>
            <p> <i class="fa-regular fa-clock"></i> ${prop.ZEITRAUM || "dauerhaft"}</p>
            <p> <i class="fa-solid fa-circle-info"></i>${prop.AUSN_TEXT || "keine Ausnahmen"} </p>
            `);
            //console.log(prop)
        }
    }
        
        
        ).addTo(themaLayer.zones);
 // console.log(response, jsondata) 
} 

//hotels
async function showHotels(url) {
    let response = await fetch (url);
    let jsondata = await response.json ();
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
             if (feature.properties.KATEGORIE_TXT === "1*") {
                icon = "icons/hotel_1star.png"
            } else if (feature.properties.KATEGORIE_TXT === "2*") {
                icon = "icons/hotel_2stars.png"
            } else if (feature.properties.KATEGORIE_TXT === "3*") {
                icon = "icons/hotel_3stars.png"
            } else if (feature.properties.KATEGORIE_TXT === "4*") {
                icon = "icons/hotel_4stars.png"
            } else if (feature.properties.KATEGORIE_TXT === "5*") {
                icon = "icons/hotel_5stars.png"
            } else {
                icon = "icons/hotel_0star.png"
            }

            return L.marker (latlng, {
                icon: L.icon ({
                    iconUrl: icon,
                    iconSize: [32, 37],
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup (`
            <h3> ${prop.BETRIEB}</h3>
            <h4> ${prop.BETRIEBSART_TXT} ${prop.KATEGORIE_TXT} </4>
            <hr>
            Adresse: ${prop.ADRESSE}<br>
            Tel. <a href="tel:${prop.KONTAKT_TEL}">${prop.KONTAKT_TEL}</a><br>
            E-Mail: <a href="mailto:${prop.KONTAKT_EMAIL}" target="Wien">${prop.KONTAKT_EMAIL}</a><br>
            Web: <a href="${prop.WEBLINK1}" target="Wien">${prop.WEBLINK1}</a>
            `)
        }
    }).addTo(themaLayer.hotels);
}

    //variabel definieren icon. else if: 1*, 2* etc. 
    // if (prop.KATEGORIE_TXT == "3*")
   //  if else

//hr = horizontale Linie


//mit addTo(themaLayer.zones) wird der Thema Layer zones mit der Checkbox verknüpft, so dass man s ein ausschalten kann
// mit addTo(map) wirds einfach nur der Karte hinzugefügt

// Funktion musst erst definiert werden, bevor sie angezeigt werden kann
showStops ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
showSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
showHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")
// lokal eingebunden reicht es den Dateinamen einzugeben

/*
let kondlFarb = {
    laura: "white",
    sebastian: "blue",
    mirjam: "beige"
}
kondlFarb.["mirjam"]
kondlFarb.mirjam

let kondlFarben = [
    {
        "laura": "white",
        "size": "large"
    },
    {
        "sebastian": "blue"
    }
]
 kondlFarben[1]["sebastian"]
oder: kondlFarben[1].sebastian

*/
