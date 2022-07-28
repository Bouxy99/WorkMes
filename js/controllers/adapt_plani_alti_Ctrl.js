app.controller('adapt_plani_alti_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv) {
    
    // Initialisation des variables
    function init_var() {
        $scope.est_ref = null, $scope.nord_ref = null,  $scope.alti_ref = null;
        $scope.est_mes = null, $scope.nord_mes = null,  $scope.alti_mes = null;
        [$scope.est_mes, $scope.nord_mes, $scope.alti_mes] = $rootScope.dict_WorkMes['dict_der_mes']['coord'];
    };
    init_var();

    // Fonction d'incrementation du numero de point et enregistrement des variables
    $scope.add_pt_adapt = function() {

        // Calcul des differences
        diff_est = $scope.est_ref - $scope.est_mes;
        diff_nord = $scope.nord_ref - $scope.nord_mes;
        diff_alti = $scope.alti_ref - $scope.alti_mes;

        // Mise a jour des variables generales
        $rootScope.dict_WorkMes['dict_pt_adapt'][$rootScope.dict_WorkMes['num_pt_adapt']] = [diff_est, diff_nord, diff_alti];
    	$rootScope.dict_WorkMes['num_pt_adapt'] += 1;

        // Calcul de la moyenne
        calc_moy_adapt();

        init_var();
    };

    // Fonction de suppression du dernier point
    $scope.delete_pt_adapt = function() {
        if ($rootScope.dict_WorkMes['num_pt_adapt'] > 1){

            // Mise a jour des variables generales
            $rootScope.dict_WorkMes['num_pt_adapt'] -= 1;
            delete $rootScope.dict_WorkMes['dict_pt_adapt'][$rootScope.dict_WorkMes['num_pt_adapt']]

            // Calcul de la moyenne
            calc_moy_adapt();

            init_var();
        }
    }

    // Fonction de calcul de la moyenne
    function calc_moy_adapt() {
        let sum_est = 0, sum_nord = 0, sum_alti = 0;
        let len_dict = Object.keys($rootScope.dict_WorkMes['dict_pt_adapt']).length;

        // Calcul et mise à jour des moyennes
        if (len_dict > 0) {
            for (const [key, value] of Object.entries($rootScope.dict_WorkMes['dict_pt_adapt'])) {
                sum_est += value[0];
                sum_nord += value[1];
                sum_alti += value[2];
            };    
            $rootScope.dict_WorkMes['adapt_final'] = [(sum_est/len_dict),(sum_nord/len_dict),(sum_alti/len_dict)];
        } else {
            $rootScope.dict_WorkMes['adapt_final'] = [0,0,0];
        }

        // Enregistrement des donnees dans le stockage de l'appareil
        WorkMes_utils_Serv.save_dict_localstorage();
    };
  });