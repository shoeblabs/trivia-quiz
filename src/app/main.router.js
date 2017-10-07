(function(){
    'use strict';

    angular
        .module('triviaQuiz')
        .config(AppRouter);

        function AppRouter ($stateProvider, $urlRouterProvider) {
                "ngInject";

                var ver = '1.0.0';
                
                $urlRouterProvider.otherwise('/');

                $stateProvider
                .state('home', {
                        url: "/",
                        templateUrl: "app/views/home.html?ver="+ver,
                        controller: "homeCtrl",
                        controllerAs: "ctrl"
                })
                .state('quiz', {
                        url: "/quiz",
                        templateUrl: "app/views/quiz.html?ver="+ver,
                        controller: "quizCtrl",
                        controllerAs: "ctrl"
                });
        }

})(); 
 
 
    
    
    

