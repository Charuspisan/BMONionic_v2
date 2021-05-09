// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCx-rNzY3vIUrhSCP5WYirhiAss7sFqTuI",
  authDomain: "bmon-41086.firebaseapp.com",
  //databaseURL: "https://bmon-41086.firebaseio.com",
  storageBucket: "bmon-41086.appspot.com",
  messagingSenderId: "170191502662"
};
firebase.initializeApp(config);

angular.module('BMONadmin', ['ionic','ngCordova','firebase','angular.filter','720kb.datepicker','ui.router'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
})

.config(function($stateProvider, $urlRouterProvider) {  

  $stateProvider
    .state('login', {
      url:'/login',
      templateUrl:'partial/login.html'
    })

    .state('operation', {
      url:'/operation',
      cache: true,
      templateUrl:'partial/operation.html'
      ,
      resolve: {
        loadContacts:  function(locationDataCon) {
          return locationDataCon.promiseToHaveData();
        }  
      },
      controller: function ($scope, locationDataCon) {
          $scope.data = locationDataCon.locationData;
      }
    })

    .state('imgs4d', {
      url:'/imgs4d',
      cache: false,
      templateUrl:'partial/imgs4d.html'
    })

    .state('imgsOther', {
      url:'/imgsOther',
      cache: false,
      templateUrl:'partial/imgsOther.html'
    })

    .state('imgsEtc', {
      url:'/imgsEtc',
      cache: false,
      templateUrl:'partial/imgsEtc.html'
    })

    .state('slope', {
      url:'/slope',
      cache: true,
      templateUrl:'partial/slope.html'
    })

  $urlRouterProvider.otherwise('/login');

})

.factory('locationDataCon', function($firebase, $q) {
  return {
    locationData: null,
    promiseToHaveData: function() {
      var deferred = $q.defer();

      if (this.locationData === null) {
        this.locationData = new Firebase('https://bmon-41086.firebaseio.com/locations/');
        this.locationData.on('value', function(loadedData) {
          deferred.resolve();
        });
      }
      else {
        deferred.resolve();
      }

      return deferred.promise;
    }
  }
})

.service('sharedProp', function () {

  this.sharedUserData = {email:"Not loged in user or leader/admin",isLoginPage:true};

    // this.userData = {yearSetCount: 0};

  this.getEmail = function() {
        return this.sharedUserData.email;
  };

  this.setEmail = function(email) {
        this.sharedUserData.email = email;
  };

  this.getPass = function() {
        return this.sharedUserData.pass;
  };

  this.setPass = function(pass) {
        this.sharedUserData.pass = pass;
  };

  this.getIsLoginPage = function() {
        return this.sharedUserData.isLoginPage;
  };

  this.setIsLoginPage = function(isLoginPage) {
        this.sharedUserData.isLoginPage = isLoginPage;
  };


  this.sharedLocateData = {};

  this.setLocateData = function(all,filterProv,filterArea) {
        this.sharedLocateData.all = all;
        this.sharedLocateData.filterProv = filterProv;
        this.sharedLocateData.filterArea = filterArea;
  };

  this.getLocateData = function() {
        return this.sharedLocateData
  };

  this.signOut = function(){

      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        console.log("Now loged out");
        $location.path('/login');
        $scope.userEmail = '';
        $scope.userPass = '';

      }else{
        console.log("Not login login page");
        // $location.path('/login');
      }

  };


//////////all jobsRecId from filter bar on operation page///////
  this.sharedFilterBar = {};
  this.sharedFilterBar.id = [];
  this.sharedFilterBar.date = [];
  this.filterBarSetResult = function(prov,area,pin,dropdownIndex,date,id) {
        this.sharedFilterBar.prov = prov;
        this.sharedFilterBar.area = area;
        this.sharedFilterBar.pin = pin;

        var index = dropdownIndex-1
        if(date==undefined){
          console.log("undefined");
          this.sharedFilterBar.id[index] = [];
          this.sharedFilterBar.date[index] = [];
        }else{
          console.log("defined");
          this.sharedFilterBar.date[index] = date;
          this.sharedFilterBar.id[index] = id;          
        }

  };
  this.filterBarGetResult = function() {
        return this.sharedFilterBar
  };
  this.filterBarResetDate = function() {
    this.sharedFilterBar.id = [];
    this.sharedFilterBar.date = [];
  };




})
