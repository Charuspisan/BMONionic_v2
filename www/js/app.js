// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAT2zGRp1nxRNbozq8RXoAprelLBSJXeLw",
  authDomain: "project-3351723142096034396.firebaseapp.com",
  databaseURL: "https://project-3351723142096034396.firebaseio.com",
  storageBucket: "project-3351723142096034396.appspot.com",
  messagingSenderId: "765512598560"
};

firebase.initializeApp(config);

angular.module('BMON', ['ionic','firebase'])

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
      templateUrl:'templates/login.html'
    })
    .state('landing', {
      url:'/landing',
      templateUrl:'templates/landing.html'
    })

  $urlRouterProvider.otherwise('/login')  

})

.controller("loginCtrl", ["$scope", "$firebaseAuth",
  function($scope, $firebaseAuth) {
    var auth = $firebaseAuth();
    //var userEmail = "tawancharuspisan@gmail.com";
    //var userPass = "tawan1011";

    $scope.signIn = function() {
      $scope.firebaseUser = null;
      $scope.error = null;
      var userEmail = $scope.userEmail;
      var userPass = $scope.userPass;
      console.log(userEmail+" : "+userPass);
      auth.$signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
        $scope.firebaseUser = user;
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);