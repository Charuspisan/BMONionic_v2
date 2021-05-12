angular.module('BMONadmin')

.controller('imgsEtcCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");
  var refImages = new Firebase("https://bmon-41086.firebaseio.com/images/");
  var refStorage = firebase.storage().ref();

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
  // $scope.$on('$viewContentLoaded', function(){
  //   $scope.hideLoading();
  // });

  $scope.goBack = function() {
    console.log('Going back');
    $ionicViewService.getBackView().go();
  }

  $scope.goNext = function(page) {
    console.log('Going to : '+page);
    $location.path(page);
  }

  $scope.signOut = function() {

     var confirmPopup = $ionicPopup.confirm({
       title: "ออกจากระบบ",
       template: "<center>คุณต้องการออกจากระบบหรือไม่</center>",
       cancelText: 'ยกเลิก',
       okText: 'ยืนยัน'
     });
     confirmPopup.then(function(res) {

       if(res) {

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

       } else {

       }
     });

  };

  /*sharedProp.filterBarGetResult();
  console.log("sharedProp.sharedFilterBar : ",sharedProp.sharedFilterBar);*/

  var imgsEtcData

  refImages.child("etc").once("value", function(snapshot) {
    imgsEtcData = snapshot.val();
    return imgsEtcData
  });

  var gotData = setInterval(function(){
    if(imgsEtcData!=undefined){
      console.log("etc img: All images data: ",imgsEtcData);
      $scope.imgsEtc = imgsEtcData;
        $.each($scope.imgsEtc, function(key, val) {
          var refShowImg = refStorage.child("imgEtc/"+$scope.imgsEtc[key]["name"]+".jpg");
          refShowImg.getDownloadURL().then(function(url) {
            $scope.imgsEtc[key]["url"]=url;
            $scope.$apply();
          });  
        })
      genFilter.query();
      console.log("$scope.imgsEtc : ",$scope.imgsEtc);
      clearInterval(gotData);
      //photoInit();
    } 
  }, 500);  

  $scope.imgsEtc = {}
  $scope.queryDateEtc = []
  $scope.queryUserEtc = []
  $scope.selectFilterEtc = []
  var promises = []
  var genFilter = []

  genFilter.query = function(){
    console.log("imgsEtcData count : "+Object.keys(imgsEtcData).length)
    $.each(imgsEtcData,function(index, val) {
      $scope.queryDateEtc.push(val.date);
      $scope.queryUserEtc.push(val.user);
    });
    console.log("etc prov : ",$scope.queryDateEtc+"\n"+"etc user : ",$scope.queryUserEtc+"")
    if(Object.keys($scope.imgsEtc).length<=Object.keys(imgsEtcData).length){
      //alert(Object.keys(imgsEtcData).length);
      $scope.$apply();
    }
  }

  //set defauult for DD box
  $scope.selectFilterEtc.date = "blank";
  $scope.selectFilterEtc.user = "blank";

  $scope.resetDDuser = function(){
    $scope.selectFilterEtc.user = "blank";
  }
  $scope.resetDDdate = function(){
    $scope.selectFilterEtc.date = "blank";
  }

   // An alert dialog
   $scope.popupZoomImg = function(name, url) {
     var alertPopup = $ionicPopup.alert({
       title: name,
       template: "<img src='"+url+"'>",
       buttons: [{
                  type: 'button-positive',
                  text: 'ปิด'
                }]
     });
     alertPopup.then(function(res) {
     });
   };



});







  
