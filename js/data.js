var app = angular.module('TechIsFunWebsite', []);

function PortfolioController($scope, $http, $log) {

    $scope.projects = [];

    $scope.loadProjects = function() {
        $http.get('data/projects.json').
            success(function(data, status, headers, config) {
                $log.log("OK")
              $scope.projects = angular.fromJson(data);
              $log.log($scope.projects[0].links[0])
            }).
            error(function(data, status, headers, config) {
                $log.log("KO")
              //$log.log(data)
            });
    };

    $scope.loadProjects();

}

angular.module('TechIsFunWebsite')
    .filter('to_trusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
