// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// Initialize Firebase
// Production
// const dbUrl = "https://bmon-41086.firebaseio.com";
// var config = {
//   apiKey: "AIzaSyCx-rNzY3vIUrhSCP5WYirhiAss7sFqTuI",
//   authDomain: "bmon-41086.firebaseapp.com",
//   databaseURL: dbUrl,
//   storageBucket: "bmon-41086.firebaseapp.com",
//   messagingSenderId: "170191502662",
// };
// Dev config
const dbUrl = "https://bmon-v2-default-rtdb.firebaseio.com";
const storageUrl = "bmon-v2.appspot.com";
const authUrl = "bmon-v2.firebaseapp.com";
var config = {
  apiKey: "AIzaSyBx5RiQzrpyeFN1HJ-hJDS2qWWmhvk-AZA",
  authDomain: authUrl,
  databaseURL: dbUrl,
  storageBucket: storageUrl,
  messagingSenderId: "170191502662",
};
firebase.initializeApp(config);

const env = "dev";

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

      /*var AppVer = "0.0.5";

      firebase
        .database()
        .ref("AppCtr")
        .once("value")
        .then(function (snapshot) {
          data = snapshot.val();
          console.log("ver : " + data.ver);
          console.log(
            "AppVer : " + AppVer
          ); else if(AppVer>data.ver){
          alert("ขออภัยแอพพริเคชั่นอยู่ระหว่างการปรับปรุง กรุณารอการแจ้งเตือนการอัพเดทจาก App Store (ios), Play Store (Android) อัพเดทแอพพริเคชั่น และลองเข้าใช้งานอีกครั้ง");
          window.open('https://play.google.com/store/apps/details?id=com.bmon_ku.bmon', '_system'); 
          ionic.Platform.exitApp();
      }
          if (AppVer < data.ver) {
            if (data.forceUpdate == true) {
              alert(
                "แอพพริเคชั่นนี้มีการอัพเดทรุ่น กรุณาอัพเดทจาก App Store (ios), Play Store (Android) และลองเข้าใช้งานอีกครั้ง"
              );
              window.open(
                "https://play.google.com/store/apps/details?id=com.bmon_ku.bmon",
                "_system"
              );
              ionic.Platform.exitApp();
            }
          } 
        });*/

      // if (window.cordova && window.cordova.plugins.Keyboard) {
      //   // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      //   // for form inputs)
      //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      //   // Don't remove this line unless you know what you are doing. It stops the viewport
      //   // from snapping when text inputs are focused. Ionic handles this internally for
      //   // a much nicer keyboard experience.
      //   cordova.plugins.Keyboard.disableScroll(true);
      // }
      // if (window.StatusBar) {
      //   StatusBar.styleDefault();
      // }
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

  .service("sharedProp", function () {
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

    this.storageUrl = function () {
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
        $scope.userEmail = "";
        $scope.userPass = "";
      } else {
        console.log("Not login login page");
        // $location.path('/login');
      }
    };

    this.checkChrome = function () {

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

    this.sharedJobLatLng = { Lat: "1234", Lng: "5678" };

    this.setJobLatLng = function (jobLat, jobLng) {
      this.sharedJobLatLng.Lat = jobLat;
      this.sharedJobLatLng.Lng = jobLng;
      console.log("shared lat : " + this.sharedJobLatLng.Lat + " shared long : " + this.sharedJobLatLng.Lng);
    };

    this.getJobLatLng = function () {
      return this.sharedJobLatLng;
    };
        
    this.parseError = function (error) {
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

  });
