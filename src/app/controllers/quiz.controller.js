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