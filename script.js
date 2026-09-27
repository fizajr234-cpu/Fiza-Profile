// ======================================================
// ♡ PAKISTAN INTERACTIVE WEB GIS ♡
// ======================================================


// ------------------------------------------------------
// 1. CREATE MAP
// ------------------------------------------------------

var map = L.map('map').setView([30.3753, 69.3451], 5);


// ------------------------------------------------------
// 2. OPENSTREETMAP BASEMAP
// ------------------------------------------------------

var osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap contributors'
    }
);


// ------------------------------------------------------
// 3. SATELLITE BASEMAP
// ------------------------------------------------------

var satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        attribution: 'Tiles &copy; Esri'
    }
);


// ------------------------------------------------------
// 4. ADD DEFAULT BASEMAP
// ------------------------------------------------------

osm.addTo(map);


// ------------------------------------------------------
// 5. CREATE LAYER GROUPS
// ------------------------------------------------------

var cityLayer = L.layerGroup();

var weatherLayer = L.layerGroup();


// ------------------------------------------------------
// 6. CITY MARKER STYLE
// ------------------------------------------------------

function cityStyle(feature, latlng) {

    return L.circleMarker(latlng, {

        radius: 9,

        fillColor: "#e75480",

        color: "#ffffff",

        weight: 3,

        opacity: 1,

        fillOpacity: 0.9

    });
}


// ------------------------------------------------------
// 7. WEATHER STATION MARKER STYLE
// ------------------------------------------------------

function weatherStyle(feature, latlng) {

    return L.circleMarker(latlng, {

        radius: 8,

        fillColor: "#c23b70",

        color: "#ffffff",

        weight: 3,

        opacity: 1,

        fillOpacity: 0.9

    });
}


// ------------------------------------------------------
// 8. LOAD GEOJSON
// ------------------------------------------------------

fetch("pakistan.geojson")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "GeoJSON file could not be loaded."
            );

        }

        return response.json();

    })

    .then(function(data) {


        // ------------------------------------------------
        // CITY FEATURES
        // ------------------------------------------------

        var cities = {

            type: "FeatureCollection",

            features: data.features.filter(
                function(feature) {

                    return feature.properties.layer === "city";

                }
            )

        };


        // ------------------------------------------------
        // WEATHER FEATURES
        // ------------------------------------------------

        var weatherStations = {

            type: "FeatureCollection",

            features: data.features.filter(
                function(feature) {

                    return feature.properties.layer === "weather";

                }
            )

        };


        // ------------------------------------------------
        // ADD CITIES
        // ------------------------------------------------

        L.geoJSON(cities, {

            pointToLayer: cityStyle,

            onEachFeature: function(feature, layer) {

                var p = feature.properties;

                var popupContent =

                    "<div class='popup-title'>" +

                    p.name +

                    "</div>" +

                    "<b class='popup-label'>♡ Province:</b> " +

                    p.province +

                    "<br>" +

                    "<b class='popup-label'>♡ Type:</b> " +

                    p.type;


                layer.bindPopup(popupContent);

            }

        }).addTo(cityLayer);


        // ------------------------------------------------
        // ADD WEATHER STATIONS
        // ------------------------------------------------

        L.geoJSON(weatherStations, {

            pointToLayer: weatherStyle,

            onEachFeature: function(feature, layer) {

                var p = feature.properties;

                var popupContent =

                    "<div class='popup-title'>" +

                    p.name +

                    "</div>" +

                    "<b class='popup-label'>♡ Temperature:</b> " +

                    p.temperature +

                    " °C<br>" +

                    "<b class='popup-label'>♡ Rainfall:</b> " +

                    p.rainfall +

                    " mm";


                layer.bindPopup(popupContent);

            }

        }).addTo(weatherLayer);


        // ------------------------------------------------
        // ADD LAYERS TO MAP
        // ------------------------------------------------

        cityLayer.addTo(map);

        weatherLayer.addTo(map);


        // ------------------------------------------------
        // LAYER CONTROL
        // ------------------------------------------------

        var baseMaps = {

            "♡ OpenStreetMap": osm,

            "♡ Satellite Imagery": satellite

        };


        var overlayMaps = {

            "♡ Cities": cityLayer,

            "♡ Weather Stations": weatherLayer

        };


        L.control.layers(

            baseMaps,

            overlayMaps,

            {
                collapsed: false
            }

        ).addTo(map);


    })


    // --------------------------------------------------
    // ERROR HANDLING
    // --------------------------------------------------

    .catch(function(error) {

        console.error(
            "Error loading GeoJSON:",
            error
        );

        alert(
            "♡ Error loading pakistan.geojson ♡\n\n" +
            "Make sure the GeoJSON file is in the same " +
            "folder as index.html."
        );

    });


// ------------------------------------------------------
// 9. SCALE CONTROL
// ------------------------------------------------------

L.control.scale({

    imperial: true,

    metric: true

}).addTo(map);