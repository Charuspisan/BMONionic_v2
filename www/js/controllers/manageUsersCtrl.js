angular.module('BMON')

.controller('manageUsersCtrl', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup, $timeout, sharedProp, $location, $ionicHistory) {

	console.log("user is : "+sharedProp.getEmail());

  var auth = $firebaseAuth();
  var ref = new Firebase("https://bmon-41086.firebaseio.com");
  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");
  var refUsers = new Firebase("https://bmon-41086.firebaseio.com/users/");

  var objID = $firebaseObject(refJobsID.orderByChild("status").equalTo("active"));
  var objLocate = $firebaseObject(refLocations); 
  var objRec = $firebaseObject(refJobsRec);
  var objUsers = $firebaseObject(refUsers);


     // // to take an action after the data loads, use the $loaded() promise
     // objUsers.$loaded().then(function() {
     //   // To iterate the key/value pairs of the object, use angular.forEach()
     //   // console.log("objUsers is : ",objUsers);
     //    $scope.dataUsers = objUsers;
     //    console.log("$scope.dataUsers is : ",$scope.dataUsers);
     //   // angular.forEach(objUsers, function(value, key) {
     //   //    console.log("key ", key, "val ", value);
     //   // });

     //   // To make the data available in the DOM, assign it to $scope
     //   //$scope.data = obj;
      
     //   // For three-way data bindings, bind it to the scope instead
     //   //obj.$bindTo($scope, "data");  
       
     //  });

  //Check login user by email and pass value to variable
  // $scope.assignedEmail = sharedProp.getEmail();

  $scope.dataUsers

  refUsers.orderByChild("email").on("value", function(snapshot){
    $scope.dataUsers = snapshot.val();
    //return $scope.jobListData
    console.log("$scope.dataUsers : ",$scope.dataUsers);
  });


  $scope.goNext = function(page) {
    console.log('Going to : '+page);
    $location.path(page);
  }

  $scope.goBack = function() {
    console.log('Going back');
    $ionicHistory.goBack();
  }


  $scope.signOut = function() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      console.log("Now loged out");
      $location.path('/login');
      $scope.userEmail = '';
      $scope.userPass = '';

    }else{
      console.log("Not login login page");
      $location.path('/login');
    }
  };


  $scope.deleteUser = function(uid, email, pass) {
    console.log("uid : "+uid+" email for delete : "+email+" password : "+pass);

      var userEmail = email;
      var userPass = pass;
      var adminEmail = sharedProp.getEmail();
      var adminPass = sharedProp.getPass();
      console.log("adminEmail : "+adminEmail+" adminPass : "+adminPass);

      sharedProp.setIsLoginPage(false);
      var isLogin = sharedProp.getIsLoginPage();
      console.log("From delete user isLogin : "+isLogin);

      auth.$signInWithEmailAndPassword(userEmail, userPass).then(function(user) {
        console.log("login to user want to delete");
          var user = firebase.auth().currentUser;
          user.delete().then(function() {
            refUsers.child(uid).remove();
            console.log("user deleted");
              auth.$signInWithEmailAndPassword(adminEmail, adminPass).then(function(user) {
                console.log("login to admin again");
              }).catch(function(error) {
                $scope.error = error;
              });
          }, function(error) {
            console.log(error);
          });
      }).catch(function(error) {
        $scope.error = error;
      });
    
  }
   







    $scope.editUserPopup = function(jobIdRef, pinIdRef) {
      console.log("Key for edit user : "+pinIdRef);
      $scope.selectedUser = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editUserPopup.html',
        title: 'Edit Recorder',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
                var newUser=$scope.selectedUser.userDD;
                refJobsID.child(jobIdRef).child(pinIdRef).update({user:newUser});
                console.log("jobIdRef : ",jobIdRef, "pinIdRef : ",pinIdRef, " newUser : ",newUser );
            }
          }
        ]
      });
      myPopup.then(function() {
        // setTimeout(function(){
        //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
        //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
        // }, 3000);
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 100000);     
    }
    





  
  
//end controller  
});















  
