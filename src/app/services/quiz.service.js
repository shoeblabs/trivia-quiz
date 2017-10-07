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
