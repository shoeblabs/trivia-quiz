(function(){

    'use strict'

    angular
        .module('triviaQuiz', [
                'ngAnimate',
                'ngSanitize',
                'ui.router',
                'ui.router.state.events'
            ]);
})();
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
 
 
    
    
    


(function(){
    
    "use strict";

    angular
        .module("triviaQuiz")
        .controller('homeCtrl', homeCtrl);

    //Home controller   
    function homeCtrl ($state,quiz) {
        "ngInject";

        var vm = this;
        vm.isLoading = true;
        vm.categories = [];
        vm.quizDetail = {};
        vm.step = 1;
        vm.user = {};
        vm.pageTitle = "Select Category";
        vm.cardColors = ['#009688','#ef4438','#4caf50','#38a4dd','#ffc107','#8e76b6','#ec407a'];
        vm.game = quiz.getScore() || {};
        vm.setCategory = setCategory;
        vm.setLevel = setLevel;
        vm.setUserInfo = setUserInfo;
        vm.changeStep = changeStep;

        //get category listing
        quiz
            .getCategoryList()
            .then(function(res){
                if(res.status == 200) {
                    angular.forEach(res.data.trivia_categories,function(item){
                        item.name = (item.name.search(':') != -1)?item.name.split(":")[1].trim():item.name;
                    });
                    vm.categories = res.data.trivia_categories;
                }
            })
            .catch(function(err){
                console.log("get category error",err);
            })
            .finally(function(){
                vm.isLoading = false;
            });

        //set category
        function setCategory (category) {
            vm.quizDetail.category = category;
            vm.step = 2;
            vm.changeStep(vm.step);
        }   
        
        //set level
        function setLevel (level) {
            vm.quizDetail.difficulty = level;
            vm.step = 3;
            vm.changeStep(vm.step);
        }

        //set level
        function setUserInfo (user) {
            vm.quizDetail.user = user;
            quiz.setDetails(vm.quizDetail);
            $state.go("quiz");
        }

        //change title on step change
        function changeStep(step) {
            switch(step) {
                case 1:
                vm.pageTitle = 'Select Categories';
                break;

                case 2:
                vm.pageTitle = 'Select Level';
                break;

                case 3:
                vm.pageTitle = 'Enter Personal Details';
                break;
            }
        }

    }
    
})();  
(function(){

	"use strict";

    angular
        .module("triviaQuiz")
        .controller('quizCtrl', quizCtrl);

    //Home controller   
    function quizCtrl ($state, $interval, quiz) {
        "ngInject";

        var vm = this;
        var timer = null;
        vm.quizDetail = {};
        vm.timeCount = 60;
        vm.hideQuizBlock = true;
        vm.showQuizResult = false;
        vm.currentQuestion = 0;
        vm.questions = [];
        vm.answers = [];
        vm.initTimer = initTimer;
        vm.next = next;

        //get quizinfo & question list
        quiz
            .getDetails()
            .then(function(res){
                vm.quizDetail = res; 
                return res;              
            })
            .then(function(quizDetail){
                quiz
                    .getQuestionList(quizDetail.category.id,quizDetail.difficulty,20)
                    .then(function(res){
                        if(res.data.results.length) {
                            angular.forEach(res.data.results,function(item){
                                item.answers = angular.copy(item.incorrect_answers);
                                item.answers.push(item.correct_answer);
                                item.answers = quiz.shuffleArray(item.answers);
                            });
                            vm.questions = res.data.results;
                            vm.hideQuizBlock = false;
                            initTimer();
                        } else {
                            alert("Sorry, No data :( ....... Please Try different category or level");
                            $state.go("home");
                        }
                    });
            })
            .catch(function(err){
                console.log(err);
                $state.go("home");
            });

        function next() {
            $interval.cancel(vm.timer);
            timer = null;
            if(vm.questions.length === vm.currentQuestion+1) {
                vm.hideQuizBlock = true;
                vm.quizDetail.score = 0;
                vm.quizDetail.totalScore = vm.questions.length;
                angular.forEach(vm.answers,function(ans,key){
                    if(ans === vm.questions[key].correct_answer) {
                        vm.quizDetail.score += 1;
                    }        
                });
                vm.showQuizResult = true;
                quiz.setScore(vm.quizDetail.totalScore,vm.quizDetail.score);
            } else {
                vm.currentQuestion++;
                vm.initTimer();
            }    
        } 
        
        //timer
        function initTimer() {
            vm.timeCount = 60;
            if(!timer) {
                vm.timer = $interval(function(){
                    vm.timeCount--;
                    if(vm.timeCount == 0) {
                        vm.next();
                    }
                },1000);
            }
        }
        

    }
  
})();    
(function() {

"use strict";

angular
    .module('triviaQuiz')
    .factory('quiz',quiz);

    function quiz($http, $q, $timeout, API_URL) {
        "ngInject";

        var obj = {};
        var _quizDetails = {};
        
        obj.getCategoryList = getCategoryList;
        obj.getQuestionList = getQuestionList;
        obj.setDetails = setDetails;
        obj.getDetails = getDetails;
        obj.shuffleArray = shuffleArray;
        obj.getScore = getScore;
        obj.setScore = setScore;
        obj.resetScore = resetScore;

        function getCategoryList () {
            return $http.get(API_URL+'api_category.php');
        }

        function getQuestionList (category,difficulty,amount) {
            //default values
            amount = amount || 20;
            category = category || 1;
            difficulty = difficulty || 'medium';
            return $http.get(API_URL+'api.php?amount='+amount+'&category='+category+'&difficulty='+difficulty);
        }

        function setDetails (quizDetails) {
            _quizDetails = quizDetails;
        }

        function getDetails () {
            var deferred = $q.defer();
            if(!_quizDetails.hasOwnProperty('user')) {
                deferred.reject("no quiz data");
            } else {
                deferred.resolve(_quizDetails);
            }
            return deferred.promise;
        }

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        function resetScore(totalScore, score) {
            localStorage.setItem('totalScore', 0);
            localStorage.setItem('score', 0);
        }

        function setScore(totalScore, score) {
            localStorage.setItem('totalScore', parseInt(localStorage.getItem('totalScore') || 0)+totalScore);
            localStorage.setItem('score', parseInt(localStorage.getItem('score') || 0)+score);
        }

        function getScore() {
            return {score:parseInt(localStorage.getItem('score')),totalScore:parseInt(localStorage.getItem('totalScore'))};
        }

        return obj;
    }

})();   
