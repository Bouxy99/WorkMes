app.service('openlayers_Serv', function() {

    // Definition de la projection suisse
    proj4.defs(
        "EPSG:2056",
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
    );
    ol.proj.proj4.register(proj4);

    // Parametre des couches de fond
    // Copyright orthophoto
    const attributions_swisstopo = [
        "Fond de plan &copy; <a href=\"https://www.swisstopo.admin.ch/fr/home.html\">swisstopo</a>"
    ];

    // Orthophoto swisstopo
    const orthophoto = new ol.layer.Tile({
        id: "background-layer",
        source: new ol.source.XYZ({
        url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg`,
        attributions: attributions_swisstopo,
        }),
        zIndex: -99
    });

    // OpenStreetMap
    const OSM = new ol.layer.Tile({
        id: "background-layer",
        source: new ol.source.OSM(),
        zIndex: -99
    });

    // Couche de la position et précision GPS
    const positionFeature = new ol.Feature();
    positionFeature.setStyle(
        new ol.style.Style({
        image: new ol.style.Circle({radius: 6, fill: new ol.style.Fill({color: '#3399CC'}), stroke: new ol.style.Stroke({color: '#fff',width: 2})}),
        })
    );
    const accuracyFeature = new ol.Feature();

    // Fonction d'envoi de la carte parametree
    this.getMap = function (id_carte) {    
        // Parametres de la vue
        const view = new ol.View({
            projection: "EPSG:2056",
            center: [2540500, 1181200],
            zoom: 18
        });
        // Creation de la carte
        const map = new ol.Map({
            target: id_carte,
            view: view,
            controls: [new ol.control.Attribution()]
        });

        // Ajout des couches de position et precision
        new ol.layer.Vector({
            map: map,
            source: new ol.source.Vector({
              features: [positionFeature, accuracyFeature],
            }),
          });

        // Ajout des couches à la carte
        map.getLayers().extend([orthophoto]);

        return [map, positionFeature, accuracyFeature];
    };

    // Ajout des donnees mesures dans le projet a la carte
    this.add_mes = function(rootScope) {
        const features = [];
        
        // Iteration sur les donnees du projet
        // Chambres
        for (let [key, value] of Object.entries(rootScope.dict_WorkMes.dict_proj[rootScope.dict_WorkMes.active_proj].dict_mes.chambre)) {
            // Test si radier a des coordonnees
            if ('coord' in value.radier) {
                features.push(new ol.Feature({
                    geometry: new ol.geom.Point(value.radier.coord)
                }));
            }
        };

        // Creer la source et la couche
        const chambreSource = new ol.source.Vector({
          features
        });

        const chambreLayer = new ol.layer.Vector({
            source: chambreSource,
            // Style
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 20,
                    fill: new ol.style.Fill({color: '#ffcfb8'}),
                    stroke: new ol.style.Stroke({color: '#fa5102',width: 5})
                })
            })
        });

        return chambreLayer
    };

  });