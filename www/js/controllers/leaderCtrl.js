angular
  .module("BMON")

  .controller(
    "leaderCtrl",
    function (
      $scope,
      $firebaseObject,
      $firebaseArray,
      $ionicPopup,
      $timeout,
      sharedProp,
      $location,
      $ionicLoading
    ) {
      console.log("user is : " + sharedProp.getEmail());

      var refLocations = new Firebase(
        "https://bmon-v2-default-rtdb.firebaseio.com/locations/"
      );
      var refJobsID = new Firebase(
        "https://bmon-v2-default-rtdb.firebaseio.com/jobsID/"
      );
      var refJobsRec = new Firebase(
        "https://bmon-v2-default-rtdb.firebaseio.com/jobsRec/"
      );
      var refUsers = new Firebase(
        "https://bmon-v2-default-rtdb.firebaseio.com/users/"
      );

      var objID = $firebaseObject(
        refJobsID.orderByChild("status").equalTo("active")
      );
      var objLocate = $firebaseObject(refLocations);
      var objRec = $firebaseObject(refJobsRec);
      var objUsers = $firebaseObject(refUsers);

      //Check login user by email and pass value to variable
      // $scope.assignedEmail = sharedProp.getEmail();

      refJobsID
        .orderByChild("status")
        .equalTo("active")
        .on("value", function (snapshot) {
          $scope.jobListData = snapshot.val();
          //return $scope.jobListData
        });

      $scope.selectUsers = [];
      refUsers.orderByChild("email").on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          $scope.selectUsers.push(childData.email);
        });
        console.log("$scope.selectUsers", $scope.selectUsers);
      });

      $scope.hideLoading = function () {
        $ionicLoading.hide().then(function () {
          console.log("The loading indicator is now hidden");
        });
      };
      $scope.hideLoading();

      $scope.signOut = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: "ออกจากระบบ",
          template: "<center>คุณต้องการออกจากระบบหรือไม่</center>",
          cancelText: "ยกเลิก",
          okText: "ยืนยัน",
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
          title: "แก้ไขวันที่",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
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

      $scope.editUserPopup = function (jobIdRef, pinIdRef) {
        console.log("Key for edit user : " + pinIdRef);
        $scope.selectedUser = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editUserPopup.html",
          title: "แก้ไขผู้ปฎิบัติงาน",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var newUser = $scope.selectedUser.userDD;
                refJobsID
                  .child(jobIdRef)
                  .child(pinIdRef)
                  .update({ user: newUser });
                console.log(
                  "jobIdRef : ",
                  jobIdRef,
                  "pinIdRef : ",
                  pinIdRef,
                  " newUser : ",
                  newUser
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

      $scope.editToolPopup = function (jobIdRef, pinIdRef) {
        console.log("Key for edit tool : " + pinIdRef);
        $scope.editToolData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editToolPopup.html",
          title: "แก้ไขชนิดของอุปกรณ์การวัด",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
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
