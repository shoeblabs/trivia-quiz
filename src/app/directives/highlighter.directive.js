(function() {

    "use strict";
    
    angular
        .module('triviaQuiz')
        .directive('ngHighlighter',highlighter);
    
        function highlighter($interpolate) {
            "ngInject";
            return {
                restrict: 'E',
                template: '<pre><code ng-transclude></code></pre>',
                replace:true,
                transclude:true
            };
        }
})();