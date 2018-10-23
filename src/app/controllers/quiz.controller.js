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