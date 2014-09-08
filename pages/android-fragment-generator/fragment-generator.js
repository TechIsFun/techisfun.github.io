var app = angular.module('FragmentGenerator', [])
  .controller('FragmentGeneratorController', ['$scope', '$log', function($scope, $log) {
    $scope.$log = $log;
   
    $scope.argTypes = [
      {name:'Binder', qualifiedName:'android.os.IBinder'},
      {name:'Boolean', qualifiedName:'boolean'},
      {name:'BooleanArray', qualifiedName:'boolean[]'},
      {name:'Bundle', qualifiedName:'android.os.Bundle'},
      {name:'Byte', qualifiedName:'byte'},
      {name:'ByteArray', qualifiedName:'byte[]'},
      {name:'Char', qualifiedName:'char'},
      {name:'CharArray', qualifiedName:'char[]'},
      {name:'CharSequence', qualifiedName:'CharSequence'},
      {name:'CharSequenceArray', qualifiedName:'CharSequence[]'},
      {name:'CharSequenceArrayList', qualifiedName:'java.util.ArrayList<CharSequence>'},
      {name:'Double', qualifiedName:'double'},
      {name:'DoubleArray', qualifiedName:'double[]'},
      {name:'Float', qualifiedName:'float'},
      {name:'FloatArray', qualifiedName:'float[]'},
      {name:'Int', qualifiedName:'int'},
      {name:'IntArray', qualifiedName:'int[]'},
      //{name:'Integer', qualifiedName:'Integer'},
      {name:'IntegerArrayList', qualifiedName:'java.util.ArrayList<Integer>'},
      {name:'Long', qualifiedName:'long'},
      {name:'LongArray', qualifiedName:'long[]'},
      {name:'Parcelable', qualifiedName:'android.os.Parcelable'},
      {name:'ParcelableArray', qualifiedName:'android.os.Parcelable[]'},
      {name:'ParcelableArrayList', qualifiedName:'java.util.ArrayList<? extends android.os.Parcelable>'},
      {name:'Serializable', qualifiedName:'Serializable'},
      {name:'Short', qualifiedName:'short'},
      {name:'ShortArray', qualifiedName:'short[]'},
      {name:'SparseParcelableArray', qualifiedName:'android.util.SparseArray<? extends android.os.Parcelable>'},
      {name:'String', qualifiedName:'String'},
      {name:'StringArray', qualifiedName:'String[]'},
      {name:'StringArrayList', qualifiedName:'java.util.ArrayList<String>'}
    ];

    $scope.fragmentArguments = [];

    // default values
    $scope.packageName = "com.example";
    $scope.className = "MyFragment";
    $scope.layout = "my_fragment_layout.xml";
    $scope.argumentList = "";
    $scope.fragmentArguments.push({
      name:"firstArgument",
      argType: $scope.argTypes[27] // default value: String
    });
    $scope.fieldAssignStatements = [];

    $scope.$watch('package', function (value) {
        $log.log($scope.packageName)
    });

    $scope.$watch('className', function (value) {
        $log.log($scope.className)
    });

    $scope.$watch('fragmentArguments', function (values) {
        // create argument list
        $scope.argumentList = "";

        angular.forEach(values, function(argument, key) {
          if (argument.argType && argument.name) {
            $scope.argumentList += argument.argType.qualifiedName + " " + argument.name + ", ";       
          }
        }, $log);

        length = $scope.argumentList.length;
        $scope.argumentList = $scope.argumentList.substring(0, length-2);
        
        //$log.log($scope.argumentList)
        //$('#inputArgument{{$index}}').focus();
    }, true)

    $scope.addArgument = function($log) {
      $scope.fragmentArguments.push({});
    };

  }]);

app.filter('capitalize', function() {
 return function(input, scope) {
   if (input!=null)
   return input.substring(0,1).toUpperCase()+input.substring(1);
 }
});

app.filter('stripExtension', function() {
 return function(input, scope) {
    if (input!=null) {
      index = input.lastIndexOf(".");
      if (index > -1) {
        input = input.substring(0, index);
      }
    }
   return input;
 }
});
  
app.filter('asField', function() {
 return function(input, scope) {
   if (input!=null)
   return "m" + input.substring(0,1).toUpperCase()+input.substring(1);
 }
});
