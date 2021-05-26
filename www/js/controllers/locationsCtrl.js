angular
  .module("BMON")
  .controller(
    "manageLocationsCtrl",
    function (
      $scope,
      $firebaseObject,
      $firebaseArray,
      $ionicPopup,
      $timeout,
      $location,
      $ionicViewService,
      sharedProp,
      $ionicLoading
    ) {




     var refLocations = new Firebase(sharedProp.dbUrl() + "/locations/");
      var refJobsID = new Firebase(sharedProp.dbUrl() + "/jobsID/");
      var refJobsRec = new Firebase(sharedProp.dbUrl() + "/jobsRec/");
      var refStorage = firebase.storage().ref();
      
      var imgDB = new Firebase(sharedProp.dbUrl() + "/images/");
      // var userEmail = sharedProp.getEmail();
      var imgData;
      var imgEtc = "imgEtc/";
      var etcPhotoNote;
      var latImg;
      var lngImg;


      if (sharedProp.checkChrome() && window.location.protocol != "https:") {
        console.log("not https may be have problem with chorme");
        // $scope.showAlert(
        //   "ท่านไม่ได้เปิดหน้าเพจด้วย https กรุณาคลิก <a target='_top' href=''>ลิงก์บน https</a>"
        // );
        navigator.geolocation.getCurrentPosition(getPosition, parseError);
      } else {
        navigator.geolocation.getCurrentPosition(getPosition, parseError);
      }

      function getPosition(position) {
        var longitude = position.coords.longitude;
        var latitude = position.coords.latitude;
        console.log(latitude + " " + longitude);
        latImg = latitude;
        lngImg = longitude;
        sharedProp.setJobLatLng(latImg, lngImg);
      }

      function parseError(error) {
        var msg;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "User denied the request for geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            msg = "The request to get user location timed out.";
            break;
          case error.UNKNOWN_ERROR:
            msg = "An unknown error occurred.";
            break;
        }
        console.log(msg);
      }

      var takePicture = document.querySelector("#take-picture");

      // if (takePicture && showPicture) {
        if (takePicture) {
        // Set events
        takePicture.onchange = function (event) {
          // Get a reference to the taken picture or chosen file
          var files = event.target.files,
            file;
          console.log("files : ", files);
          if (files && files.length > 0) {
            file = files[0];
            // console.log("file : ", file);
            // var imgURL = window.URL.createObjectURL(file);
            // console.log("imgURL : ", imgURL);
            var reader = new FileReader();

            reader.readAsArrayBuffer(file);
            reader.onloadend = function () {

              var exif = EXIF.readFromBinaryFile(reader.result);
              console.log("exif : ",exif);

              // read file again on Blob/Base64 mime type
              var readerImg = new FileReader();
              readerImg.readAsDataURL(file);
              readerImg.onloadend = function () {
                var result = readerImg.result;
                console.log(result);
                $scope.editNotePopupEtcImg(result);
              };
            };
          }
        };
      }


      $scope.editNotePopupEtcImg = function (img64data) {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.etcImgs = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editNotePopupEtcImg.html",
          title: "บันทึกช่วยจำ",
          subTitle: "คำอธิบายสำหรับรูปถ่าย",
          scope: $scope,
          buttons: [
            {
              text: "ไม่บันทึกภาพ",
              onTap: function (e) {},
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
                  $scope.showAlert(
                    "กรุณาใส่บันทึกช่วยจำทุกครั้ง"
                  );
                  event.preventDefault();
                } else {
                  // alert("ready for upload");
                  $scope.btnUpload(imgData);
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


      ($scope.btnUpload = function (fileData) {
        // console.log('btnUpload' + fileData);
        // alert('lat : ' + latImg);
        $scope.showLoading();
        //auto gen ID
        imgName = "etc@" + Date.now();

        var getStamp = new Date();
        var dd = ("0" + getStamp.getDate()).slice(-2);
        var mm = ("0" + (getStamp.getMonth() + 1)).slice(-2);
        var yyyy = getStamp.getFullYear();
        var dateRec = dd + "-" + mm + "-" + yyyy;

        refBMONimg = refStorage.child(imgEtc + imgName + ".jpg");
        refBMONimg.putString(fileData, "base64").then(function (snapshot) {
          //alert("Uploaded Other Photo");
          imgDB.child("etc").push({
            date: dateRec,
            lat: latImg,
            lng: lngImg,
            // user: userEmail,
            name: imgName,
            status: "new",
            type: "etc",
            note: etcPhotoNote,
          });
          setTimeout(function () {
            $scope.hideLoading();
            $scope.showMessage("บันทึกภาพแล้ว");
          }, 1000);
        });
      }),
        function (err) {
          $scope.showAlert(err);
        };




      $scope.showAlert = function (error) {
        var alertPopup = $ionicPopup.alert({
          title:
            '<center><i class="icon ion-error ion-android-warning"></i></center>',
          template: "<center>" + error + "</center>",
          buttons: [
            {
              text: "รับทราบ",
              type: "button-positive",
            },
          ],
        });

        alertPopup.then(function (res) {});
      };

      $scope.showMessage = function (message) {
        var alertPopup = $ionicPopup.alert({
          title: "",
          template: "<center>" + message + "</center>",
          buttons: [
            {
              text: "รับทราบ",
              type: "button-positive",
            },
          ],
        });

        alertPopup.then(function (res) {});
      };

      $scope.showLoading = function () {
        $ionicLoading
          .show({
            content: '<div class="ionic-logo"></div>',
            animation: "fade-in",
            showBackdrop: true,
            maxWidth: 0,
            showDelay: 0,
            // duration: 3000
          })
          .then(function () {
            console.log("The loading indicator is now displayed");
          });
      };

      $scope.hideLoading = function () {
        $ionicLoading.hide().then(function () {
          console.log("The loading indicator is now hidden");
        });
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

      $scope.hideLoading();

      $scope.alertFactory = function (error) {
        switch (error.message) {
          case "The email address is badly formatted.":
            $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
          case "The email address is badly formatted.":
            $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
        }
      };

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      $scope.goBack = function (page) {
        console.log("Going back");
        $location.path(page);
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

      // refLocations.on("value", function(snapshot) {
      //     var snapData=snapshot.val();
      //     $scope.data = snapData;
      //     console.log("snapData : ",snapData);
      // });

      // $scope.queryProv=[]
      // refLocations.orderByChild("province").on("child_added", function(snapshot){
      //   // console.log("data on location : ",snapshot.val());
      //   dataLocateDD = snapshot.val();
      //   if($scope.queryProv.indexOf(dataLocateDD.province) == -1) {
      //      $scope.queryProv.push(dataLocateDD.province);
      //   }
      //   console.log("$scope.queryProv : ",$scope.queryProv);
      // });

      $scope.signOut = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: "ออกจากระบบ",
          template: "<center>คุณต้องการออกจากระบบหรือไม่</center>",
          cancelText: "ยกเลิก",
          okText: "ยืนยัน",
        });
        confirmPopup.then(function (res) {
          if (res) {
            if (firebase.auth().currentUser) {
              firebase.auth().signOut();
              console.log("Now loged out");
              $location.path("/login");
              $scope.userEmail = "";
              $scope.userPass = "";
            } else {
              console.log("Not login login page");
              // $location.path('/login');
            }
          } else {
          }
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
                  front: "blank",
                  right: "blank",
                  back: "blank",
                  left: "blank",
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
          $scope.showAlert("ชื่อจังหวัดซ้ำกับที่มีอยู่แล้ว");
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
          $scope.showAlert("ชื่อพื้นที่ซ้ำกับที่มีอยู่แล้ว");
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
            $scope.showAlert("มีจุดสำรวจนี้อยู่แล้ว");
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
