angular
  .module("BMON")

  .controller(
    "leaderCtrl",
    function (
      $scope,
      $ionicPopup,
      $timeout,
      sharedProp,
      $location,
      $ionicLoading
    ) {


      var loginStatus = sharedProp.getEmail();
      console.log("user is : " + loginStatus);

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      if(loginStatus=="Not loged in user or leader/admin"){
        sharedProp.setIsLoginPage(false);
        $scope.goNext("/login");
      }


      var refJobsID = new Firebase(sharedProp.dbUrl() + "/jobsID/");
      var refUsers = new Firebase(
        sharedProp.dbUrl() + "/users/"
      );

      // var objID = $firebaseObject(
      //   refJobsID.orderByChild("status").equalTo("active")
      // );
      // var objLocate = $firebaseObject(refLocations);
      // var objRec = $firebaseObject(refJobsRec);
      // var objUsers = $firebaseObject(refUsers);

      //Check login user by email and pass value to variable
      // $scope.assignedEmail = sharedProp.getEmail();

      refJobsID
        .orderByChild("status")
        .equalTo("active")
        .on("value", function (snapshot) {
          $scope.jobListData = snapshot.val();
          //return $scope.jobListData
          console.log("$scope.jobListData : ",snapshot.val());
        });

      $scope.shareRootURL = sharedProp.rootUrl();


      $scope.copy = (txt)=>{
        var cb = document.getElementById("cb");
        cb.value = txt;
        cb.style.display='block';
        cb.select();
        document.execCommand('copy');
        cb.style.display='none';
      };

    


      // $scope.selectUsers = [];
      // refUsers.orderByChild("email").on("value", function (snapshot) {
      //   snapshot.forEach(function (childSnapshot) {
      //     // key will be "ada" the first time and "alan" the second time
      //     var key = childSnapshot.key;
      //     // childData will be the actual contents of the child
      //     var childData = childSnapshot.val();
      //     $scope.selectUsers.push(childData.email);
      //   });
      //   console.log("$scope.selectUsers", $scope.selectUsers);
      // });

      $scope.hideLoading = function () {
        $ionicLoading.hide().then(function () {
          console.log("The loading indicator is now hidden");
        });
      };
      $scope.hideLoading();

      $scope.signOut = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: "??????????????????????????????",
          template: "<center>?????????????????????????????????????????????????????????????????????????????????</center>",
          cancelText: "??????????????????",
          okText: "??????????????????",
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

      // $scope.deleteJob = function(jobIdRef) {
      //   console.log("Key for delete : "+jobIdRef);
      //   //query form jobIdRef
      //   refJobsRec.orderByChild("jobIdRef").equalTo(jobIdRef).once("value", function(snapshot){
      //     console.log("snapshot : ",snapshot.val());
      //     //var s=snapshot.val();
      //       snapshot.forEach(function(childSnapshot) {
      //           // key will be "ada" the first time and "alan" the second time
      //           var key = childSnapshot.key();
      //           // data will be the actual contents of the child
      //           var data = childSnapshot.val();
      //           console.log("jobIdKey : ",key);
      //           refJobsRec.child(key).remove();
      //       });
      //   });
      //   refJobsID.child(jobIdRef).remove();
      // }

      $scope.editOperDatePopup = function (jobIdRef) {
        console.log("Key for edit date : " + jobIdRef);
        $scope.editOperDateData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editOperDatePopup.html",
          title: "?????????????????????????????????",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "??????????????????" },
            {
              text: "<b>??????????????????</b>",
              type: "button-positive",
              onTap: function (e) {
                var newDate = $scope.editOperDateData.operateDateInTxt;
                refJobsID.child(jobIdRef).update({ operate_date: newDate });
                // console.log("group : ",group);
              },
            },
          ],
        });
        myPopup.then(function () {
          // setTimeout(function(){
          //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
          //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
          // }, 3000);
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };


      

    // modify to shareable URL
      // $scope.editUserPopup = function (jobIdRef, pinIdRef) {
      //   console.log("Key for edit user : " + pinIdRef);
      //   $scope.selectedUser = {};
      //   var myPopup = $ionicPopup.show({
      //     templateUrl: "editUserPopup.html",
      //     title: "??????????????????????????????????????????????????????",
      //     subTitle: "",
      //     scope: $scope,
      //     buttons: [
      //       { text: "??????????????????" },
      //       {
      //         text: "<b>??????????????????</b>",
      //         type: "button-positive",
      //         onTap: function (e) {
      //           var newUser = $scope.selectedUser.userDD;
      //           refJobsID
      //             .child(jobIdRef)
      //             .child(pinIdRef)
      //             .update({ user: newUser });
      //           console.log(
      //             "jobIdRef : ",
      //             jobIdRef,
      //             "pinIdRef : ",
      //             pinIdRef,
      //             " newUser : ",
      //             newUser
      //           );
      //         },
      //       },
      //     ],
      //   });
      //   myPopup.then(function () {
      //     // setTimeout(function(){
      //     //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
      //     //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
      //     // }, 3000);
      //   });
      //   $timeout(function () {
      //     myPopup.close(); //close the popup after 3 seconds for some reason
      //   }, 100000);
      // };


      $scope.editToolPopup = function (jobIdRef, pinIdRef) {
        console.log("Key for edit tool : " + pinIdRef);
        $scope.editToolData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editToolPopup.html",
          title: "???????????????????????????????????????????????????????????????????????????",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "??????????????????" },
            {
              text: "<b>??????????????????</b>",
              type: "button-positive",
              onTap: function (e) {
                var newTool = $scope.editToolData.toolInTxt;
                refJobsID
                  .child(jobIdRef)
                  .child(pinIdRef)
                  .update({ tool: newTool });
                console.log(
                  "jobIdRef : ",
                  jobIdRef,
                  "pinIdRef : ",
                  pinIdRef,
                  " newTool : ",
                  newTool
                );
              },
            },
          ],
        });
        myPopup.then(function () {
          // setTimeout(function(){
          //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
          //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
          // }, 3000);
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      $scope.toggleGroup = function (key, group) {
        if ($scope.isGroupShown(group) || $scope.onEditGroup(key)) {
          //console.log("remove $scope.passShowGroup : ",$scope.passShowGroup);
          $scope.shownGroup = null;
          $scope.passShowGroup = null;
        } else {
          $scope.shownGroup = group;
          $scope.passShowGroup = key;
          //console.log("Set $scope.passShowGroup : ",$scope.passShowGroup);
          return $scope.passShowGroup;
        }
        //console.log("toggleGroup");
      };
      // $scope.isGroupShown = function(group) {
      //   return $scope.shownGroup === group;
      // };
      $scope.isGroupShown = function (group) {
        var checkGroup = $scope.shownGroup === group;
        //console.log("Get group checkGroup : ",group);
        return checkGroup;
      };
      $scope.onEditGroup = function (key) {
        //console.log("Get $scope.passShowGroup : ",$scope.passShowGroup);
        //console.log("Get key onEditGroup : ",key);
        var checkPassGroup = $scope.passShowGroup === key;
        //console.log("checkPassGroup : ",checkPassGroup);
        return checkPassGroup;
      };

      //end controller
    }
  );
