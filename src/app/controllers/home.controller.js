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