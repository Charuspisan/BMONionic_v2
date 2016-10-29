angular.module('BMON').controller('manageLocationsCtrl', ["$scope", "$firebaseObject", "$ionicPopup", "$timeout", function($scope, $firebaseObject, $ionicPopup, $timeout) {

var t0 = performance.now();

var refLocations = new Firebase("https://project-3351723142096034396.firebaseio.com/locations"); 
var obj = $firebaseObject(refLocations);

 obj.$loaded().then(function() {

       // To iterate the key/value pairs of the object, use angular.forEach()
       angular.forEach(obj, function(value, key) {
          console.log(key, value);
       });

        var t1 = performance.now();
        console.log("Init on " + ((t1 - t0)/1000) + " seconds.")
        //alert("Init on " + ((t1 - t0)/1000) + " seconds.");

  		// To make the data available in the DOM, assign it to $scope
	    $scope.datas = obj;
	    // For three-way data bindings, bind it to the scope instead
	    //obj.$bindTo($scope, "datas");

     });


      // Triggered on a button click, or some other target
      $scope.editProv = function(GetProvName) {
       $scope.data = {}

       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
         templateUrl: 'editProv-template.html',
         title: 'แก้ไขชื่อจังหวัด',
         subTitle: '',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
           {
             text: '<b>Save</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.newProvName) {
                 //don't allow the user to close unless he enters wifi password
                 e.preventDefault();
               } else {
                 return {
                  provName: GetProvName,
                  newProvName: $scope.data.newProvName
                }
               }
             }
           },
         ]
       });
       myPopup.then(function(res) {
         if ($scope.data.newProvName != undefined) {
          console.log('input is', res);
          editProv(GetProvName, $scope.data.newProvName);      
         } 
       });
       $timeout(function() {
          myPopup.close(); //close the popup after 3 seconds for some reason
       }, 100000);
      };

      function editProv(provName, newProvName){
          console.log('provName is', provName+'\n'+'newProvName is', newProvName);
          var changProvRef = refLocations.orderByChild("province").equalTo(provName);
          var changProvList
          changProvRef.on("value", function(snapshot) {
            changProvList = snapshot.val();
          });
          $.each(changProvList, function( index, value ) {
            console.log( index + ": edit prov from " + value.province );
            var list = refLocations.child(index);
            var change = {"province" : newProvName}
            list.update(change);
            console.log("to " + newProvName);
          });
          
      };



  }
]);















  
