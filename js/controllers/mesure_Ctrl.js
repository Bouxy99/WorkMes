app.controller('mesure_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv, openlayers_Serv, $interval) {

    // Definition des variables
    $scope.est = 0;
    $scope.nord = 0;
    $scope.alti = 0;
    $scope._prec_plani = 0;
    $scope.prec_plani = 0;
    $scope.prec_alti = 0;
    $scope.mes = false;

    // Initialisation de la carte
    [map_mesure, positionFeature, accuracyFeature] = openlayers_Serv.getMap('map_mesure');

    // Definir l'objet geolocalisation de OL
	geolocation = new ol.Geolocation({
		// enableHighAccuracy must be set to true to have the heading value.
		trackingOptions: {
			enableHighAccuracy: true,
		},
		projection: "EPSG:2056",
	});
    // Demarrer la geolocalisation
	geolocation.setTracking(true);


    // Obligatoire pour que Angular mette a jour les variables de maniere dynamique
    // Inspiration : https://stackoverflow.com/questions/38762576/window-setinterval-does-no-work-properly-in-angular-js
    $scope.timer = 0;
    $interval(function() { $scope.timer++; }, 500); // 500 est la valeur de rafraichissement en milisecondes

	// changer la position du point et le centrage de la carte
	geolocation.on('change:position', function () {
        $scope._prec_plani = parseFloat(geolocation.getAccuracy()).toFixed(3);

        // Si mesure pas encore effectue
        if (!$scope.mes) {
            // Si entre dans la plage de precision definie
            if ($scope._prec_plani < $rootScope.dict_WorkMes['lim_prec']) {
                // Récuperation des ajustements plani et alti si actif
                if ($rootScope.dict_WorkMes['active_adapt']) {
                    [diff_est ,diff_nord, diff_alti] = $rootScope.dict_WorkMes['adapt_final'];
                } else {
                    [diff_est, diff_nord, diff_alti] = [0,0,0];
                };

                // Mise a jour des variables de position
                coordinates = geolocation.getPosition();
                $scope.est = WorkMes_utils_Serv.round(coordinates[0]+diff_est, 3);
                $scope.nord = WorkMes_utils_Serv.round(coordinates[1]+diff_nord, 3);   
                $scope.alti = WorkMes_utils_Serv.round(geolocation.getAltitude()-$rootScope.dict_WorkMes['h_antenne']+diff_alti, 3);
                
                // Mise a jour de la position sur la carte
                positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            };
        };
	});

	// Changer la geometrie de la qualite 2D
	geolocation.on('change:accuracyGeometry', function () {
        $scope._prec_plani = parseFloat(geolocation.getAccuracy()).toFixed(3);
        $scope.prec_alti = geolocation.getAltitudeAccuracy();

        // Si mesure pas encore effectue
        if (!$scope.mes) {
            // Si entre dans la plage de precision definie -> Mise a jour de la precision sur la carte
            if ($scope._prec_plani < $rootScope.dict_WorkMes['lim_prec']) {
                accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
                $scope.prec_plani = parseFloat(geolocation.getAccuracy()).toFixed(3);
            };
        };
	});


    // Fonction d'enregistrement de la mesure dans le dictionnaire globale
    $scope.mesurer = function() {
        // Test si la precision est indisponible
        plani = $scope.prec_plani;
        alti = $scope.prec_alti;
        if (!plani > 0) {
            plani = -1;
        };
        if (!alti > 0) {
            alti = -1;
        };
        $rootScope.dict_WorkMes['dict_der_mes'] = {
            coord : [$scope.est, $scope.nord, $scope.alti],
            h_antenne : $scope.h_antenne,
            prec_plani : plani,
            prec_alti : alti
        };
        $scope.mes = true;
        angular.element(document.querySelector("#btn_mes")).css("background-color", "var(--couleur_valid)")
    };

    // Fonction de reinitialisation de la mesure
    $scope.new_mes = function() {
        $rootScope.dict_WorkMes['dict_der_mes'] = {
            coord : [0, 0, 0],
            h_antenne : 0,
            prec_plani : 0,
            prec_alti : 0
        };
        $scope.mes = false;
        angular.element(document.querySelector("#btn_mes")).css("background-color", "var(--couleur_principale)")
    };

	// Centrer sur la position
	$scope.centrer_position = function() {		
		coordinates = geolocation.getPosition();
		map_mesure.getView().setCenter(coordinates);
	};

	// Ajouter les elements mesures a la carte
	map_mesure.addLayer(openlayers_Serv.add_mes($rootScope));
});