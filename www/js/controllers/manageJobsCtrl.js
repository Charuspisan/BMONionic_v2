angular
  .module("BMON")

  .controller(
    "manageJobsCtrl",
    function (
      $scope,
      $firebaseObject,
      $firebaseArray,
      $ionicPopup,
      $timeout,
      sharedProp,
      $location,
      $ionicViewService
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

      var shareData = sharedProp.getLocateData();

      $scope.data = shareData.all;
      $scope.queryProv = shareData.filterProv;
      $scope.queryArea = shareData.filterArea;

      console.log("shareData : ", shareData);

      $scope.filterArea = function () {
        console.log("prov : " + $scope.createJobData.provInTxt);
        var queryArea = [];
        prov = $scope.createJobData.provInTxt;
        refLocations
          .orderByChild("province")
          .equalTo(prov)
          .on("value", function (snapshot) {
            // console.log("value : ",value);
            snapshot.forEach(function (childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (queryArea.indexOf(childData.area) == -1) {
                queryArea.push(childData.area);
              }
            });
            $scope.$watch(function () {
              $scope.queryArea = queryArea;
            });
            console.log("$scope.queryArea : " + $scope.queryArea);
          });
      };

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

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      $scope.goBack = function (page) {
        console.log("Going back");
        $location.path(page);
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

      $scope.deleteJob = function (jobIdRef) {
        console.log("Key for delete : " + jobIdRef);
        // query form jobIdRef
        refJobsRec
          .orderByChild("jobIdRef")
          .equalTo(jobIdRef)
          .once("value", function (snapshot) {
            console.log("snapshot : ", snapshot.val());
            //var s=snapshot.val();
            snapshot.forEach(function (childSnapshot) {
              // key will be "ada" the first time and "alan" the second time
              var key = childSnapshot.key();
              // data will be the actual contents of the child
              var data = childSnapshot.val();
              console.log("jobIdKey : ", key);
              refJobsRec.child(key).remove();
            });
          });
        refJobsID.child(jobIdRef).remove();
      };

      var idDelete;
      $scope.showDeleteJob = function ($event, key) {
        $event.stopPropagation();
        idDelete = key;

        var confirmPopup = $ionicPopup.confirm({
          title: "ลบงาน",
          template:
            "<center>คุณต้องการจะลบงานนี้ใช่หรือไม่<br />การลบจะไม่สามารถเรียกคืนข้อมูลได้</center>",
          cancelText: "ยกเลิก",
          okText: "ยืนยัน",
        });

        confirmPopup.then(function (res, id) {
          if (res) {
            console.log("You are sure");
            $scope.deleteJob(idDelete);
          } else {
            console.log("You are not sure");
          }
        });
      };

      $scope.finishedJob = function (jobId) {
        //alert(jobId);
        refJobsID.child(jobId).update({ status: "closed" });
      };

      var jobClosed;

      $scope.showFinishedJob = function ($event, key) {
        jobClosed = key;

        $event.stopPropagation();
        var confirmPopup = $ionicPopup.confirm({
          title: "เสร็จสิ้นงาน",
          template:
            "<center>คุณต้องการจะเสร็จสิ้นงานนี้<br />ใช่หรือไม่</center>",
          cancelText: "ยกเลิก",
          okText: "ยืนยัน",
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log("You are sure");
            $scope.finishedJob(jobClosed);
          } else {
            console.log("You are not sure");
          }
        });
      };

      $scope.editOperDatePopup = function (jobIdRef) {
        console.log("Key for edit date : " + jobIdRef);
        $scope.editOperDateData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editOperDatePopup.html",
          title: "แก้ไขวันที่ปฎิฐัติงาน",
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
          title: "แก้ไขเครื่องมือที่ใช้วัด",
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

      $scope.showCreateJobPopup = function () {
        $scope.createJobData = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          templateUrl: "createJobPopup.html",
          title: "สร้างตารางงานใหม่",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var selectedProv = $scope.createJobData.provInTxt;
                var selectedArea = $scope.createJobData.areaInTxt;
                var selectedDate = $scope.createJobData.operateDateInTxt;
                refLocations
                  .orderByChild("province")
                  .equalTo(selectedProv)
                  .once("value", function (snapshot) {
                    var data = snapshot.val();
                    var matchID = [];
                    //console.log(data);
                    if (
                      !$scope.createJobData.provInTxt ||
                      !$scope.createJobData.areaInTxt
                    ) {
                      //don't allow the user to close unless he enters data
                      alert(
                        "ไม่พบพื้นที่ที่กำหนด กรุณาตรวจสอบหรือแจ้งผู้ดูแลเพื่อเพิ่มพื้นที่สำรวจ"
                      );
                      e.preventDefault();
                    } else {
                      $.each(data, function (key, value) {
                        console.log("key  ", key, "value  ", value);
                        if (
                          value.province == selectedProv &&
                          value.area == selectedArea
                        ) {
                          //var lacateID = key;
                          matchID.push({ id: key, pin: value.pin });
                          //console.log("Selected lacateID ",lacateID);
                        } else {
                          console.log("Not match");
                        }
                      });
                    }
                    console.log(matchID);
                    if (matchID.length > 0) {
                      console.log("Found Matching");
                      var newJob = refJobsID.push({
                        operate_date: selectedDate,
                        province: selectedProv,
                        area: selectedArea,
                        status: "active",
                      });
                      var newJobID = newJob.key();
                      console.log(newJobID);
                      $.each(matchID, function (key, value) {
                        //console.log(value.pin);
                        var newRec = refJobsID
                          .child(newJobID)
                          .push({
                            pin: value.pin,
                            user: "",
                            tool: "",
                            locatRef: value.id,
                          });
                        var newRecID = newRec.key();
                        var time = Firebase.ServerValue.TIMESTAMP;
                        var newSet = {};
                        var graph = [];
                        var note = [];
                        var diff = [];
                        var metaJobRec =
                          selectedProv + "_" + selectedArea + "_" + value.pin;
                        for (i = 0; i < 300; i++) {
                          newSet[i] = "";
                          graph.push("");
                          note.push("");
                          diff.push(0);
                        }
                        // newSet.timeStamp=time;
                        // console.log("timeStamp : ",time);
                        newSet.slope = "";
                        newSet.jobIdRef = newJobID;
                        //var graphTxt = graph.toString();
                        console.log("newSet : ", newSet);
                        console.log("metaJobRec : " + metaJobRec);
                        //console.log("graph : ",graph);
                        //refJobsRec.child(newRecID).update({"timeStamp":time, "slope":"", "jobIdRef":newJobID});
                        refJobsRec.child(newRecID).update(newSet);
                        refJobsRec
                          .child(newRecID)
                          .update({ operate_date: selectedDate });
                        refJobsRec.child(newRecID).update({ timeStamp: time });
                        refJobsRec.child(newRecID).update({ graph: graph });
                        refJobsRec.child(newRecID).update({ diff: diff });
                        refJobsRec.child(newRecID).update({ note: note });
                        refJobsRec.child(newRecID).update({ meta: metaJobRec });
                      });
                      //createRec(newJobID)
                    }
                  });
              },
            },
          ],
        });

        // myPopup.then(function(res) {
        //   console.log('Tapped!', res);
        // });

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
