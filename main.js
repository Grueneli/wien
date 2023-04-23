/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt, Variabel Definition => dann kann ich später die variabel abrufen
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118, // wichtig getrennt durch Kommas 
    title: "Stephansdom"
};

// Karte initialisieren
let map = L.map("map").setView([
    stephansdom.lat, stephansdom.lng
], 12);

//thematische Layer
let themaLayer = {
    stops: L.featureGroup(),
    lines: L.featureGroup(),
    zones: L.featureGroup(),
    sites: L.featureGroup().addTo(map)
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
"Sehenswürdigkeiten Wien": themaLayer.sites
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
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
                <h3><i class="fa-solid fa-bus"></i> ${prop.LINE_NAME} </h3>
                <p>${prop.STAT_NAME}</p>
                `);
            console.log(prop);
        }
    }).addTo(themaLayer.stops);

     // console.log(response, jsondata) 
} 
async function showLines (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
                <h3><i class="fa-solid fa-bus"></i> ${prop.LINE_NAME} </h3 >
                <p><i class="fa-solid fa-circle-h"> </i>${prop.FROM_NAME}</p>
                <p><i class="fa-light fa-arrow-down"></i></p>
                <p><i class="fa-solid fa-circle-h"> </i></i>${prop.TO_NAME}</p>
                `);
            console.log(prop);
        }
    }).addTo(themaLayer.lines);
   // L.geoJSON(jsondata).addTo(themaLayer.lines);
};

 // console.log(response, jsondata) 

async function showSights (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        onEachFeature: function (feature, layer){ //mit onEachFuture soll auf alle zugegriffen werden, was in diesem Feature drinnen ist. z.b. eben Namen
           let prop = feature.properties; //Variabel properties benannt, damits kürzer is
           layer.bindPopup(`
           <img src="${prop.THUMBNAIL}" alt="*">  
            <h4><a href="${prop.WEITERE_INF}"target="Wien">${prop.NAME}</a></h4>
            <address>${prop.ADRESSE}</address>
            `);
           // console.log(prop);//bräucht ich jetzt nicht mehr
        } //THUMBNAIL: Foto, WEITERE_INF: Link (href) mit weiteren Infos, target=Wien: Neues Fenster geht auf, das Wien heißt, es geht aber nie mehr als eins auf
    }).addTo(themaLayer.sites);
 // console.log(response, jsondata) 
} 
async function showZones (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata, {
        onEachFeature: function (feature, layer){
            let prop = feature.properties;
            layer.bindPopup(`
            <h4> Fußgängerzone ${prop.ADRESSE}</address></h4>
            <p> <i class="fa-sharp fa-light fa-clock"></i> ${prop.ZEITRAUM}</p>
            <p> <i class="fa-sharp fa-light fa-circle-info"></i>${prop.AUSN_TEXT} </p>
            `)
            console.log(prop)
        }
    }
        
        
        ).addTo(themaLayer.zones);
 // console.log(response, jsondata) 
} 

//mit addTo(themaLayer.zones) wird der Thema Layer zones mit der Checkbox verknüpft, so dass man s ein ausschalten kann
// mit addTo(map) wirds einfach nur der Karte hinzugefügt

// Funktion musst erst definiert werden, bevor sie angezeigt werden kann
showStops ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
showLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
showSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
showZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
// lokal eingebunden reicht es den Dateinamen einzugeben

