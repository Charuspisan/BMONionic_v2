angular.module('BMON')

.controller('getjobsCtrl', function($scope, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp) {

	console.log("user is : "+sharedProp.getEmail());

  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");

  var objID = $firebaseObject(refJobsID.orderByChild("status").equalTo("active"));
  
  //Check login user by email and pass value to variable
  $scope.assignedEmail = sharedProp.getEmail();

     // to take an action after the data loads, use the $loaded() promise
     objID.$loaded().then(function() {
         // To iterate the key/value pairs of the object, use angular.forEach()
         $scope.objID = objID;
         angular.forEach(objID, function(value, key) {
            console.log("key ", key, "val ", value);
         });
      });
    //parameter is refJobsID which sent to Operation page
    $scope.goPage = function(refJobsID,pin,prov,area,date,tool,locate) {
    	sharedProp.setJobInfo(refJobsID,pin,prov,area,date,tool,locate);
    	$location.path('/operation');
        // $window.open('zoBPgN?'+refJobsID+'?'+pin+'?'+prov+'?'+area+'?'+date+'?'+tool);
        //console.log("refJobsID : "+refJobsID);
    };
  




  });















  
