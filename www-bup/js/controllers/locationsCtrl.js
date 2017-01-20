angular.module('BMON').controller('manageLocationsCtrl', function($scope, $firebaseObject, $firebaseArray, $ionicPopup, $timeout) {


     var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/");

     var obj = $firebaseObject(refLocations);
     // to take an action after the data loads, use the $loaded() promise
     obj.$loaded().then(function() {
         // To iterate the key/value pairs of the object, use angular.forEach()
         //console.log(obj);
         angular.forEach(obj, function(value, key) {
            //console.log("key ", key, "val ", value);
         });
         // To make the data available in the DOM, assign it to $scope
         //$scope.data = obj;
        
         // For three-way data bindings, bind it to the scope instead
         //obj.$bindTo($scope, "data");  
       
      });
  
refLocations.on("value", function(snapshot) {
    var snapData=snapshot.val();
    $scope.data = snapData;
    //console.log(snapData);
});

  // Triggered on a button click, or some other target
    $scope.showAddProvPopup = function() {
      $scope.AddProvData = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        templateUrl: 'AddProvPopup.html',
        title: 'Add Province',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.AddProvData.provInTxt||!$scope.AddProvData.areaInTxt||!$scope.AddProvData.pinInTxt||!$scope.AddProvData.latInTxt||!$scope.AddProvData.lngInTxt) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                //return $scope.data.provInTxt;
                  var prov=$scope.AddProvData.provInTxt;
                  var area=$scope.AddProvData.areaInTxt;
                  var pin=$scope.AddProvData.pinInTxt;
                  var lat=$scope.AddProvData.latInTxt;
                  var lng=$scope.AddProvData.lngInTxt;
                  addData(prov, area, pin, lat, lng);
              }
            }
          }
        ]
      });

      // myPopup.then(function(res) {
      //   console.log('Tapped!', res);
      // });

      $timeout(function() {
         myPopup.close(); //close the popup after 3 seconds for some reason
      }, 100000);
     };
    
    function addData(prov, area, pin, lat, lng){
      //check exit
        refLocations.orderByChild("meta").equalTo(prov+"_"+area+"_"+pin).once("value", function(snapshot) {
          var checkExit = snapshot.val();
          //console.log(checkExit);

          if(checkExit){
             console.log("Pin Exiting");
                alert("มีจุดสำรวจนี้อยู่แล้ว ไม่สามารถบันทึกทับได้");
           }else{
              refLocations.push({
                province:prov,
                area:area,
                pin:pin,
                lat:lat,
                lng:lng,
                meta:prov+"_"+area+"_"+pin,
                imgs:{
                  front:"blank.jpg",
                  right:"blank.jpg",
                  back:"blank.jpg",
                  left:"blank.jpg"
                }
              })
              console.log("New item added "+prov+" : "+area+" : "+pin+" : "+lat+" : "+lng);             
           }
      })                    
    }


  $scope.showEditProvPopup = function(prov) {
    $scope.EditProvData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'EditProvPopup.html',
      title: 'Edit Province',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.EditProvData.provInTxt) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              //return $scope.data.provInTxt;
              var newProv=$scope.EditProvData.provInTxt;
              var curentProv=prov;
              console.log(curentProv);
              EditProvData(curentProv, newProv);
            }
          }
        }
      ]
    });

    // myPopup.then(function(res) {
    //   console.log('Tapped!', res);
    // });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };

  function EditProvData(curentProv, newProv){
    console.log(curentProv, newProv);
    refLocations.orderByChild("province").equalTo(curentProv).once("value", function(snapshot) {
      var checkExit = Object.keys(snapshot.val());
      var provArray
      var curentArea
      var curentPin
      //console.log(checkExit);
      checkExit.forEach(function(val){
        //console.log(val);
        provArray = refLocations.child(val);
        provArray.once("value",function(snap){
          curentArea=snap.val().area;
          curentPin=snap.val().pin;
        });
        //console.log("meta ",curentArea,curentPin);
        provArray.update({province:newProv,meta:newProv+"_"+curentArea+"_"+curentPin})
      })
    })                    
  }
  
  
  $scope.showEditAreaPopup = function(prov, area) {
    $scope.EditAreaData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'EditAreaPopup.html',
      title: 'Edit Area',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.EditAreaData.provInTxt) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              //return $scope.data.provInTxt;
              var newArea=$scope.EditAreaData.provInTxt;
              var currentProv=prov;
              var currentArea=area;
              console.log("currentProv : "+currentProv+" currentArea : "+currentArea );
              EditAreaData(currentArea, newArea, currentProv);
            }
          }
        }
      ]
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };

  function EditAreaData(currentArea, newArea, currentProv){
    //console.log(currentArea, newArea, currentProv);
    refLocations.orderByChild("province").equalTo(currentProv).once("value", function(snapshot) {
      var data = snapshot.val();
     //console.log(data);
      
      $.each( data, function( key, value ) {
          //console.log(key, value.area);
          if(value.area==currentArea){
            //resultArea.push(key);
            //console.log("key  "+key);
            var currentPin
             var AreaArray = refLocations.child(key);
             AreaArray.once("value",function(snap){
               //console.log("snap  "+snap);
                currentPin = snap.val().pin;
            });
            //console.log("meta ",currentProv,currentArea,currentPin);
            AreaArray.update({area:newArea,meta:currentProv+"_"+newArea+"_"+currentPin})
          }
      });

    })                    
  }
  
  
  $scope.showEditPinPopup = function(prov, area, pin) {
    $scope.EditPinData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'EditPinPopup.html',
      title: 'Edit Pin',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.EditPinData.pinInTxt) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              //return $scope.data.provInTxt;
              var newPin=$scope.EditPinData.pinInTxt;
              var currentProv=prov;
              var currentArea=area;
              var currentPin=pin;
              console.log("currentProv : "+currentProv+" currentArea : "+currentArea+" currentPin : "+currentPin+" newPin : "+newPin);
              EditPinData(currentPin, newPin, currentArea, currentProv);
            }
          }
        }
      ]
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };

  function EditPinData(currentPin, newPin, currentArea, currentProv){
    console.log(currentPin, "newPin " + newPin, currentArea, currentProv);
    refLocations.orderByChild("province").equalTo(currentProv).once("value", function(snapshot) {
      var data = snapshot.val();
     //console.log(data);
      
      $.each( data, function( key, value ) {
          //console.log(key, value.pin);
          if(value.area==currentArea&&value.pin==currentPin){
            //console.log("key  "+key);
              var pinArray = refLocations.child(key);
            //  pinArray.once("value",function(snap){
            //    //console.log("snap  "+snap);
            //     currentPin = snap.val().pin;
            // });
            //console.log("meta ",currentProv,currentArea,currentPin);
            pinArray.update({pin:newPin,meta:currentProv+"_"+currentArea+"_"+newPin})
          }
      });

    })                    
  }
    
  $scope.showEditLatPopup = function(prov, area, pin, lat) {
    $scope.EditLatData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'EditLatPopup.html',
      title: 'Edit Latitute',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.EditLatData.pinInTxt) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              //return $scope.data.provInTxt;
              var newLat=$scope.EditLatData.pinInTxt;
              var currentProv=prov;
              var currentArea=area;
              var currentPin=pin;
              var currentLat=lat;
              console.log("currentProv : "+currentProv+" currentArea : "+currentArea+" currentPin : "+currentPin+" currentLat : "+currentLat+" newLat : "+newLat);
              EditLatData(currentLat, newLat, currentPin, currentArea, currentProv);
            }
          }
        }
      ]
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };

  function EditLatData(currentLat, newLat, currentPin, currentArea, currentProv){
    console.log(currentLat, "newLat " + newLat, currentPin, currentArea, currentProv);
    refLocations.orderByChild("province").equalTo(currentProv).once("value", function(snapshot) {
      var data = snapshot.val();
     //console.log(data);
      
      $.each( data, function( key, value ) {
          //console.log(key, value.pin);
          if(value.area==currentArea&&value.pin==currentPin){
            //console.log("key  "+key);
              var pinArray = refLocations.child(key);
            //  pinArray.once("value",function(snap){
            //    //console.log("snap  "+snap);
            //     currentPin = snap.val().pin;
            // });
            //console.log("meta ",currentProv,currentArea,currentPin);
            pinArray.update({lat:newLat});
          }
      });

    })                    
  } 
  
  $scope.showEditLngPopup = function(prov, area, pin, lng) {
    $scope.EditLngData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'EditLngPopup.html',
      title: 'Edit Longtitute',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.EditLngData.pinInTxt) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              //return $scope.data.provInTxt;
              var newLng=$scope.EditLngData.pinInTxt;
              var currentProv=prov;
              var currentArea=area;
              var currentPin=pin;
              var currentLng=lng;
              console.log("currentProv : "+currentProv+" currentArea : "+currentArea+" currentPin : "+currentPin+" currentLat : "+currentLng+" newLng : "+newLng);
              EditLngData(currentLng, newLng, currentPin, currentArea, currentProv);
            }
          }
        }
      ]
    });
    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };

  function EditLngData(currentLng, newLng, currentPin, currentArea, currentProv){
    console.log(currentLng, "newLng " + newLng, currentPin, currentArea, currentProv);
    refLocations.orderByChild("province").equalTo(currentProv).once("value", function(snapshot) {
      var data = snapshot.val();
     //console.log(data);
      
      $.each( data, function( key, value ) {
          //console.log(key, value.pin);
          if(value.area==currentArea&&value.pin==currentPin){
            //console.log("key  "+key);
              var pinArray = refLocations.child(key);
            //  pinArray.once("value",function(snap){
            //    //console.log("snap  "+snap);
            //     currentPin = snap.val().pin;
            // });
            //console.log("meta ",currentProv,currentArea,currentPin);
            pinArray.update({lng:newLng});
          }
      });

    })                    
  } 



});















  
