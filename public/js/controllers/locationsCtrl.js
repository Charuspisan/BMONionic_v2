angular
  .module("BMON")
  .controller(
    "locationsCtrl",
    function (
      $scope,
      $ionicPopup,
      $timeout,
      $location,
      sharedProp,
    ) {

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      $scope.goBack = function (page) {
        console.log("Going back");
        $location.path(page);
      };

      $scope.signOut = function () {
        sharedProp.signOut();      
      };

      var user = firebase.auth().currentUser;
      // setTimeout(()=>{
        if (user) {
          // User is signed in.
          console.log("Logedin");
          sharedProp.hideLoading();
        } else {
          // No user is signed in.
          console.log("No Logedin");
          $scope.goNext("/login");
        }        
      // },1000)

      var imgData;
      var etcPhotoNote;

      sharedProp.getDeviceGPS();

      $scope.etcImgs = {
        storage:"imgEtc/",
        dataTarget:"etc",
        imgName:"etc@",
        type:"etc"
      };

      var takePicture = $('#take-picture-on-locate');

      if (takePicture) {
        takePicture.change((event)=>{
          sharedProp.takePic_fn(event, $scope.editNotePopupEtcImg);          
        })
      }

      $scope.editNotePopupEtcImg = function (img64data, exif) {
        console.log("exif from editNotePopupEtcImg : ",exif);

        var myPopup = $ionicPopup.show({
          templateUrl: "editNotePopupEtcImg.html",
          title: "บันทึกช่วยจำ",
          subTitle: "คำอธิบายสำหรับรูปถ่าย",
          scope: $scope,
          buttons: [
            {
              text: "ไม่บันทึกภาพ",
              onTap: function (e) {
                takePicture.val('');
              },
            },
            {
              text: "<b>บันทึกภาพ</b>",
              type: "button-positive",
              onTap: function (e) {
                etcPhotoNote = $scope.etcImgs.note;
                // alert("etcPhotoNote : "+etcPhotoNote);
                if (
                  etcPhotoNote == undefined ||
                  etcPhotoNote == null ||
                  etcPhotoNote == ""
                ) {
                  sharedProp.showAlert(
                    "กรุณาใส่บันทึกช่วยจำทุกครั้ง"
                  );
                  event.preventDefault();
                } else {
                  // alert("ready for upload");
                  $scope.etcImgs.imgName = $scope.etcImgs.imgName + Date.now();
                  sharedProp.btnUpload($scope.etcImgs, imgData, exif);
                }
              },
            },
          ],
        });
        myPopup.then(function () {});
        imgData = img64data.split(",")[1];
        setTimeout(()=>{
          // preview image
          $("#previewImg").attr("src",img64data);
          if($("#previewImg").attr("src").length==0){
            setInterval(()=>{
              $("#previewImg").attr("src",img64data);
              console.log("waiting for preview Image");
            },1000);
          }
        },1000)
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      $scope.data;
      $scope.queryProv = [];
      $scope.queryArea = [];

      refLocations.on("value", function (snapshot) {
        // console.log("value : ",value);
        $scope.data = snapshot.val();
        var queryData = snapshot.val();
        var queryProv = [];
        var queryArea = [];
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          if (queryProv.indexOf(childData.province) == -1) {
            queryProv.push(childData.province);
            console.log("queryProv : ", queryProv);
          }
          if (queryArea.indexOf(childData.area) == -1) {
            queryArea.push(childData.area);
            console.log("queryArea : ", queryArea);
          }
        });

        $scope.queryProv = queryProv;
        $scope.queryArea = queryArea;

        console.log("$scope.data : ", $scope.data);
        console.log("$scope.queryProv : ", $scope.queryProv);
        console.log("$scope.queryArea : ", $scope.queryArea);

        sharedProp.setLocateData(queryData, queryProv, queryArea);
      });

      sharedProp.hideLoading();

      $scope.alertFactory = function (error) {
        switch (error.message) {
          case "The email address is badly formatted.":
            sharedProp.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
          case "The email address is badly formatted.":
            sharedProp.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
        }
      };

      $scope.filterArea = function () {
        console.log("prov : " + $scope.AddProvData.provInTxt);
        var queryArea = [];
        prov = $scope.AddProvData.provInTxt;
        refLocations
          .orderByChild("province")
          .equalTo(prov)
          .on("value", function (snapshot) {
            // console.log("value : ",value);
            snapshot.forEach(function (childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (queryArea.indexOf(childData.area) == -1) {
                queryArea.push(childData.area);
              }
            });
            $scope.$watch(function () {
              $scope.queryArea = queryArea;
            });
            console.log("$scope.queryArea : " + $scope.queryArea);
          });
      };

      // Triggered on a button click, or some other target
      $scope.showAddProvPopup = function () {
        $scope.AddProvData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "AddProvPopup.html",
          title: "สร้างข้อมูลพื้นที่",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (
                  !$scope.AddProvData.provInTxt ||
                  !$scope.AddProvData.areaInTxt ||
                  !$scope.AddProvData.pinInTxt ||
                  !$scope.AddProvData.latInTxt ||
                  !$scope.AddProvData.lngInTxt
                ) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var prov = $scope.AddProvData.provInTxt;
                  var area = $scope.AddProvData.areaInTxt;
                  var pin = $scope.AddProvData.pinInTxt;
                  var lat = $scope.AddProvData.latInTxt;
                  var lng = $scope.AddProvData.lngInTxt;
                  addData(prov, area, pin, lat, lng);
                }
              },
            },
          ],
        });

        // myPopup.then(function(res) {
        //   console.log('Tapped!', res);
        // });

        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function addData(prov, area, pin, lat, lng) {
        //check exit
        refLocations
          .orderByChild("meta")
          .equalTo(prov + "_" + area + "_" + pin)
          .once("value", function (snapshot) {
            var checkExit = snapshot.val();
            //console.log(checkExit);

            if (checkExit) {
              console.log("Pin Exiting");
              //alert("มีจุดสำรวจนี้อยู่แล้ว ไม่สามารถบันทึกทับได้");
              $scope.alertFactory(
                "มีจุดสำรวจนี้อยู่แล้ว ไม่สามารถบันทึกทับได้"
              );
            } else {
              refLocations.push({
                province: prov,
                area: area,
                pin: pin,
                lat: lat,
                lng: lng,
                meta: prov + "_" + area + "_" + pin,
                imgs: {
                  front: "undefined",
                  right: "undefined",
                  back: "undefined",
                  left: "undefined",
                },
              });
              console.log(
                "New item added " +
                  prov +
                  " : " +
                  area +
                  " : " +
                  pin +
                  " : " +
                  lat +
                  " : " +
                  lng
              );
            }
          });
      }

      $scope.showEditProvPopup = function (prov) {
        $scope.EditProvData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "EditProvPopup.html",
          title: "แก้ไฃชื่อจังหวัด",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.EditProvData.provInTxt) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var newProv = $scope.EditProvData.provInTxt;
                  var curentProv = prov;
                  console.log(curentProv);
                  EditProvData(curentProv, newProv);
                }
              },
            },
          ],
        });

        // myPopup.then(function(res) {
        //   console.log('Tapped!', res);
        // });

        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function EditProvData(curentProv, newProv) {
        console.log(curentProv, newProv);

        if ($scope.queryProv.includes(newProv) == false) {
          refLocations
            .orderByChild("province")
            .equalTo(curentProv)
            .once("value", function (snapshot) {
              var checkExit = Object.keys(snapshot.val());
              var provArray;
              var curentArea;
              var curentPin;
              //console.log(checkExit);
              checkExit.forEach(function (val) {
                //console.log(val);
                provArray = refLocations.child(val);
                provArray.once("value", function (snap) {
                  curentArea = snap.val().area;
                  curentPin = snap.val().pin;
                });
                //console.log("meta ",curentArea,curentPin);
                provArray.update({
                  province: newProv,
                  meta: newProv + "_" + curentArea + "_" + curentPin,
                });
              });
            });
        } else {
          sharedProp.showAlert("ชื่อจังหวัดซ้ำกับที่มีอยู่แล้ว");
        }
      }

      $scope.showEditAreaPopup = function (prov, area) {
        $scope.EditAreaData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "EditAreaPopup.html",
          title: "แก้ไฃชื่อพื้นที่",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.EditAreaData.provInTxt) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var newArea = $scope.EditAreaData.provInTxt;
                  var currentProv = prov;
                  var currentArea = area;
                  console.log(
                    "currentProv : " +
                      currentProv +
                      " currentArea : " +
                      currentArea
                  );
                  EditAreaData(currentArea, newArea, currentProv);
                }
              },
            },
          ],
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function EditAreaData(currentArea, newArea, currentProv) {
        //console.log(currentArea, newArea, currentProv);
        if ($scope.queryArea.includes(newArea) == false) {
          refLocations
            .orderByChild("province")
            .equalTo(currentProv)
            .once("value", function (snapshot) {
              var data = snapshot.val();
              //console.log(data);

              $.each(data, function (key, value) {
                //console.log(key, value.area);
                if (value.area == currentArea) {
                  //resultArea.push(key);
                  //console.log("key  "+key);
                  var currentPin;
                  var AreaArray = refLocations.child(key);
                  AreaArray.once("value", function (snap) {
                    //console.log("snap  "+snap);
                    currentPin = snap.val().pin;
                  });
                  //console.log("meta ",currentProv,currentArea,currentPin);
                  AreaArray.update({
                    area: newArea,
                    meta: currentProv + "_" + newArea + "_" + currentPin,
                  });
                }
              });
            });
        } else {
          sharedProp.showAlert("ชื่อพื้นที่ซ้ำกับที่มีอยู่แล้ว");
        }
      }

      $scope.showEditPinPopup = function (prov, area, pin) {
        $scope.EditPinData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "EditPinPopup.html",
          title: "แก้ไฃจุดสำรวจ",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.EditPinData.pinInTxt) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var newPin = $scope.EditPinData.pinInTxt;
                  var currentProv = prov;
                  var currentArea = area;
                  var currentPin = pin;
                  console.log(
                    "currentProv : " +
                      currentProv +
                      " currentArea : " +
                      currentArea +
                      " currentPin : " +
                      currentPin +
                      " newPin : " +
                      newPin
                  );
                  EditPinData(currentPin, newPin, currentArea, currentProv);
                }
              },
            },
          ],
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function EditPinData(currentPin, newPin, currentArea, currentProv) {
        console.log(currentPin, "newPin " + newPin, currentArea, currentProv);
        var pinRef = refLocations
          .orderByChild("meta")
          .equalTo(currentProv + "_" + currentArea + "_" + currentPin);
        var checkPinDup = refLocations
          .orderByChild("meta")
          .equalTo(currentProv + "_" + currentArea + "_" + newPin);

        checkPinDup.once("value", function (snapshot) {
          var checkDup = snapshot.val();
          console.log("checkDup : ", checkDup);
          if (checkDup == null) {
            refLocations
              .orderByChild("province")
              .equalTo(currentProv)
              .once("value", function (snapshot) {
                var data = snapshot.val();
                //console.log(data);

                $.each(data, function (key, value) {
                  //console.log(key, value.pin);
                  if (value.area == currentArea && value.pin == currentPin) {
                    console.log("key  " + key);
                    var pinArray = refLocations.child(key);
                    pinArray.update({
                      pin: newPin,
                      meta: currentProv + "_" + currentArea + "_" + newPin,
                    });
                  }
                });
              });
          } else {
            sharedProp.showAlert("มีจุดสำรวจนี้อยู่แล้ว");
          }
        });
      }

      $scope.showEditLatPopup = function (prov, area, pin, lat) {
        $scope.EditLatData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "EditLatPopup.html",
          title: "แก้ไข Latitute",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.EditLatData.pinInTxt) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var newLat = $scope.EditLatData.pinInTxt;
                  var currentProv = prov;
                  var currentArea = area;
                  var currentPin = pin;
                  var currentLat = lat;
                  console.log(
                    "currentProv : " +
                      currentProv +
                      " currentArea : " +
                      currentArea +
                      " currentPin : " +
                      currentPin +
                      " currentLat : " +
                      currentLat +
                      " newLat : " +
                      newLat
                  );
                  EditLatData(
                    currentLat,
                    newLat,
                    currentPin,
                    currentArea,
                    currentProv
                  );
                }
              },
            },
          ],
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function EditLatData(
        currentLat,
        newLat,
        currentPin,
        currentArea,
        currentProv
      ) {
        console.log(
          currentLat,
          "newLat " + newLat,
          currentPin,
          currentArea,
          currentProv
        );
        refLocations
          .orderByChild("province")
          .equalTo(currentProv)
          .once("value", function (snapshot) {
            var data = snapshot.val();
            //console.log(data);

            $.each(data, function (key, value) {
              //console.log(key, value.pin);
              if (value.area == currentArea && value.pin == currentPin) {
                //console.log("key  "+key);
                var pinArray = refLocations.child(key);
                //  pinArray.once("value",function(snap){
                //    //console.log("snap  "+snap);
                //     currentPin = snap.val().pin;
                // });
                //console.log("meta ",currentProv,currentArea,currentPin);
                pinArray.update({ lat: newLat });
              }
            });
          });
      }

      $scope.showEditLngPopup = function (prov, area, pin, lng) {
        $scope.EditLngData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "EditLngPopup.html",
          title: "แก้ไข Longtitute",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.EditLngData.pinInTxt) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  //return $scope.data.provInTxt;
                  var newLng = $scope.EditLngData.pinInTxt;
                  var currentProv = prov;
                  var currentArea = area;
                  var currentPin = pin;
                  var currentLng = lng;
                  console.log(
                    "currentProv : " +
                      currentProv +
                      " currentArea : " +
                      currentArea +
                      " currentPin : " +
                      currentPin +
                      " currentLat : " +
                      currentLng +
                      " newLng : " +
                      newLng
                  );
                  EditLngData(
                    currentLng,
                    newLng,
                    currentPin,
                    currentArea,
                    currentProv
                  );
                }
              },
            },
          ],
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function EditLngData(
        currentLng,
        newLng,
        currentPin,
        currentArea,
        currentProv
      ) {
        console.log(
          currentLng,
          "newLng " + newLng,
          currentPin,
          currentArea,
          currentProv
        );
        refLocations
          .orderByChild("province")
          .equalTo(currentProv)
          .once("value", function (snapshot) {
            var data = snapshot.val();
            //console.log(data);

            $.each(data, function (key, value) {
              //console.log(key, value.pin);
              if (value.area == currentArea && value.pin == currentPin) {
                //console.log("key  "+key);
                var pinArray = refLocations.child(key);
                //  pinArray.once("value",function(snap){
                //    //console.log("snap  "+snap);
                //     currentPin = snap.val().pin;
                // });
                //console.log("meta ",currentProv,currentArea,currentPin);
                pinArray.update({ lng: newLng });
              }
            });
          });
      }

      $scope.toggleGroup = function (key, group) {
        if ($scope.isGroupShown(group) || $scope.onEditGroup(key)) {
          //console.log("remove $scope.passShowGroup : ",$scope.passShowGroup);
          $scope.shownGroup = null;
          $scope.passShowGroup = null;
        } else {
          $scope.shownGroup = group;
          $scope.passShowGroup = key;
          //console.log("Set $scope.passShowGroup : ",$scope.passShowGroup);
          return $scope.passShowGroup;
        }
        //console.log("toggleGroup");
      };
      // $scope.isGroupShown = function(group) {
      //   return $scope.shownGroup === group;
      // };
      $scope.isGroupShown = function (group) {
        var checkGroup = $scope.shownGroup === group;
        //console.log("Get group checkGroup : ",group);
        return checkGroup;
      };
      $scope.onEditGroup = function (key) {
        //console.log("Get $scope.passShowGroup : ",$scope.passShowGroup);
        //console.log("Get key onEditGroup : ",key);
        var checkPassGroup = $scope.passShowGroup === key;
        //console.log("checkPassGroup : ",checkPassGroup);
        return checkPassGroup;
      };
    }
  );
