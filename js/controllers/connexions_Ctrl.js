app.controller('connexions_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv) {
    
    // Fonction d'enregistrement du dictionnaire de connexion
    $scope.save_dict_conn = function() {
        WorkMes_utils_Serv.save_dict_localstorage()
    };
});