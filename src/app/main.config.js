(function(){
    'use strict';

    angular
        .module('triviaQuiz')
        .constant('API_URL','https://api.noonops.net/users/v1/')
        .config(AppConfig);

        //Config
        function AppConfig($locationProvider, $compileProvider, $interpolateProvider) {
            "ngInject";
            $interpolateProvider.startSymbol('[[');
            $interpolateProvider.endSymbol(']]');
            $locationProvider.html5Mode(true); //for clean urls
            $compileProvider.debugInfoEnabled(false); //disable debug info

        }

})(); 

