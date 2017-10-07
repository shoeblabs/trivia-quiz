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