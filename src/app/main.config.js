(function(){
    'use strict';

    angular
        .module('triviaQuiz')
        .constant('API_URL','https://opentdb.com/')
        .config(AppConfig)
        .run(AppRun);

        //Config
        function AppConfig($locationProvider, $compileProvider) {
            "ngInject";

            $locationProvider.html5Mode(true); //for clean urls
            // $compileProvider.debugInfoEnabled(false); //disable debug info

        }

        //App run
        function AppRun($rootScope) {
            "ngInject";
            
            // $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
            //     document.body.scrollTop = 0;
            //     document.documentElement.scrollTop = 0;
            // });

        }

})(); 

