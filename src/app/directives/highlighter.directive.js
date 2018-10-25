(function() {

    "use strict";
    
    angular
        .module('triviaQuiz')
        .directive('ngHighlighter',highlighter);
    
        function highlighter($interpolate) {
            "ngInject";
            return {
                restrict: 'E',
                template: '<code ng-transclude></code>',
                replace:true,
                transclude:true
            };
        }
})();