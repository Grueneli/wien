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

// Hintergrundlayer, leaftlet Provider
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map), // ad to map sagt, welcher Layer der Standardlayer ist
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
}).addTo(map);

// Marker Stephansdom
L.marker([
    stephansdom.lat, stephansdom.lng
]).addTo(map).bindPopup(stephansdom.title).openPopup(); // hier soll der Marker mit bestm. lat und lng angezeigt werden und als titel stephansdom auf popen (openPopup)

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Geo Json Daten in die Karte einbinden
//Vienna Sightseeing Haltestellen
async function showStops (url){
    let response = await fetch (url);
    let jsondata = await response.json();
    L.geoJSON(jsondata).addTo(map);
  console.log(response, jsondata) 
} // Funktion musst erst definiert werden, bevor sie angezeigt werden kann
showStops ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json");
//Vienna Sightseeing Linien
showStops ("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")

