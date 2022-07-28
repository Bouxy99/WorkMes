app.service('WorkMes_utils_Serv', function ($rootScope) {

	// Fonction pour arrondir des nombres
	// Inspiration : https://stackoverflow.com/questions/61711943/how-to-correctly-use-tofixed-in-angular
	this.round = function (num, decimal) {
		const valFixed = num.toFixed(decimal);
		const fixedToNum = +valFixed;
		return fixedToNum;
	};

	// Enregistement du dictionnaire dans le localstorage
	this.save_dict_localstorage = function() {
		let dict = JSON.stringify($rootScope.dict_WorkMes)
		localStorage.setItem('WorkMes_dict', dict);
	};
});