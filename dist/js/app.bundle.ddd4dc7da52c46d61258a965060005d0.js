(function(){
    /* ----- Author: Shoeb Raza ------ */
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
        .constant('API_URL','https://api.noonops.net/users/v1/')
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

                var ver = '1.2.0';
                
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
        vm.quizDetail = {};
        vm.user = {};
        vm.isLoading = false;
        vm.setUserInfo = setUserInfo;

        //set level
        function setUserInfo (user) {
            if (vm.isLoading) return;
            quiz.resetScore();
            vm.quizDetail.user = user;
            user.country_id = 1;
            user.password = '1234';
            vm.isLoading = true;
            quiz
                .setDetails(user)
                .then(function(res) {
                    localStorage.token = res.data.data[0].jwtToken;
                    $state.go("quiz");
                    vm.isLoading = false;
                })
                .catch(function(err) {
                    alert(err.data.message);
                    vm.isLoading = false;
                });
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

        if (!localStorage.token) $state.go("home");

        var vm = this;
        var timer = null;
        vm.quizDetail = {};
        vm.timeCount = 60;
        vm.hideQuizBlock = true;
        vm.showQuizResult = false;
        localStorage.questionIndex = localStorage.questionIndex || 0;
        vm.currentQuestion = Number(localStorage.questionIndex) || 0;
        vm.questions = [];
        vm.answers = localStorage.uuid ? JSON.parse(localStorage.uuid) : [];
        vm.initTimer = initTimer;
        vm.next = next;

        function next() {
            delete localStorage.timeCount;
            $interval.cancel(vm.timer);
            timer = null;
            localStorage.uuid = JSON.stringify(vm.answers);
            if(vm.questions.length === vm.currentQuestion+1) {
                vm.hideQuizBlock = true;
                vm.quizDetail.score = 0;
                vm.quizDetail.totalScore = vm.questions.length;
                angular.forEach(vm.answers,function(ans,key){
                    if(ans.is_correct) {
                        vm.quizDetail.score += 1;
                    }        
                });
                vm.showQuizResult = true;
                quiz.setScore(vm.quizDetail.totalScore,vm.quizDetail.score);
            } else {
                vm.currentQuestion++;
                localStorage.questionIndex = vm.currentQuestion;
                vm.initTimer();
            }    
        } 
        
        //timer
        function initTimer() {
            vm.timeCount = Number(localStorage.timeCount) || 60;
            if(!timer) {
                vm.timer = $interval(function(){
                    vm.timeCount--;
                    localStorage.timeCount = vm.timeCount;
                    if(vm.timeCount == 0) {
                        delete localStorage.timeCount;
                        vm.next();
                    }
                },1000);
            }
        }

        vm.questions = quiz.getQuestionList()
        vm.hideQuizBlock = false;
        initTimer();
        
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

        var questionList = [
            {
                id:1,
                question: "what is usama's name ?",
                choices: [
                    {id:1, answer:"sulaiman", is_correct:0 },
                    {id:2, answer:"takla", is_correct:0 },
                    {id:3, answer:"mama", is_correct:0 },
                    {id:4, answer:"shakaal", is_correct:1 }
                ]
            },
            {
                id:2,
                question: "what is your name ?",
                choices: [
                    {id:1, answer:"shoeb", is_correct:1 },
                    {id:2, answer:"vaibhav", is_correct:0 },
                    {id:3, answer:"usama", is_correct:0 },
                    {id:4, answer:"ammar", is_correct:0 }
                ]
            },
            {
                id:3,
                question: "God of noon ?",
                choices: [
                    {id:1, answer:"akshit", is_correct:0 },
                    {id:2, answer:"vaibhav", is_correct:0 },
                    {id:3, answer:"usama", is_correct:0 },
                    {id:4, answer:"Ammar", is_correct:1 }
                ]
            },
            {
                id:4,
                question: "King of noon ?",
                choices: [
                    {id:1, answer:"shoeb", is_correct:0 },
                    {id:2, answer:"vaibhav", is_correct:1 },
                    {id:3, answer:"usama", is_correct:0 },
                    {id:4, answer:"ammar", is_correct:0 }
                ]
            },
        ]
        
        obj.getQuestionList = getQuestionList;
        obj.setDetails = setDetails;
        obj.getDetails = getDetails;
        obj.shuffleArray = shuffleArray;
        obj.getScore = getScore;
        obj.setScore = setScore;
        obj.resetScore = resetScore;

        function getQuestionList () {
            for(var i in questionList){
                questionList[i].choices = shuffleArray(questionList[i].choices)
            }
            if (localStorage.idz) {
                var idz = JSON.parse(localStorage.idz);
                var arr = [];
                questionList.forEach(function(item) {
                    if (idz.includes(item.id)) {
                        arr.push(item);
                    }
                })
                return arr;
            } else {
                var selectedList = shuffleArray(questionList).slice(0,5);
                var arr = [];
                selectedList.forEach(function(item) {
                    arr.push(item.id);
                });
                localStorage.idz = JSON.stringify(arr);
                return selectedList;
            }
        }

        function setDetails (quizDetails) {
            return $http({
                method: 'POST',
                data: quizDetails,
                url: API_URL+'register',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Platform': 'web',
                    'Locale': 'en',
                    'Country': 3
                    }
                });

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

        function resetScore() {
            delete localStorage.totalScore;
            delete localStorage.score;
            delete localStorage.token;
            delete localStorage.idz
            delete localStorage.uuid;;
            delete localStorage.questionIndex;
        }

        function setScore(totalScore, score) {
            $http({
                method: 'PUT',
                data: {
                    grade: score,
                    class: totalScore,
                    token: localStorage.getItem('token')
                },
                url: API_URL+'profile',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Platform': 'web',
                    'Locale': 'en',
                    'Country': 3
                    }
                });
            resetScore();
        }

        function getScore() {
            return {score:parseInt(localStorage.getItem('score')),totalScore:parseInt(localStorage.getItem('totalScore'))};
        }

        return obj;
    }

})();   
