app.controller('leve_chambre_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv) {
    
    // Reset le type de point de mesure
    $scope.reset_type_pt = function() {
        $rootScope.dict_WorkMes.type_pt_mes = '';
    };

    // Fonction de definiton du point mesure
    $scope.def_pt_mes = function(type) {
        $rootScope.dict_WorkMes.type_pt_mes = type;
    };

    // Fonction d'ajout d'un radier / entree / sortie
    $scope.add_pt = function() {
        // Test si radier, entree ou sortie
        if ($rootScope.dict_WorkMes.type_pt_mes === 'radier') {
            $rootScope.dict_WorkMes['chambre_temp']['radier'] = $rootScope.dict_WorkMes['dict_der_mes'];

        } else if ($rootScope.dict_WorkMes.type_pt_mes === 'entree') {
            id = 'E' + $rootScope.dict_WorkMes['chambre_temp']['id_entree'];
            $rootScope.dict_WorkMes['chambre_temp']['entree'][id] = {label:id, mes:$rootScope.dict_WorkMes['dict_der_mes']};
            $rootScope.dict_WorkMes['chambre_temp']['id_entree'] += 1;

        } else if ($rootScope.dict_WorkMes.type_pt_mes === 'sortie') {
            id = 'S' + $rootScope.dict_WorkMes['chambre_temp']['id_sortie'];
            $rootScope.dict_WorkMes['chambre_temp']['sortie'][id] = {label:id, mes:$rootScope.dict_WorkMes['dict_der_mes']};
            $rootScope.dict_WorkMes['chambre_temp']['id_sortie'] += 1;
            
        };
        $scope.reset_type_pt()
    };
    $scope.add_pt()

    // Fonction d'ajout de la chambre
    $scope.add_chambre = function(type) {
        // Nom du projet actif
        projet_actif = $rootScope.dict_WorkMes.active_proj;
        $rootScope.dict_WorkMes['chambre_temp']['dossier'] = projet_actif;

        // Test si l'identifiant existe deja -> cas d'une edition -> pas de nouveau id
        if ($rootScope.dict_WorkMes['chambre_temp']['id'] in $rootScope.dict_WorkMes.dict_proj[projet_actif].dict_mes.chambre) {
            id = $rootScope.dict_WorkMes['chambre_temp']['id'];
        } else {
            // Creation de l'identifiant unique
            id = `${projet_actif}_${$rootScope.dict_WorkMes.dict_proj[projet_actif].id}`;
            // Incrementation de l'id
            $rootScope.dict_WorkMes.dict_proj[projet_actif].id += 1;
        };
        
        $rootScope.dict_WorkMes['chambre_temp']['id'] = id;
        $rootScope.dict_WorkMes.dict_proj[projet_actif].dict_mes.chambre[id] = $rootScope.dict_WorkMes['chambre_temp'];
        console.log($rootScope.dict_WorkMes.dict_proj[projet_actif]);

        // Enregistrement des donnees dans le stockage de l'appareil
        WorkMes_utils_Serv.save_dict_localstorage();

        // Reinitialisation de la chambre temporaire
        location.reload();
    };

    // Verification des limites d'un input nombre
	$scope.set_min_max = function(attribut, min, max, nom_attribut) {
        attribut_val = $rootScope.dict_WorkMes['chambre_temp'][attribut];
        if (!(attribut_val >= min && attribut_val <= max)) {
            // Ajout du texte de l'erreur
            $scope.error_attribut = `${nom_attribut} : min. ${min}, max. ${max}`;
        } else {
            $scope.error_attribut = null;
        }
	};

    // Function qui rempli directement dimension2 lorsque dimension1 est rempli
    $scope.link_dim1_dim2 = function() {
        $rootScope.dict_WorkMes['chambre_temp']['dimension2'] = $rootScope.dict_WorkMes['chambre_temp']['dimension1'];
    }

});