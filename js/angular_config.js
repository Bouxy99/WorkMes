// create the module and name it scotchApp
var app = angular.module("WorkMes", ['ngRoute']);

// Configuration des redirections
// Les pages avec des fonctions speciales autres que la navigation se voient attribuer un controller
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { templateUrl: "pages/accueil.html" })
        .when("/workflows", { templateUrl: "pages/workflows.html" })
        .when("/carte", { templateUrl: "pages/carte.html", controller: "carte_Ctrl" })
        .when("/projets", { templateUrl: "pages/projets.html", controller: "projets_Ctrl" })
        .when("/connexions", { templateUrl: "pages/connexions.html", controller: "connexions_Ctrl" })
        .when("/informations", { templateUrl: "pages/informations.html" })
        .when("/adapt_plani_alti", { templateUrl: "pages/adapt_plani_alti.html", controller: "adapt_plani_alti_Ctrl" })
        .when("/mesure", { templateUrl: "pages/mesure.html", controller: "mesure_Ctrl" })
        .when("/leve_chambre", { templateUrl: "pages/leve_chambre.html", controller: "leve_chambre_Ctrl" })
        .when("/liste_chambre", { templateUrl: "pages/liste_chambre.html", controller: "liste_chambre_Ctrl" })
});

// Definition de variable globale
app.run(function ($rootScope,WorkMes_utils_Serv) {

    // Dictionnaire des variables globales, recuperation depuis localstorage et initialisation
    $rootScope.dict_WorkMes = JSON.parse(localStorage.getItem('WorkMes_dict'));

    // Test si deja existant, sinon initialisation
    if (!$rootScope.dict_WorkMes) {
        $rootScope.dict_WorkMes = {
            // Variables adapt_plani_alti_Ctrl
            active_adapt: false,
            num_pt_adapt: 1,
            dict_pt_adapt: new Object(),
            adapt_final: [0.000.toFixed(3), 0.000.toFixed(3), 0.000.toFixed(3)],
            // Variables mesure_Ctrl
            dict_der_mes: { coord: [0, 0, 0], prec_plani: null, prec_alti: null },
            h_antenne: 1.8,
            lim_prec: 1,
            dict_proj: { 'Premier projet': { nom: 'Premier projet', dict_mes: { chambre: {}, conduite: {}, entree_sortie: {} }, id: 0 } },
            active_proj: 'Premier projet',
            // Variables concernant les chambres
            chambre_temp: { radier: {}, entree: {}, sortie: {}, id_entree: 1, id_sortie: 1, dimension1: null, dimension2: null, annee_const: new Date().getFullYear(), fonction: null, materiau: null, etat: "1", proprietaire: null, ouvrage_spe: false, remarque: null, id: null },
            type_pt_mes: null,
            // Variables de connexions
            bd_adresse: null,
            bd_port: null,
        };
    } else {
        $rootScope.dict_WorkMes.chambre_temp = { radier: {}, entree: {}, sortie: {}, id_entree: 1, id_sortie: 1, dimension1: null, dimension2: null, annee_const: new Date().getFullYear(), fonction: null, materiau: null, etat: "1", proprietaire: null, ouvrage_spe: false, remarque: null, id: null };
    };
});