angular
  .module("BMON")

  .controller(
    "manageUsersCtrl",
    function (
      $scope,
      $firebaseObject,
      $firebaseArray,
      $firebaseAuth,
      $ionicPopup,
      $timeout,
      sharedProp,
      $location,
      $ionicHistory
    ) {
      console.log("user is : " + sharedProp.getEmail());

      var auth = $firebaseAuth();
      var ref = new Firebase('"'+sharedProp.dbUrl()+'"');
      var refLocations = new Firebase(
        sharedProp.dbUrl() + "/locations/"
      );
      var refJobsID = new Firebase(
        sharedProp.dbUrl() + "/jobsID/"
      );
      var refJobsRec = new Firebase(
        sharedProp.dbUrl() + "/jobsRec/"
      );
      var refUsers = new Firebase(
        sharedProp.dbUrl() + "/users/"
      );

      $scope.dataUsers;

      refUsers.on("value", function (snapshot) {
        // $scope.dataUsers = snapshot.val();
        //return $scope.jobListData
        var orderEmail = [];
        snapshot.forEach(function (childSnapshot) {
          // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          orderEmail.push(childData.email);
        });
        // console.log("$scope.dataUsers : ",$scope.dataUsers);
        $scope.dataUsers = orderEmail;
        console.log("$scope.dataUsers : ", $scope.dataUsers);
      });

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      $scope.goBack = function () {
        console.log("Going back");
        $ionicHistory.goBack();
      };

      $scope.signOut = function () {
        if (firebase.auth().currentUser) {
          firebase.auth().signOut();
          console.log("Now loged out");
          $location.path("/login");
          $scope.userEmail = "";
          $scope.userPass = "";
        } else {
          console.log("Not login login page");
          $location.path("/login");
        }
      };

      // $scope.deleteUser = function(uid, email, pass) {
      //   console.log("uid : "+uid+" email for delete : "+email+" password : "+pass);

      //     var userEmail = email;
      //     var userPass = pass;
      //     var adminEmail = sharedProp.getEmail();
      //     var adminPass = sharedProp.getPass();
      //     console.log("adminEmail : "+adminEmail+" adminPass : "+adminPass);

      //     sharedProp.setIsLoginPage(false);
      //     var isLogin = sharedProp.getIsLoginPage();
      //     console.log("From delete user isLogin : "+isLogin);

      //     auth.$signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
      //       console.log("login to user want to delete");
      //         var user = firebase.auth().currentUser;
      //         user.delete().then(function() {
      //           refUsers.child(uid).remove();
      //           console.log("user deleted");
      //             auth.$signInWithEmailAndPassword(adminEmail, adminPass).then(function(user) {
      //               console.log("login to admin again");
      //             }).catch(function(error) {
      //               $scope.error = error;
      //             });
      //         }, function(error) {
      //           console.log(error);
      //         });
      //     }).catch(function(error) {
      //       $scope.error = error;
      //     });

      // }

      // $scope.createUserPopup = function() {
      //   $scope.newUser={};
      //   var myPopup = $ionicPopup.show({
      //     templateUrl: 'createUserPopup.html',
      //     title: 'Create User',
      //     subTitle: '',
      //     scope: $scope,
      //     buttons: [
      //       { text: 'Cancel' },
      //       {
      //         text: '<b>Save</b>',
      //         type: 'button-positive',
      //         onTap: function(){
      //               var userEmail = $scope.newUser.Email;
      //               var userPass = $scope.newUser.Pass;

      //               console.log("userEmail : "+userEmail);
      //               console.log("userPass : "+userPass);

      //               auth.$createUserWithEmailAndPassword(userEmail, userPass).then(function(user){
      //                 firebase.auth().currentUser.sendEmailVerification();
      //                 // console.log("user.uid : "+user.uid);
      //                 //rec to db
      //                 refUsers.child(user.uid).set({
      //                   //username: name,
      //                   email:userEmail,
      //                   password:userPass,
      //                   role:"user",
      //                   regisDate:Date.now(),
      //                   lastAccess:Date.now(),
      //                 });
      //               })
      //             }
      //       }
      //     ]
      //   });
      //   myPopup.then(function() {
      //     // setTimeout(function(){
      //     //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
      //     //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
      //     // }, 3000);
      //   });
      //   $timeout(function() {
      //     myPopup.close(); //close the popup after 3 seconds for some reason
      //   }, 100000);
      // }

      //end controller
    }
  );
