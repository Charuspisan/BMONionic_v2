angular.module('BMON')

.controller('cameraController',function ($scope, $firebaseObject, $firebaseArray, $cordovaGeolocation, $ionicViewService, sharedProp, $ionicSlideBoxDelegate, $location, $ionicLoading) {

    // // Initialize Firebase
    // var config = {
    //   apiKey: "AIzaSyCx-rNzY3vIUrhSCP5WYirhiAss7sFqTuI",
    //   // authDomain: "bmon-41086.firebaseapp.com",
    //   // databaseURL: "https://bmon-41086.firebaseio.com",
    //   storageBucket: "bmon-41086.appspot.com",
    //   messagingSenderId: "170191502662"
    // };
    // firebase.initializeApp(config);

    var userEmail = sharedProp.getEmail();
    var jobInfo = sharedProp.getJobInfo();
    var lacateID = jobInfo.jobLocate;
    var refStorage = firebase.storage().ref();
    var imgDB = new Firebase("https://bmon-41086.firebaseio.com/images/");
    var imgOnLocate = new Firebase("https://bmon-41086.firebaseio.com/locations/"+lacateID+"/imgs/");
    var imgFolder = "bmon-img/";
    var imgName
    var jobsRecMeta
    var metaImg
    var refBMONimg
    var upImgData
    var fileName
    var btnWhere
    var latImg
    var lngImg

  // alert("userEmail : "+userEmail);  

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude

      latImg = lat;
      lngImg = long;

      sharedProp.setJobLatLng(latImg,lngImg);
      // alert("shared lat : "+latImg+" shared long : "+lngImg);  

    }, function(err) {
      // error
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude

      latImg = lat;
      lngImg = long;

      sharedProp.setJobLatLng(latImg,lngImg);
      // alert("shared lat : "+latImg+" shared long : "+lngImg);  
      
  });


  watch.clearWatch();

  $scope.goBack = function() {
    console.log('Going back');
    $ionicViewService.getBackView().go();
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
      // $location.path('/login');
    }
  };


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

    $scope.showLoading();  



$scope.btnCamera = function(bt){

  // This iOS/Android only example requires the dialog and the device plugin as well.
  if(btnWhere!=undefined){
    navigator.camera.getPicture(onSuccess, onFail, { 

      quality : 80,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 560,
      targetHeight: 560,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false 

    });
  }else{
    alert("กรุณาเลือกตำแหน่งภาพที่จะถ่าย");
  }  
  //alert("bt : "+bt);
  // btnWhere = bt;
}

function onSuccess(result) {

  
  // alert("btnWhere : "+btnWhere);

   // convert JSON string to JSON Object
   var thisResult = JSON.parse(result);

   // convert json_metadata JSON string to JSON Object 
   var metadata = JSON.parse(thisResult.json_metadata);

   upImgData = JSON.stringify(metadata);
   fileName = thisResult.filename

    //var image = document.getElementById('myImage');
    //image.src = "data:image/jpeg;base64," + fileName

    // alert(upImgData);

    // if (thisResult.json_metadata != "{}") {
    //     if ((device.platform) == 'iOS') {

    //       // notice the difference in the properties below and the format of the result when you run the app.
    //       // iOS and Android return the exif and gps differently and I am not converting or accounting for the Lat/Lon reference.
    //       // This is simply the raw data being returned.

    //           alert('Lat: '+metadata.GPS.Latitude+' Lon: '+metadata.GPS.Longitude);
    //         } else {
    //           alert('Lat: '+metadata.gpsLatitude+' Lon: '+metadata.gpsLongitude);
    //           alert('Date: '+metadata.datetime);
    //         }
    //     }

    $scope.btnUpload();
  }

function onFail(message) {
    alert('Failed because: ' + message);
}

$scope.viewExif = function(){
      // alert("viewExif : "+upImgData);
}



$scope.btnGallery = function(){
  console.log('btnGallery');
  // alert("btnGallery");

  navigator.camera.getPicture(onSuccess, onFail, { 

      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false 

    });

}

// function btnUpload(){
$scope.btnUpload = function(){
  // alert('btnUpload' + fileName);
  $scope.showLoading();
  //auto gen ID
  jobsRecMeta = jobInfo.jobProv+"_"+jobInfo.jobArea+"_"+jobInfo.jobPin;
  metaImg = btnWhere+"_"+jobsRecMeta;
  imgName = metaImg+"@"+Date.now();


  refBMONimg = refStorage.child(imgFolder+imgName+".jpg");
  // Base64url formatted string
  // var metaData = {
  //   contentType: 'image/jpeg'
  // };
  refBMONimg.putString(fileName, 'base64').then(function(snapshot) {

    // alert("userEmail : "+userEmail); 

    imgDB.push({"date":Date.now(),"lat":latImg,"lng":lngImg,"user":userEmail,"meta":metaImg,"name":imgName,"status":"new","type":btnWhere});

    var refShowImg = refStorage.child(imgFolder+imgName+".jpg");

    setTimeout(function(){
      if(btnWhere=='front'){
          imgOnLocate.update({"front":imgName});
          // alert('Uploaded front : '+imgName);
          alert("บันทึกภาพแล้ว");
          refShowImg.getDownloadURL().then(function(url) {
            frontImg = imgName;
            $("#frontImg").attr("src",url);
            $("#show4imgs").css("background-image","url('"+url+"')");
            $scope.hideLoading();
          });
      }else if(btnWhere=='right'){
          imgOnLocate.update({"right":imgName});
          // alert('Uploaded right : '+imgName);
          alert("บันทึกภาพแล้ว");
          refShowImg.getDownloadURL().then(function(url) {
            rightImg = imgName;
            $("#rightImg").attr("src",url);
            $("#show4imgs").css("background-image","url('"+url+"')");
            $scope.hideLoading();
          });
      }else if(btnWhere=='back'){
          imgOnLocate.update({"back":imgName});
          // alert('Uploaded back : '+imgName);
          alert("บันทึกภาพแล้ว");      
          refShowImg.getDownloadURL().then(function(url) {
            backImg = imgName;
            $("#backImg").attr("src",url);
            $("#show4imgs").css("background-image","url('"+url+"')");
            $scope.hideLoading();
          });
      }else if(btnWhere=='left'){
          imgOnLocate.update({"left":imgName});
          // alert('Uploaded left : '+imgName);
          alert("บันทึกภาพแล้ว");
          refShowImg.getDownloadURL().then(function(url) {
            leftImg = imgName;
            $("#leftImg").attr("src",url);
            $("#show4imgs").css("background-image","url('"+url+"')");
            $scope.hideLoading();
          });
      };
    }, 2500); 

  },function(err){alert(err)});


}

  var frontImg
  var rightImg
  var backImg
  var leftImg
  var imgPre

  // init preview with blank on start
  // refStorage.child(imgFolder+frontImg+".jpg").getDownloadURL().then(function(url) {
  //   $("#show4imgs").css("background-image","url('"+url+"')");
  // });

  $scope.btnPreview = function(pos){
    btnWhere = pos;
    if(pos=="front"){
      var refPreImg = refStorage.child(imgFolder+frontImg+".jpg");
      refPreImg.getDownloadURL().then(function(url) {
        $("#show4imgs").css("background-image","url('"+url+"')");
      });
    }else if(pos=="right"){
      var refPreImg = refStorage.child(imgFolder+rightImg+".jpg");
      refPreImg.getDownloadURL().then(function(url) {
        $("#show4imgs").css("background-image","url('"+url+"')");
      });
    }else if(pos=="back"){
      var refPreImg = refStorage.child(imgFolder+backImg+".jpg");
      refPreImg.getDownloadURL().then(function(url) {
        $("#show4imgs").css("background-image","url('"+url+"')");
      });
    }else if(pos=="left"){
      var refPreImg = refStorage.child(imgFolder+leftImg+".jpg");
      refPreImg.getDownloadURL().then(function(url) {
        $("#show4imgs").css("background-image","url('"+url+"')");
      });
    };
  }  


  $scope.btnOtherImg = function(){
    // $("#otherImgContainer").show();
    // $ionicSlideBoxDelegate.next();
    $location.path('/otherPhoto');
  }



  // console.log("lacateID : "+lacateID);
  var imgLocateData = new Firebase("https://bmon-41086.firebaseio.com/locations/"+lacateID+"/imgs/");
  imgLocateData.once("value", function(snap){
    var data = snap.val();
    console.log("imgLocateData : ",data);
    frontImg = data.front;
    rightImg = data.right;
    backImg = data.back;
    leftImg = data.left;
    // console.log("frontImg : "+frontImg);

    initImg(frontImg,rightImg,backImg,leftImg);

  })

  var imgsNum = 0;
  // Get the download URL
  function initImg(frontImg,rightImg,backImg,leftImg){
  console.log("frontImg : "+frontImg);
  var refFrontImg = refStorage.child(imgFolder+frontImg+".jpg");
  var refRightImg = refStorage.child(imgFolder+rightImg+".jpg");
  var refBackImg = refStorage.child(imgFolder+backImg+".jpg");
  var refLeftImg = refStorage.child(imgFolder+leftImg+".jpg");

    refFrontImg.getDownloadURL().then(function(url) {
      console.log(url);
      $("#frontImg").attr("src",url);
      imgsNum = imgsNum+1;
    });
    refRightImg.getDownloadURL().then(function(url) {
      console.log(url);
      $("#rightImg").attr("src",url);
      imgsNum = imgsNum+1;
    });
    refBackImg.getDownloadURL().then(function(url) {
      console.log(url);
      $("#backImg").attr("src",url);
      imgsNum = imgsNum+1;
    });
    refLeftImg.getDownloadURL().then(function(url) {
      console.log(url);
      $("#leftImg").attr("src",url);
      imgsNum = imgsNum+1;
    });
  };

  var checkLoaded = setInterval(imgs4loaed, 1000);

  function imgs4loaed() {
      if(imgsNum==4){
        clearInterval(checkLoaded);
        $scope.hideLoading();
        console.log("4 imgs loaded");
      }
  } 


})
