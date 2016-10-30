angular.module('BMON').controller('manageLocationsCtrl', ["$scope", "$firebaseObject", "$ionicPopup", "$timeout", function($scope, $firebaseObject, $ionicPopup, $timeout) {

var t0 = performance.now();

var refLocations = new Firebase("https://bmon2-996ca.firebaseio.com/locations"); 
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
          var changRef = refLocations.orderByChild("province").equalTo(provName);
          var key, val
          changRef.on("value", function(snapshot) {
            key = Object.keys(snapshot.val());
            //val = snapshot.val();
            console.log("Prov Key is " + key);
          });
          $.each(key, function( index, value ) {
            //console.log( index + " : edit prov from " + value.province + " to " + newProvName );
            var list = refLocations.child(value);
            var change = {"province" : newProvName}
            list.update(change);
          });
          
      };

      // Triggered on a button click, or some other target
      $scope.editArea = function(GetAreaName) {
       $scope.data = {}

       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
         templateUrl: 'editArea-template.html',
         title: 'แก้ไขพื้นที่',
         subTitle: '',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
           {
             text: '<b>Save</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.newAreaName) {
                 //don't allow the user to close unless he enters wifi password
                 e.preventDefault();
               } else {
                 return {
                  areaName: GetAreaName,
                  newAreaName: $scope.data.newAreaName
                }
               }
             }
           },
         ]
       });
       myPopup.then(function(res) {
         if ($scope.data.newAreaName != undefined) {
          console.log('input is', res);
          editArea(GetAreaName, $scope.data.newAreaName);      
         } 
       });
       $timeout(function() {
          myPopup.close(); //close the popup after 3 seconds for some reason
       }, 100000);
      };

      function editArea(areaName, newAreaName){
          console.log('areaName is', areaName+'\n'+'newAreaName is', newAreaName);
          var changRef = refLocations.orderByChild("area").equalTo(areaName);
          var key, val
          changRef.on("value", function(snapshot) {
            key = Object.keys(snapshot.val());
            //val = snapshot.val();
            console.log("Area Key is " + key);
          });
          $.each(key, function( index, value ) {
            var list = refLocations.child(value);
            var change = {"area" : newAreaName}
            list.update(change);
          });
      };

      // Triggered on a button click, or some other target
      $scope.editPin = function(getProv, getArea, getPin) {
       $scope.data = {}
       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
         templateUrl: 'editPin-template.html',
         title: 'แก้ไขจุดสำรวจ',
         subTitle: '',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
           {
             text: '<b>Save</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.newPinName) {
                 //don't allow the user to close unless he enters wifi password
                 e.preventDefault();
               } else {
                 return {
                  provName: getProv,
                  areaName: getArea,
                  pinName: getPin,
                  newPinName: $scope.data.newPinName
                }
               }
             }
           },
         ]
       });
       myPopup.then(function(res) {
         if ($scope.data.newPinName != undefined) {
          console.log('input is', res);
          editPin(getProv, getArea, getPin, $scope.data.newPinName);      
         } 
       });
       $timeout(function() {
          myPopup.close(); //close the popup after 3 seconds for some reason
       }, 100000);
      };

      function editPin(provName, areaName, pinName, newPinName){
          console.log('provName is', provName+'\n'+'pinName is', pinName+'\n'+'newPinName is', newPinName);
          var changRef = refLocations.orderByChild("area").equalTo(areaName);
          // var changList
          // changRef.on("value", function(snapshot) {
          //   changList = snapshot.val();
          // });
          // $.each(changList, function( index, value ) {
          //   console.log( index + ": edit pin from " + value.pin );
          //   var list = refLocations.child(index);
          //   var change = {"area" : newAreaName}
          //   list.update(change);
          //   console.log("to " + newAreaName);
          // });
      };






  }
]);















  
