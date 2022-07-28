app.controller('carte_Ctrl', function ($scope, $rootScope, openlayers_Serv) {

	// Initialisation de la carte
	[map, positionFeature, accuracyFeature] = openlayers_Serv.getMap('map');

	// définir l'objet geolocalisation de OL
	const geolocation = new ol.Geolocation({
		// enableHighAccuracy must be set to true to have the heading value.
		trackingOptions: {
			enableHighAccuracy: true,
		},
		projection: "EPSG:2056",
	});
	geolocation.setTracking(true);

	new ol.layer.Vector({
		map: map,
		source: new ol.source.Vector({
		  features: [positionFeature, accuracyFeature],
		}),
	  });

	// changer la position du point et le centrage de la carte
	geolocation.on('change:position', function () {
		if ($scope.gps) {
			coordinates = geolocation.getPosition();
			positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
		};
	});

	// changer la geometrie de la qualité 2D
	geolocation.on('change:accuracyGeometry', function () {
		if ($scope.gps) {
			accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
		};
	});

	// Centrer sur la position
	$scope.centrer_position = function() {		
		if ($scope.gps) {
			coordinates = geolocation.getPosition();
			map.getView().setCenter(coordinates);
		};
	};
	
	$scope.gps = true;
	// Activer / Desactiver la position et qualite 2D
	$scope.change_gps = function() {
		if ($scope.gps) {
			$scope.gps = false;
            document.getElementById("change_gps").className = "bouton_gray";
            document.getElementById("centrer_position").className = "bouton_gray";
			positionFeature.setGeometry();
			accuracyFeature.setGeometry();
		} else {
			$scope.gps = true;
            document.getElementById("change_gps").className = "bouton_s";
            document.getElementById("centrer_position").className = "bouton_s";
		};
	};

	// Ajouter les elements mesures a la carte
	map.addLayer(openlayers_Serv.add_mes($rootScope));
});