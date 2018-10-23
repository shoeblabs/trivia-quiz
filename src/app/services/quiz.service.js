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
