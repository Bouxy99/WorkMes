app.controller('projets_Ctrl', function($scope, $rootScope, WorkMes_utils_Serv) {
    
    // Fonction de creation d'un projet
    $scope.create_proj = function() {
        let nom_proj = prompt("Nom du projet :", "");
        while (nom_proj in $rootScope.dict_WorkMes.dict_proj) {
            nom_proj = prompt(`Le nom ${nom_proj} existe déjà !\nNouveau nom :`, "");
        };
        if (nom_proj != null) {
            $rootScope.dict_WorkMes.dict_proj[nom_proj] = {nom: nom_proj, dict_mes: {chambre:{}, conduite:{}, entree_sortie:{}}, id:0};
            WorkMes_utils_Serv.save_dict_localstorage()
        };
    };

    // Fonction de selection d'un projet
    $scope.select_proj = function(nom_proj) {
        $rootScope.dict_WorkMes.active_proj = nom_proj;
        // Enregistrement des donnees dans le stockage de l'appareil
        WorkMes_utils_Serv.save_dict_localstorage();
    };

    //Fonction de supression d'un projet
    $scope.delete_proj = function(nom_proj) {
        if (confirm(`Supprimer le projet ${nom_proj}?`) == true) {
            delete $rootScope.dict_WorkMes.dict_proj[nom_proj];
            $rootScope.dict_WorkMes.active_proj = null;
            // Enregistrement des donnees dans le stockage de l'appareil
            WorkMes_utils_Serv.save_dict_localstorage();
        };
    };

    // Fonction de sauvegarde dans la base de donnees
    $scope.save_bd = function() {
        // Creation de l'url : adresse + port + dicionnaire WorkMes en format texte
        let url = 'http://' + $rootScope.dict_WorkMes.bd_adresse + ':' + $rootScope.dict_WorkMes.bd_port + '?';
        url = url + JSON.stringify($rootScope.dict_WorkMes.dict_proj[$rootScope.dict_WorkMes.active_proj]);
        // Requete au server
        $.ajax({
            url: url,
            type: 'POST',
            // Fonction a effectuer en cas de réussite de la requete
            success: function () {
                // Popup pour l'utilisateur
                alert('Données enregistrées!');
            },
            // Fonction a effectuer en cas d'echec de la requete
            error: function() {
                // Popup pour l'utilisateur
                alert('Données non-enregistrées...');
            }
        });
    };
});