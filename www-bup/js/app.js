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

angular.module('BMON', ['ionic','ngCordova','firebase','angular.filter','chart.js'])

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


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url:'/login',
      templateUrl:'partial/login.html'
    })
    .state('admin', {
      url:'/admin',
      templateUrl:'partial/admin.html'
    })
    .state('leader', {
      url:'/leader',
      templateUrl:'partial/leader.html'
    })
    .state('getjobs', {
      url:'/getjobs',
      templateUrl:'partial/getjobs.html'
    })
    .state('operation', {
      url:'/operation',
      templateUrl:'partial/operation.html'
    })
    .state('locations', {
      url:'/locations',
      templateUrl:'partial/locations.html'
    })
    .state('otherPhoto', {
      url:'/otherPhoto',
      templateUrl:'partial/otherPhoto.html'
    })

  $urlRouterProvider.otherwise('/login')  

})

.service('sharedProp', function () {

  this.sharedUserData = {email:"Not loged in user or leader/admin"};

    // this.userData = {yearSetCount: 0};

  this.getEmail = function() {
        return this.sharedUserData.email;
  };

  this.setEmail = function(email) {
        this.sharedUserData.email = email;
  };

  this.sharedJobInfo = {};

  this.setJobInfo = function(jobId,jobPin,jobProv,jobArea,jobDate,jobTool,jobLocate) {
        this.sharedJobInfo.jobId = jobId;
        this.sharedJobInfo.jobPin = jobPin;
        this.sharedJobInfo.jobProv = jobProv;
        this.sharedJobInfo.jobArea = jobArea;
        this.sharedJobInfo.jobDate = jobDate;
        this.sharedJobInfo.jobTool = jobTool;
        this.sharedJobInfo.jobLocate = jobLocate;
  };

  this.getJobInfo = function() {
        return this.sharedJobInfo
  };

  this.sharedJobLatLng = {Lat:"1234",Lng:"5678"};

  this.setJobLatLng = function(jobLat,jobLng) {
        this.sharedJobLatLng.Lat = jobLat;
        this.sharedJobLatLng.Lng = jobLng;
  };

  this.getJobLatLng = function() {
        return this.sharedJobLatLng
  };




})



;