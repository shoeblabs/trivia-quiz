(function(){
    'use strict';

    angular
        .module('triviaQuiz')
        .constant('API_URL','https://opentdb.com/')
        .config(AppConfig);

        //Config
        function AppConfig($locationProvider, $compileProvider) {
            "ngInject";

            $locationProvider.html5Mode(true); //for clean urls
            $compileProvider.debugInfoEnabled(false); //disable debug info

        }

})(); 

