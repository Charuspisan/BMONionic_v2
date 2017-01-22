angular.module('BMON')

.controller('loginCtrl', function($scope, $firebaseAuth, $location, sharedProp, $ionicLoading) {

    var auth = $firebaseAuth();

    var usersDB = new Firebase("https://bmon-41086.firebaseio.com/users/");
    var isLogin = sharedProp.getIsLoginPage();
    console.log("isLogin : "+isLogin);

    $scope.showLoading = function() {
      $ionicLoading.show({     
        content: '<div class="ionic-logo"></div>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 0,
        showDelay: 0
        // duration: 3000
      }).then(function(){
         console.log("The loading indicator is now displayed");
      });
    };

    $scope.hideLoading = function(){
      $ionicLoading.hide().then(function(){
         console.log("The loading indicator is now hidden");
      });
    };

    $scope.$on('$viewContentLoaded', function(){
      $scope.hideLoading();
    });

    $scope.showLoading();


    $scope.signIn = function(user) {
      $scope.firebaseUser = null;
      $scope.error = null;
      var userEmail = $scope.userEmail;
      var userPass = $scope.userPass;
      $scope.showLoading();

      auth.$signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
      }).catch(function(error) {
        $scope.error = error;
      });
    };


    $scope.signOut = function() {
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

    $scope.signUp = function(user) {
      $scope.firebaseUser = null;
      $scope.error = null;
      var userEmail = $scope.userEmail;
      var userPass = $scope.userPass;

      auth.$createUserWithEmailAndPassword(userEmail, userPass).then(function(user){
        

        firebase.auth().currentUser.sendEmailVerification();
        // console.log("user.uid : "+user.uid);
        //rec to db
        usersDB.child(user.uid).set({
          //username: name,
          email:userEmail,
          password:userPass,
          role:"user",
          regisDate:Date.now(),
          lastAccess:Date.now(),
        });


      }).catch(function(error) {
        $scope.error = error;
      });

    };

    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {


        sharedProp.setPass($scope.userPass);

        $("#userPass").val("");

        $scope.firebaseUser = user;

        var isLogin = sharedProp.getIsLoginPage();
        console.log("isLogin : "+isLogin);

        if(user!=null){
          if (user.emailVerified) {
          
            usersDB.child(user.uid).once("value", function(snap){
              var data = snap.val();

                if(data.role=="admin"&&isLogin!=false){ 
                  $scope.$apply(function(){
                    sharedProp.setEmail(user.email);
                    usersDB.child(user.uid).update({lastAccess:Date.now(),});
                    $scope.hideLoading();
                    $location.path('/locations');
                  });
                  console.log("admin");
                }else if(data.role=="leader"&&isLogin!=false){
                  $scope.$apply(function(){
                    sharedProp.setEmail(user.email);
                    usersDB.child(user.uid).update({lastAccess:Date.now(),});
                    $scope.hideLoading();
                    $location.path('/leader');
                  });                 
                }else if(data.role=="user"&&isLogin!=false){
                  //pass email to next page
                  sharedProp.setEmail(user.email);
                  setTimeout(function(){
                    $scope.$apply(function(){
                      usersDB.child(user.uid).update({lastAccess:Date.now(),}); 
                      $scope.hideLoading();
                      $location.path('/getjobs');
                    });
                    console.log("getjobs");
                  }, 500);
                };
            });
          }else{
            console.log("รอการอนุมัติ กรุณาเช็คอีเมล์")
            $scope.hideLoading();
            $('#statusReg').html("รอการอนุมัติ กรุณาเช็คอีเมล์");   
            usersDB.child(user.uid).update({lastAccess:Date.now(),});
          }    


        }else{
          $scope.hideLoading();
          $('#statusReg').html("กรุณาล็อกอิน");
        }


    });



  });















  
