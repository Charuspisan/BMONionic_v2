angular
  .module("BMON")

  .controller(
    "getjobsCtrl",
    function (
      $scope,
      $firebaseObject,
      $firebaseArray,
      $ionicPopup,
      $timeout,
      $location,
      $window,
      sharedProp,
      $ionicLoading,
      $cordovaGeolocation
    ) {
      console.log("user is : " + sharedProp.getEmail());

      var refStorage = firebase.storage().ref();
      var imgDB = new Firebase(
        sharedProp.dbUrl() + "/images/"
      );
      var userEmail = sharedProp.getEmail();
      var imgData;
      var imgEtc = "imgEtc/";
      var etcPhotoNote;
      var latImg;
      var lngImg;

      $scope.hideLoading = function () {
        $ionicLoading.hide().then(function () {
          console.log("The loading indicator is now hidden");
        });
      };

      $scope.hideLoading();

      document.addEventListener("deviceready", onDeviceReady, false);

      function onDeviceReady() {
        console.log("navigator.geolocation works well");

        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $cordovaGeolocation.getCurrentPosition(posOptions).then(
          function (position) {
            var lat = position.coords.latitude;
            var long = position.coords.longitude;

            latImg = lat;
            lngImg = long;

            sharedProp.setJobLatLng(latImg, lngImg);
            console.log("shared lat : " + latImg + " shared long : " + lngImg);
          } /*, function(err) {
      console.log(err);
      $scope.showAlert("กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ");
    }*/
        );

        // var watchOptions = {
        //   timeout : 5000,
        //   enableHighAccuracy: false // may cause errors if true
        // };

        // var watch = $cordovaGeolocation.watchPosition(watchOptions);
        // watch.then(
        //   null,
        //   function(err) {
        //     console.log(err);
        //     $scope.showAlert("กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ");
        //   },
        //   function(position) {
        //     var lat  = position.coords.latitude
        //     var long = position.coords.longitude

        //     latImg = lat;
        //     lngImg = long;

        //     sharedProp.setJobLatLng(latImg,lngImg);
        //     console.log("shared lat : "+latImg+" shared long : "+lngImg);

        // });

        // watch.clearWatch();
      }

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

      $scope.showLoading();

      var refLocations = new Firebase(
        sharedProp.dbUrl() + "/locations/"
      );
      var refJobsID = new Firebase(
        sharedProp.dbUrl() + "/jobsID/"
      );
      var refJobsRec = new Firebase(
        sharedProp.dbUrl() + "/jobsRec/"
      );

      $scope.assignedEmail = sharedProp.getEmail();
      $scope.objID;

      refJobsID
        .orderByChild("status")
        .equalTo("active")
        .on("value", function (snapshot) {
          // console.log("value : ",value);
          $scope.objID = snapshot.val();
          $scope.hideLoading();
        });
      // var objID = $firebaseObject(refJobsID.orderByChild("status").equalTo("active"));

      // //Check login user by email and pass value to variable
      // $scope.assignedEmail = sharedProp.getEmail();

      //    // to take an action after the data loads, use the $loaded() promise
      //    objID.$loaded().then(function() {
      //        // To iterate the key/value pairs of the object, use angular.forEach()
      //        $scope.objID = objID;
      //        angular.forEach(objID, function(value, key) {
      //           console.log("key ", key, "val ", value);
      //        });
      //     });

      //parameter is refJobsID which sent to Operation page
      $scope.goPage = function (
        parentJobId,
        refJobsID,
        pin,
        prov,
        area,
        date,
        tool,
        locate
      ) {
        sharedProp.setJobInfo(
          parentJobId,
          refJobsID,
          pin,
          prov,
          area,
          date,
          tool,
          locate
        );
        $scope.showLoading();
        $location.path("/operation");
        // $window.open('zoBPgN?'+refJobsID+'?'+pin+'?'+prov+'?'+area+'?'+date+'?'+tool);
        //console.log("refJobsID : "+refJobsID);
        // var data = getJobInfo();
        // alert(data.prov);
      };

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

      $scope.btnEtcImg = function (bt) {
        console.log("latImg : " + latImg + " : lngImg : " + lngImg);
        if (latImg == undefined || lngImg == undefined) {
          $scope.showAlert(
            "กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ"
          );
        } else {
          // This iOS/Android only example requires the dialog and the device plugin as well.
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 800,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
          });
        }
      };

      function onSuccess(result) {
        // alert("onSuccess callback");
        // alert("btnWhere : "+btnWhere);

        // convert JSON string to JSON Object
        var thisResult = JSON.parse(result);
        console.log("thisResult : " + thisResult);

        // convert json_metadata JSON string to JSON Object
        var metadata = JSON.parse(thisResult.json_metadata);

        upImgData = JSON.stringify(metadata);
        filePath = thisResult.filename;

        console.log("filePath : " + filePath);

        // Convert image
        getFileContentAsBase64(filePath, function (base64Image) {
          //window.open(base64Image);
          console.log("Convert to Base64 : " + base64Image);
          // Then you'll be able to handle the myimage.png file as base64
          imgData = base64Image.split(",")[1];
        });

        $scope.editNotePopup();
      }

      function onFail(message) {
        //alert('Failed because: ' + message);
        $scope.showAlert(message);
        //alert(btnCamera);
      }

      $scope.viewExif = function () {
        console.log("viewExif : " + upImgData);
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
          imgDB
            .child("etc")
            .push({
              date: dateRec,
              lat: latImg,
              lng: lngImg,
              user: userEmail,
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

      $scope.editNotePopup = function () {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.etcImgs = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editNotePopup.html",
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
                    "กรุณาถ่ายภาพอีกครั้ง และจำเป็นต้องใส่บันทึกช่วยจำทุกครั้ง"
                  );
                } else {
                  $scope.btnUpload(imgData);
                }
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      /**
       * This function will handle the conversion from a file to base64 format
       *
       * @path string
       * @callback function receives as first parameter the content of the image
       */
      function getFileContentAsBase64(path, callback) {
        window.resolveLocalFileSystemURL(path, gotFile, fail);

        function fail(e) {
          alert("Cannot found requested file");
        }

        function gotFile(fileEntry) {
          fileEntry.file(function (file) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
              var content = this.result;
              callback(content);
            };
            // The most important point, use the readAsDatURL Method from the file plugin
            reader.readAsDataURL(file);
          });
        }
      }
    }
  );
