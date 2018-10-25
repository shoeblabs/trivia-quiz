(function() {

"use strict";

angular
    .module('triviaQuiz')
    .factory('quiz',quiz);

    function quiz($http, $q, API_URL) {
        "ngInject";

        var obj = {};

        var questionList = [
                {
                  id: 1,
                  question: "4+3+2+'1'",
                  choices: [
                    {
                      id: 1,
                      answer: "4321",
                      is_correct:0
                    },
                    {
                      id: 2,
                      answer: "91",
                      is_correct:1
                    },
                    {
                      id: 3,
                      answer: "73",
                      is_correct:0
                    },
                    {
                      id: 4,
                      answer: "Type Error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 2,
                  question: "'1'+2+4",
                  choices: [
                    {
                      id: 5,
                      answer: "124",
                      is_correct:1
                    },
                    {
                      id: 6,
                      answer: "16",
                      is_correct:0
                    },
                    {
                      id: 7,
                      answer: "16",
                      is_correct:0
                    },
                    {
                      id: 8,
                      answer: "Type Error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 3,
                  question: "(function(){ var a = b = 3; })(); console.log((typeof a !== 'undefined'), typeof b!== 'undefined');",
                  choices: [
                    {
                      id: 9,
                      answer: "true true",
                      is_correct:0
                    },
                    {
                      id: 10,
                      answer: "false false",
                      is_correct:0
                    },
                    {
                      id: 11,
                      answer: "true false",
                      is_correct:0
                    },
                    {
                      id: 12,
                      answer: "false true",
                      is_correct:1
                    }
                  ]
                },
                {
                  id: 4,
                  question: "console.log(typeof typeof 1);",
                  choices: [
                    {
                      id: 13,
                      answer: "number",
                      is_correct:0
                    },
                    {
                      id: 14,
                      answer: "Object",
                      is_correct:0
                    },
                    {
                      id: 15,
                      answer: "string",
                      is_correct:1
                    },
                    {
                      id: 16,
                      answer: "Type error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 5,
                  question: "console.log(2.0 == '2' == new Boolean(true) == '1')",
                  choices: [
                    {
                      id: 17,
                      answer: "true",
                      is_correct:1
                    },
                    {
                      id: 18,
                      answer: "false",
                      is_correct:0
                    },
                    {
                      id: 19,
                      answer: "NaN",
                      is_correct:0
                    },
                    {
                      id: 20,
                      answer: "Type error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 6,
                  question: "console.log(square(5)); var square = function(n) { return n * n;  }",
                  choices: [
                    {
                      id: 21,
                      answer: "25",
                      is_correct:0
                    },
                    {
                      id: 22,
                      answer: "NaN",
                      is_correct:0
                    },
                    {
                      id: 23,
                      answer: "5",
                      is_correct:0
                    },
                    {
                      id: 24,
                      answer: "Type error",
                      is_correct:1
                    }
                  ]
                },
                {
                  id: 7,
                  question: "var a = 10; function Foo() { if (true) { let a = 4; } alert(a); } Foo();",
                  choices: [
                    {
                      id: 25,
                      answer: "10",
                      is_correct:1
                    },
                    {
                      id: 26,
                      answer: "4",
                      is_correct:0
                    },
                    {
                      id: 27,
                      answer: "undefined",
                      is_correct:0
                    },
                    {
                      id: 28,
                      answer: "Type error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 8,
                  question: "var a = 1; function b() { a = 10; return; function a() {} } b(); console.log(typeof(a));",
                  choices: [
                    {
                      id: 29,
                      answer: "Object",
                      is_correct:0
                    },
                    {
                      id: 30,
                      answer: "Type Error",
                      is_correct:0
                    },
                    {
                      id: 31,
                      answer: "function",
                      is_correct:0
                    },
                    {
                      id: 32,
                      answer: "number",
                      is_correct:1
                    }
                  ]
                },
                {
                  id: 9,
                  question: "function foo(){ function bar() { return 3; } return bar(); function bar() { return 8; } } console.log(foo());",
                  choices: [
                    {
                      id: 33,
                      answer: "undefined",
                      is_correct:0
                    },
                    {
                      id: 34,
                      answer: "Type Error",
                      is_correct:0
                    },
                    {
                      id: 35,
                      answer: "8",
                      is_correct:1
                    },
                    {
                      id: 36,
                      answer: "3",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 10,
                  question: "x = 90; function f(){ console.log(x); var x = 100; } f();",
                  choices: [
                    {
                      id: 37,
                      answer: "90",
                      is_correct:0
                    },
                    {
                      id: 38,
                      answer: "100",
                      is_correct:0
                    },
                    {
                      id: 39,
                      answer: "undefined",
                      is_correct:1
                    },
                    {
                      id: 40,
                      answer: "Type Error",
                      is_correct:0
                    }
                  ]
                },
                {
                  id: 11,
                  question: "var foo = function foo() { <br /> &nbsp; console.log(foo === foo);   <br /> }; <br /> foo();",
                  choices: [
                   {id:1, answer:"true", is_correct:1},
                   {id:2, answer:"false", is_correct:0},
                   {id:3, answer:"refrenceError", is_correct:0},
                   {id:4, answer:"undefined", is_correct:0}
                  ]
                }, 
                {
                  id: 12,
                  question: "function aaa() { <br /> &nbsp; return <br /> &nbsp; { <br /> &nbsp; &nbsp; test: 1 <br /> &nbsp; }; <br /> =} <br /> alert(typeof aaa()); ",
                  choices: [
                   {id:1, answer:"function", is_correct:0},
                   {id:2, answer:"number", is_correct:0},
                   {id:3, answer:"object", is_correct:0},
                   {id:4, answer:"undefined", is_correct:1}
                  ]
                  }, {
                  id: 13,
                  question: "What is the result? <br /> '1' - - '1'; ",
                  choices: [
                   {id:1, answer:"0", is_correct:0},
                   {id:2, answer:"2", is_correct:1},
                   {id:3, answer:"11", is_correct:0},
                   {id:4, answer:"'11'", is_correct:0}
                  ]
                  }, {
                  id: 14,
                  question: "What is the result? <br/ > new String('This is a string') instanceof String;",
                  choices: [
                   {id:1, answer:"0", is_correct:0},
                   {id:2, answer:"2", is_correct:1},
                   {id:3, answer:"11", is_correct:0},
                   {id:4, answer:'"11"', is_correct:0}
                  ]
                  }, {
                  id: 15,
                  question: "What is the result? <br/ > [] + [] + 'foo'.split('');",
                  choices: [
                   {id:1, answer:'"f, o, o"', is_correct:1},
                   {id:2, answer:"TypeError", is_correct:0},
                   {id:3, answer:'["f", "o", "o"]', is_correct:0},
                   {id:4, answer:'[][]["f", "o", "o"]', is_correct:0}
                  ]
                  }, {
                  id: 16,
                  question: "What is the result? <br/ > new Array(5).toString();",
                  choices: [
                   {id:1, answer:'",,,,"', is_correct:1},
                   {id:2, answer:"[]", is_correct:0},
                   {id:3, answer:'"[]"', is_correct:0},
                   {id:4, answer:"[1,2,3,4,5]", is_correct:0}
                  ]
                  }, {
                  id: 17,
                  question: "var myArr = ['foo', 'bar', 'baz']; <br/ > myArr.length = 0; <br/ > myArr.push('bin'); <br/ > console.log(myArr); ",
                  choices: [
                   {id:1, answer:"['foo', 'bar', 'baz']", is_correct:0},
                   {id:2, answer:"['foo', 'bar', 'baz', 'bin']", is_correct:0},
                   {id:3, answer:"['bin', 'foo', 'bar', 'baz']", is_correct:0},
                   {id:4, answer:"['bin']", is_correct:1}
                  ]
                  }, {
                  id: 18,
                  question: "What is the result? <br /> String('Hello') === 'Hello';",
                  choices: [
                   {id:1, answer:"true", is_correct:1},
                   {id:2, answer:"false", is_correct:0},
                   {id:3, answer:"TypeError", is_correct:0},
                   {id:4, answer:"undefined", is_correct:0}
                  ]
                  }, {
                  id: 19,
                  question: "What is the result? <br /> 'This is a string' instanceof String;",
                  choices: [
                   {id:1, answer:"true", is_correct:0},
                   {id:2, answer:"false", is_correct:1},
                   {id:3, answer:"TypeError", is_correct:0},
                   {id:4, answer:"undefined", is_correct:0}
                  ]
                  }, {
                  id: 20,
                  question: "What is the result? <br /> 10 > 9 > 8 === true;",
                  choices: [
                   {id:1, answer:"true", is_correct:0},
                   {id:2, answer:"false", is_correct:1},
                   {id:3, answer:"TypeError", is_correct:0},
                   {id:4, answer:"undefined", is_correct:0}
                  ]
                  }
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
