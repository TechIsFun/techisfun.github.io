var app = angular.module('FragmentGenerator', [])
  .controller('FragmentGeneratorController', ['$scope', '$log', function($scope, $log) {
    $scope.$log = $log;
   
    $scope.argTypes = [
      {name:'String', qualifiedName:'String', putMethod:'putString'},
      {name:'Integer', qualifiedName:'Integer', putMethod:'putInteger'},
      {name:'Long', qualifiedName:'Long', putMethod:'putLong'},
      {name:'Double', qualifiedName:'Double', putMethod:'putDouble'},
      {name:'Parcelable', qualifiedName:'android.os.Parcelable', putMethod:'putParcelable'}
    ];

    $scope.fragmentArguments = [];

    // default values
    $scope.package = "";
    $scope.className = "";

    //$scope.generated_code_package = "";

    //$log.log($scope.package);

     $scope.$watch('package', function (value) {
        $log.log($scope.package)
    });

     $scope.$watch('className', function (value) {
        $log.log($scope.className)
    });
  }]);

app.filter('capitalize', function() {
 return function(input, scope) {
   if (input!=null)
   return input.substring(0,1).toUpperCase()+input.substring(1);
 }
});

/*
function SourceCodeGenerator($scope, $log) {
  $scope.$watch('package', function (value) {
        $scope.generated_code_package = "package " + value + ";";
        $log.log($scope.package)
        $log.log($scope.generatedCode)
  });


  $scope.$watch('className', function (value) {
        $scope.generated_code_package = "package " + value + ";";
        $log.log($scope.package)
        $log.log($scope.generatedCode)
  });
};
*/
  
