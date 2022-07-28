app.controller('liste_chambre_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv) {

    $scope.delete = false;

    // Rend la chambre active pour la modification / si le mode suppression est actif, supprime la chambre
    $scope.select_chambre = function(id) {
        if (!$scope.delete) {
            $rootScope.dict_WorkMes['chambre_temp'] = $rootScope.dict_WorkMes.dict_proj[$rootScope.dict_WorkMes.active_proj].dict_mes.chambre[id];
            history.back();
        } else {
            delete $rootScope.dict_WorkMes.dict_proj[$rootScope.dict_WorkMes.active_proj].dict_mes.chambre[id];
        };

        // Enregistrement des donnees dans le stockage de l'appareil
        WorkMes_utils_Serv.save_dict_localstorage();
    };

    // Passer en mode suppression
    $scope.delete_mode = function() {
        if ($scope.delete) {
            $scope.delete = false;
            document.getElementById("delete_button").className = "bouton_gray";
        } else {
            $scope.delete = true;
            document.getElementById("delete_button").className = "bouton_red";
        };
    };

});