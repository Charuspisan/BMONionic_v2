// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// Initialize Firebase
// Production
const dbUrl = "https://bmon-41086.firebaseio.com";
const storageUrl = "bmon-41086.appspot.com";
const authUrl = "bmon-v2.firebaseapp.com";
var config = {
  apiKey: "AIzaSyCx-rNzY3vIUrhSCP5WYirhiAss7sFqTuI",
  // authDomain: "bmon-41086.firebaseapp.com",
  authDomain: authUrl,
  databaseURL: dbUrl,
  storageBucket: storageUrl,
  messagingSenderId: "170191502662",
  appId: "1:1034734255535:web:24b02a939a0298e9e5835a"
};

// Dev config
// const dbUrl = "https://bmon-v2-default-rtdb.firebaseio.com";
// const storageUrl = "bmon-v2.appspot.com";
// const authUrl = "bmon-v2.firebaseapp.com";
// var config = {
//   apiKey: "AIzaSyBx5RiQzrpyeFN1HJ-hJDS2qWWmhvk-AZA",
//   authDomain: authUrl,
//   databaseURL: dbUrl,
//   storageBucket: storageUrl,
//   messagingSenderId: "1034734255535",
//   appId: "1:1034734255535:web:24b02a939a0298e9e5835a"
// };


firebase.initializeApp(config);


// const refLocations = new Firebase(dbUrl + "/locations/");
// const refJobsID = new Firebase(dbUrl + "/jobsID/");
// const refJobsRec = new Firebase(dbUrl + "/jobsRec/");
// const refStorage = firebase.storage().ref();
// const imgDB = new Firebase(dbUrl + "/images/");
// const imgEtc = "imgEtc/";

const refLocations = firebase.database().ref("locations/");
const refJobsID = firebase.database().ref("jobsID/");
const refJobsRec = firebase.database().ref("jobsRec/");
const refStorage = firebase.storage().ref();
const imgDB = firebase.database().ref("images/");
const imgEtc = "imgEtc/";

const env = "dev";
let latDevice, lngDevice

angular
  .module("BMON", [
    "ionic",
    "ngCordova",
    "firebase",
    "angular.filter",
    "720kb.datepicker",
    "ui.router",
  ])

  .run(function ($ionicPlatform) {
    if(env == 'prod') {
        console.log = () => {}
    }
    $ionicPlatform.ready(function () {
      firebase.database().ref("AppCtr").once("value").then(function (snapshot) {
        data = snapshot.val();
        console.log("ver : " + data.ver);
      })
    });
  })

  .config( [
      '$compileProvider',
      function( $compileProvider )
      {   
          $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|line|http):/);
          // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
      }
  ])

  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle("center");
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "partial/login.html",
      })
      // .state('admin', {
      //   url:'/admin',
      //   templateUrl:'partial/admin.html'
      // })
      .state("leader", {
        url: "/leader",
        templateUrl: "partial/leader.html",
      })
      .state("getjobs", {
        url: "/getjobs",
        templateUrl: "partial/getjobs.html",
      })
      .state("openform", {
        url: "/openform",
        templateUrl: "partial/openForm.html",
      })
      .state("operation", {
        cache: false,
        url: "/operation",
        templateUrl: "partial/operation.html",
      })
      .state("locations", {
        url: "/locations",
        templateUrl: "partial/locations.html",
        // resolve: {
        //   loadContacts: function (locationDataCon) {
        //     return locationDataCon.promiseToHaveData();
        //   },
        // },
        // controller: function ($scope, locationDataCon) {
        //   $scope.data = locationDataCon.locationData;
        // },
      })
      .state("managejobs", {
        url: "/managejobs",
        templateUrl: "partial/manageJobs.html",
      })
      .state("manageusers", {
        url: "/manageusers",
        templateUrl: "partial/manageUsers.html",
      })
      .state("camera", {
        url: "/camera",
        templateUrl: "partial/camera.html",
      });

    $urlRouterProvider.otherwise("/login");
    // $urlRouterProvider.otherwise("/operation");
    // $urlRouterProvider.otherwise("/managejobs");
  })

  .factory("locationDataCon", function ($firebase, $q) {
    return {
      locationData: null,
      promiseToHaveData: function () {
        var deferred = $q.defer();

        if (this.locationData === null) {
          this.locationData = new Firebase(
            sharedProp.dbUrl() + "/locations/"
          );
          this.locationData.on("value", function (loadedData) {
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      },
    };
  })

  .filter('nospace', function () {
      return function (value) {
          return (!value) ? '' : value.replace(/ /g, '');
      };
  })

  .service("sharedProp", function ($ionicLoading, $ionicPopup, $location, $window) {

    var myService = this;

    this.sharedUserData = {
      email: "Not loged in user or leader/admin",
      isLoginPage: true,
    };

    // this.userData = {yearSetCount: 0};
    this.dbUrl = function () {
      return dbUrl;
    };

    this.rootUrl = function () {
      return window.location.origin;
    };

    myService.storageUrl = function () {
      return storageUrl;
    };

    this.getEmail = function () {
      return this.sharedUserData.email;
    };

    this.setEmail = function (email) {
      this.sharedUserData.email = email;
    };

    this.getPass = function () {
      return this.sharedUserData.pass;
    };

    this.setPass = function (pass) {
      this.sharedUserData.pass = pass;
    };

    this.getIsLoginPage = function () {
      return this.sharedUserData.isLoginPage;
    };

    this.setIsLoginPage = function (isLoginPage) {
      this.sharedUserData.isLoginPage = isLoginPage;
    };

    this.sharedLocateData = {};

    this.setLocateData = function (all, filterProv, filterArea) {
      this.sharedLocateData.all = all;
      this.sharedLocateData.filterProv = filterProv;
      this.sharedLocateData.filterArea = filterArea;
    };

    this.getLocateData = function () {
      return this.sharedLocateData;
    };

    this.sharedJobInfo = {};

    this.setJobInfo = function (
      parentJobId,
      jobId,
      jobPin,
      jobProv,
      jobArea,
      jobDate,
      jobTool,
      jobLocate
    ) {
      this.sharedJobInfo.parentID = parentJobId;
      this.sharedJobInfo.jobId = jobId;
      this.sharedJobInfo.jobPin = jobPin;
      this.sharedJobInfo.jobProv = jobProv;
      this.sharedJobInfo.jobArea = jobArea;
      this.sharedJobInfo.jobDate = jobDate;
      this.sharedJobInfo.jobTool = jobTool;
      this.sharedJobInfo.jobLocate = jobLocate;
    };

    this.setJobTool = function (jobTool) {
      this.sharedJobInfo.jobTool = jobTool;
    };

    this.getJobInfo = function () {
      return this.sharedJobInfo;
    };

    this.getJobTool = function () {
      return this.sharedJobInfo.jobTool;
    };

    this.signOut = function () {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        console.log("Now loged out");
        $location.path("/login");
        // $scope.userEmail = "";
        // $scope.userPass = "";
      } else {
        console.log("Not login login page");
        // $location.path('/login');
      }
    };

    myService.checkChrome = function () {

      var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");

      if (isIOSChrome) {
        console.log("This browser is Chrome on IOS");
        return true;
      } else if (
        isChromium !== null &&
        isChromium !== undefined &&
        vendorName === "Google Inc." &&
        isOpera == false &&
        isIEedge == false
      ) {
        console.log("This browser is Chrome or supported browser");
        return true;
      } else {
        console.log("This browser is Not supported browser");
        return false;
      }
    };

    myService.sharedJobLatLng = { Lat: "1234", Lng: "5678" };

    myService.setJobLatLng = function (jobLat, jobLng) {
      myService.sharedJobLatLng.Lat = jobLat;
      myService.sharedJobLatLng.Lng = jobLng;
      console.log("shared lat : " + myService.sharedJobLatLng.Lat + " shared long : " + myService.sharedJobLatLng.Lng);
    };

    this.getJobLatLng = function () {
      return myService.sharedJobLatLng;
    };
        
    myService.parseError = function (error) {
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
    };


    myService.getCoords = function (exifFromPhoto) {
      // we need to turn degree, min, sec format into decimal
      function DMS2DD(degrees, minutes, seconds, direction) { 
        var minutes = minutes/60;
        var seconds = (seconds/1000000)/3600;
        console.log("minutes : "+minutes);
        console.log("seconds : "+seconds);

        var dd = degrees + minutes + seconds;
        if (direction == "S" || direction == "W") {
          dd = dd * -1; 
        }
        
        console.log("dd : "+dd);
        return dd;
      }

      // the image may not have coordinates
      if (exifFromPhoto.GPSLatitude != null){

        // latitude in decimal
        var latDeg = exifFromPhoto.GPSLatitude[0].numerator;
        var latMin = exifFromPhoto.GPSLatitude[1].numerator;
        var latSec = exifFromPhoto.GPSLatitude[2].numerator;
        var latDir = exifFromPhoto.GPSLatitudeRef;
        var lat = DMS2DD(latDeg, latMin, latSec, latDir);
        console.log("DMS2DD lat :"+lat);
        // 18.86565

        // longitude in decimal
        var lngDeg = exifFromPhoto.GPSLongitude[0].numerator;
        var lngMin = exifFromPhoto.GPSLongitude[1].numerator;
        var lngSec = exifFromPhoto.GPSLongitude[2].numerator;
        var lngDir = exifFromPhoto.GPSLongitudeRef;
        var lng = DMS2DD(lngDeg, lngMin, lngSec, lngDir);
        console.log("DMS2DD lng :"+lng);

        return {lat:lat, lng:lng};
      }
    };

    myService.takePic_fn = (event, callBack)=>{
      // Get a reference to the taken picture or chosen file
      var files = event.target.files,
        file, exif, exifOrigin;

      console.log("files : ", files);
      if (files && files.length > 0) {
        file = files[0];

        // this block for read exif 
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = function () {
          exifOrigin = EXIF.readFromBinaryFile(reader.result);
          if(exifOrigin){
            console.log("exifOrigin : ",exifOrigin);
            exif = myService.getCoords(exifOrigin);
            console.log("exif : ",exif);                
          }else{
            console.log("Not a photo took from camera");
          }
        };

        // this block for read and resize image
        // Create an image
        var img = document.createElement("img");
        var readerImg = new FileReader();
        readerImg.readAsDataURL(file);
        readerImg.onloadend = function (e) {

          img.src = e.target.result;
          // console.log("img.src : ",img.src);

          setTimeout(()=>{
            var canvas = document.createElement("canvas");
            //var canvas = $("<canvas>", {"id":"testing"})[0];
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 1200;
            var MAX_HEIGHT = 1200;
            var width = img.width;
            var height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/png");
            // console.log("dataurl : ",dataurl);
            // document.getElementById('output').src = dataurl;
            
            // $scope.editNotePopupEtcImg(dataurl);
            callBack(dataurl, exif);

          },1000);
        };
      }        
    };

    let currentPinID
    myService.setPinID = function (jodId) {
      currentPinID = jodId;
    };

    myService.btnUpload = function (type, fileData, exif) {
      // console.log('btnUpload' + fileData);
      // alert('lat : ' + latDevice);

      console.log("exif from btnUpload : ",exif);

      myService.showLoading();
      //auto gen ID
      imgName = type.imgName;

      var getStamp = new Date();
      var dd = ("0" + getStamp.getDate()).slice(-2);
      var mm = ("0" + (getStamp.getMonth() + 1)).slice(-2);
      var yyyy = getStamp.getFullYear();
      var dateRec = dd + "-" + mm + "-" + yyyy;
      var latUpload
      var lngUpload
      if(exif){
        latUpload = exif.lat;
        lngUpload = exif.lng;
      }else{
        latUpload = latDevice;
        lngUpload = lngDevice;
      }

      if(type.dataTarget=="4d"){
        refBMONimg = refStorage.child(type.storage + imgName + ".jpg");
        refBMONimg.putString(fileData, "base64").then(function (snapshot) {
          //alert("Uploaded Other Photo");
          imgDB.child(type.dataTarget).push({
            date: dateRec,
            lat: latUpload,
            lng: lngUpload,
            // user: userEmail,
            name: imgName,
            status: "new",
            type: type.type,
            jobRecId: type.jobRecId,
            meta:type.meta
          });
          setTimeout(function () {
            myService.hideLoading();
            myService.showMessage("บันทึกภาพแล้ว");
            refBMONimg.getDownloadURL().then(function (url) {


              if(type.type=="front"){
                // console.log("update img4d on : "+currentPinID);
                refJobsRec.child(currentPinID + "/img4d").update({ front: imgName });
                $("#front_4d_wrapper").css(
                  "background-image",
                  "url('" + url + "')"
                );

              }else if(type.type=="right"){
                refJobsRec.child(currentPinID + "/img4d").update({ right: imgName });
                $("#right_4d_wrapper").css(
                  "background-image",
                  "url('" + url + "')"
                );
              }else if(type.type=="back"){
                refJobsRec.child(currentPinID + "/img4d").update({ back: imgName });
                $("#back_4d_wrapper").css(
                  "background-image",
                  "url('" + url + "')"
                );
              }else if(type.type=="left"){
                refJobsRec.child(currentPinID + "/img4d").update({ left: imgName });
                $("#left_4d_wrapper").css(
                  "background-image",
                  "url('" + url + "')"
                );
              }


            });
          }, 1000);
        });
      }else if(type.dataTarget=="etc"){
        refBMONimg = refStorage.child(type.storage + imgName + ".jpg");
        refBMONimg.putString(fileData, "base64").then(function (snapshot) {
          //alert("Uploaded Other Photo");
          imgDB.child(type.dataTarget).push({
            date: dateRec,
            lat: latUpload,
            lng: lngUpload,
            // user: userEmail,
            name: imgName,
            status: "new",
            type: type.type,
            note: type.note,
          });
          setTimeout(function () {
            myService.hideLoading();
            myService.showMessage("บันทึกภาพแล้ว");
          }, 1000);
        });
      }else if(type.dataTarget=="other"){
        refBMONimg = refStorage.child(type.storage + imgName + ".jpg");
        refBMONimg.putString(fileData, "base64").then(function (snapshot) {
          //alert("Uploaded Other Photo");
          imgDB.child(type.dataTarget).push({
            date: dateRec,
            lat: latUpload,
            lng: lngUpload,
            // user: userEmail,
            name: imgName,
            status: "new",
            type: type.type,
            jobRecId: type.jobRecId,
            meta:type.meta,
            note: type.note,
          });
          setTimeout(function () {
            myService.hideLoading();
            myService.showMessage("บันทึกภาพแล้ว");
          }, 1000);
        });
      }
    };


    myService.showLoading = function () {
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

    myService.showMessage = function (message) {
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

    myService.showAlert = function (error) {
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

    myService.hideLoading = function () {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };

    myService.getDeviceGPS = ()=>{
      if (myService.checkChrome() && window.location.protocol != "https:") {
        console.log("not https may be have problem with chorme");
        setTimeout(() => {
          $window.navigator.geolocation.getCurrentPosition(myService.getPosition, myService.parseError);          
        }, 1000);
      } else {
        setTimeout(() => {
         $window.navigator.geolocation.getCurrentPosition(myService.getPosition, myService.parseError);         
        }, 1000);
      }
    };

    myService.getPosition = (position)=>{
      var longitude = position.coords.longitude;
      var latitude = position.coords.latitude;
      console.log(latitude + " " + longitude);
      latDevice = latitude;
      lngDevice = longitude;
      myService.setJobLatLng(latDevice, lngDevice);
    }





  });
