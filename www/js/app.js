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
      templateUrl:'partial/login.html'
    })
    .state('landing', {
      url:'/landing',
      templateUrl:'partial/landing.html'
    })
    .state('users', {
      url:'/users',
      templateUrl:'partial/manageUsers.html'
    })

  $urlRouterProvider.otherwise('/login')  

})

.controller("loginCtrl", ["$scope", "$firebaseAuth", "$location",
  function($scope, $firebaseAuth, $location) {
    var auth = $firebaseAuth();
    //var userEmail = "tawancharuspisan@gmail.com";
    //var userPass = "tawan1011";

    $scope.signIn = function(user) {
      $scope.firebaseUser = null;
      $scope.error = null;
      var userEmail = $scope.userEmail;
      var userPass = $scope.userPass;
      console.log(user);
      // User is signed in.
      //var emailVerified = user.emailVerified;
      console.log(userEmail+" : "+userPass);

      auth.$signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
        $scope.firebaseUser = user;
        if (user.emailVerified) {
          $location.path('/landing')
        }else{
          alert("รอการอนุมัติ");
        }
      }).catch(function(error) {
        $scope.error = error;
      });
    };

    $scope.signOut = function() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        console.log("Now loged out");
        $scope.userEmail = "";
        $scope.userPass = "";
        //$location.path('/login');
      }else{
        console.log("Not login login page");
        //$location.path('/login');
      }
    };

    $scope.signUp = function(user) {
      $scope.firebaseUser = null;
      $scope.error = null;
      var userEmail = $scope.userEmail;
      var userPass = $scope.userPass;

      auth.$createUserWithEmailAndPassword(userEmail, userPass).then(function(user){
        firebase.auth().currentUser.sendEmailVerification();
      }).catch(function(error) {
        $scope.error = error;
      });

    };

    var initApp = function(){
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          
          if (emailVerified) {
            $location.path('/landing');
          }else{
            //alert("รอการอนุมัติ");
            $('#userEmail').val(email);
            $('#userPass').val("รอการอนุมัติ กรุณาเช็คอีเมล์");
          }
          //$('#loginbt').text('Sign out');
          console.log("Signin Ready : " + email +" Verification : "+emailVerified);
          //console.log(JSON.stringify(user, null, '  '));
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          //document.getElementById('loginbt').textContent = 'Sign in';
          //$('#loginbt').text('Sign in');
          console.log("Still Signout");
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        //document.getElementById('loginbt').disabled = false;
        // [END_EXCLUDE]
      });
    }
    initApp();
  }
])

.controller('landingCtrl', ["$scope", "$firebaseAuth", "$location", function($scope, $firebaseAuth, $location) {
  var auth = $firebaseAuth();
  auth.$onAuthStateChanged((user) => {
    
    $scope.signOut = function(user) {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
        console.log("Now loged out");
        $location.path('/login');
      }else{
        console.log("Not login landing page");
        $location.path('/login');
      }
    };


  }); 
}])

.controller('manageUsersCTRL', ["$scope", "$location", function($scope, $location) {
    $scope.deleteUser = function(data) {

    }; 
}])

;