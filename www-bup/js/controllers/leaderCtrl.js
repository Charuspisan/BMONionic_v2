angular.module('BMON')

.controller('leaderCtrl', function($scope, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, sharedProp, $location) {

	console.log("user is : "+sharedProp.getEmail());

  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");

  var objID = $firebaseObject(refJobsID.orderByChild("status").equalTo("active"));
  var objLocate = $firebaseObject(refLocations); 
  var objRec = $firebaseObject(refJobsRec);

  
  //Check login user by email and pass value to variable
  // $scope.assignedEmail = sharedProp.getEmail();

  refJobsID.orderByChild("status").equalTo("active").on("value", function(snapshot){
    $scope.jobListData = snapshot.val();
    //return $scope.jobListData
  });

 
  $scope.deleteJob = function(jobIdRef) {
    console.log("Key for delete : "+jobIdRef);
    //query form jobIdRef
    refJobsRec.orderByChild("jobIdRef").equalTo(jobIdRef).once("value", function(snapshot){
      console.log("snapshot : ",snapshot.val());
      //var s=snapshot.val();
        snapshot.forEach(function(childSnapshot) {           
            // key will be "ada" the first time and "alan" the second time
            var key = childSnapshot.key();
            // data will be the actual contents of the child
            var data = childSnapshot.val();
            console.log("jobIdKey : ",key);
            refJobsRec.child(key).remove();
        });
    });
    refJobsID.child(jobIdRef).remove();
  }

    $scope.editOperDatePopup = function(jobIdRef) {
      console.log("Key for edit date : "+jobIdRef);
      $scope.editOperDateData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editOperDatePopup.html',
        title: 'Edit Operation Date',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
                var newDate=$scope.editOperDateData.operateDateInTxt;
                refJobsID.child(jobIdRef).update({operate_date:newDate});
                // console.log("group : ",group);
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
 
   
    $scope.editUserPopup = function(jobIdRef, pinIdRef) {
      console.log("Key for edit user : "+pinIdRef);
      $scope.editUserData = {};
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
                var newUser=$scope.editUserData.userInTxt;
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
    
    
    $scope.editToolPopup = function(jobIdRef, pinIdRef) {
      console.log("Key for edit tool : "+pinIdRef);
      $scope.editToolData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editToolPopup.html',
        title: 'Edit Tool type',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
                var newTool=$scope.editToolData.toolInTxt;
                refJobsID.child(jobIdRef).child(pinIdRef).update({tool:newTool});
                console.log("jobIdRef : ",jobIdRef, "pinIdRef : ",pinIdRef, " newTool : ",newTool );
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
    

   $scope.showCreateJobPopup = function() {
    $scope.createJobData = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'createJobPopup.html',
      title: 'Create Job',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
              var selectedProv=$scope.createJobData.provInTxt;
              var selectedArea=$scope.createJobData.areaInTxt;
              var selectedDate=$scope.createJobData.operateDateInTxt;
              refLocations.orderByChild("province").equalTo(selectedProv).once("value", function(snapshot) {
                var data=snapshot.val();
                var matchID = [];
                //console.log(data);
                if (!$scope.createJobData.provInTxt||!$scope.createJobData.areaInTxt) {
                  //don't allow the user to close unless he enters data
                  alert("ไม่พบพื้นที่ที่กำหนด กรุณาตรวจสอบหรือแจ้งผู้ดูแลเพื่อเพิ่มพื้นที่สำรวจ");
                  e.preventDefault();
                } else {
                  $.each( data, function( key, value ) {
                    console.log("key  ",key,"value  ",value);
                      if(value.province==selectedProv&&value.area==selectedArea){
                        //var lacateID = key;
                        matchID.push({"id":key,"pin":value.pin});
                        //console.log("Selected lacateID ",lacateID);
                      }else{
                        console.log("Not match");
                      }
                    });
                }
                console.log(matchID);
                if(matchID.length>0){
                  console.log("Found Matching");
                  var newJob = refJobsID.push({"operate_date":selectedDate,"province":selectedProv,"area":selectedArea,"status":"active"});
                  var newJobID = newJob.key();
                  console.log(newJobID);
                  $.each(matchID, function(key, value){
                    //console.log(value.pin);
                    var newRec = refJobsID.child(newJobID).push({"pin":value.pin, "user":"", "tool":"","locatRef":value.id});
                    var newRecID = newRec.key();
                    var time = Firebase.ServerValue.TIMESTAMP;
                    var newSet = {};
                    var graph = [];
                    var note = [];
                    var metaJobRec = selectedProv+'_'+selectedArea+'_'+value.pin;
                    for(i=0; i<100; i++){newSet[i]=""; graph.push(""); note.push("");}
                    // newSet.timeStamp=time;
                    // console.log("timeStamp : ",time);
                    newSet.slope="";
                    newSet.jobIdRef=newJobID;
                    //var graphTxt = graph.toString();
                    console.log("newSet : ",newSet);
                    console.log("metaJobRec : "+metaJobRec);
                    //console.log("graph : ",graph);
                    //refJobsRec.child(newRecID).update({"timeStamp":time, "slope":"", "jobIdRef":newJobID});
                    refJobsRec.child(newRecID).update(newSet);
                    refJobsRec.child(newRecID).update({"timeStamp":time});
                    refJobsRec.child(newRecID).update({"graph":graph});
                    refJobsRec.child(newRecID).update({"note":note});
                    refJobsRec.child(newRecID).update({"meta":metaJobRec});
                  })
                  //createRec(newJobID)
                }
              })
          }
        }
      ]
    });

    // myPopup.then(function(res) {
    //   console.log('Tapped!', res);
    // });

    $timeout(function() {
      myPopup.close(); //close the popup after 3 seconds for some reason
    }, 100000);
  };
  
  
  $scope.toggleGroup = function(key, group) {
    if ($scope.isGroupShown(group)||$scope.onEditGroup(key)) {
      //console.log("remove $scope.passShowGroup : ",$scope.passShowGroup);
      $scope.shownGroup = null;
      $scope.passShowGroup = null;
    } else {
      $scope.shownGroup = group;
      $scope.passShowGroup = key;
      //console.log("Set $scope.passShowGroup : ",$scope.passShowGroup);
      return $scope.passShowGroup
    }
    //console.log("toggleGroup");
  };
  // $scope.isGroupShown = function(group) {
  //   return $scope.shownGroup === group;
  // };
  $scope.isGroupShown = function(group) {
    var checkGroup = $scope.shownGroup === group;
    //console.log("Get group checkGroup : ",group);
    return checkGroup
  };
  $scope.onEditGroup = function(key) {
    //console.log("Get $scope.passShowGroup : ",$scope.passShowGroup);
    //console.log("Get key onEditGroup : ",key);
    var checkPassGroup = $scope.passShowGroup === key;
    //console.log("checkPassGroup : ",checkPassGroup);
    return checkPassGroup
  };

  
  
//end controller  
});















  
