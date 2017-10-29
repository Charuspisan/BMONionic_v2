angular.module('BMON')

.controller('cameraController',function ($scope, $firebaseObject, $firebaseArray, $cordovaGeolocation, $ionicViewService, $ionicPopup, sharedProp, $ionicSlideBoxDelegate, $location, $ionicLoading) {

    // // Initialize Firebase
    // var config = {
    //   apiKey: "AIzaSyCx-rNzY3vIUrhSCP5WYirhiAss7sFqTuI",
    //   // authDomain: "bmon-41086.firebaseapp.com",
    //   // databaseURL: "https://bmon-41086.firebaseio.com",
    //   storageBucket: "bmon-41086.appspot.com",
    //   messagingSenderId: "170191502662"
    // };
    // firebase.initializeApp(config);
    var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");
    var userEmail = sharedProp.getEmail();
    var jobInfo = sharedProp.getJobInfo();
    var lacateID = jobInfo.jobLocate;
    var refStorage = firebase.storage().ref();
    var imgDB = new Firebase("https://bmon-41086.firebaseio.com/images/");
    var imgOnLocate = new Firebase("https://bmon-41086.firebaseio.com/locations/"+lacateID+"/imgs/");
    var imgFolder = "img4d/";
    var imgOther = "imgOther/";
    var imgName
    var imgData
    var otherPhotoNote
    var jobsRecMeta
    var metaImg
    var refBMONimg
    var upImgData
    var filePath
    var fileName
    var btnWhere
    var latImg
    var lngImg

  // alert("userEmail : "+userEmail);  

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  
    console.log("navigator.geolocation works well");

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude

      latImg = lat;
      lngImg = long;

      sharedProp.setJobLatLng(latImg,lngImg);
      console.log("shared lat : "+latImg+" shared long : "+lngImg);  

    }/*, function(err) {
      console.log(err);
      $scope.showAlert("กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ");
    }*/);


  // var watchOptions = {
  //   timeout : 10000,
  //   enableHighAccuracy: false // may cause errors if true
  // };

  // var watch = $cordovaGeolocation.watchPosition(watchOptions);
  // watch.then(
  //   null,
  //   function(err) {
  //     console.log(err);
  //     $scope.showAlert("กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ");
  //   },
  //   function(position) {
  //     var lat  = position.coords.latitude
  //     var long = position.coords.longitude

  //     latImg = lat;
  //     lngImg = long;

  //     sharedProp.setJobLatLng(latImg,lngImg);
  //     console.log("shared lat : "+latImg+" shared long : "+lngImg);  
      
  // });


  // watch.clearWatch();    
}




    // An alert dialog
   $scope.showAlert = function(error) {
     var alertPopup = $ionicPopup.alert({
       title: '<center><i class="icon ion-error ion-android-warning"></i></center>',
       template: '<center>'+error+'</center>',
       buttons: [{
          text: 'รับทราบ',
          type: 'button-positive'
        }]       
        
     });

     alertPopup.then(function(res) {
       
     });
   };

   $scope.alertFactory = function(error) {
      switch(error.message) {
          case "The email address is badly formatted.":
              $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
              break;
          case "The email address is badly formatted.":
              $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
              break;
      }

   }

       // An alert dialog
   $scope.showMessage = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: '',
       template: '<center>'+message+'</center>',
       buttons: [{
          text: 'รับทราบ',
          type: 'button-positive'
        }]       
        
     });

     alertPopup.then(function(res) {
       
     });
   };


  $scope.goBack = function() {
    console.log('Going back');
    $ionicViewService.getBackView().go();
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

console.log("latImg : "+latImg+" : lngImg : "+lngImg);
 if(latImg==undefined||lngImg==undefined){
    $scope.showAlert("กรุณาเปิด GPS มิฉะนั้นแอพริเคชั่นจะเกิดปัญหา และไม่สามารถบันทึกรูปถ่ายได้ หากเปิด GPS แล้วยังปรากฎข้อความนี้อีก กรุณารีสตาร์ทมือถือของคุณ"); 
 }else{
    // This iOS/Android only example requires the dialog and the device plugin as well.
    if(btnWhere!=undefined){
      navigator.camera.getPicture(onSuccess, onFail, { 

        quality : 80,
        destinationType : Camera.DestinationType.FILE_URI,
        sourceType : Camera.PictureSourceType.CAMERA,
        allowEdit : false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false 

      });
    }else{
      //alert("กรุณาเลือกตำแหน่งภาพที่จะถ่าย");
      $scope.showAlert("กรุณาเลือกตำแหน่งภาพที่จะถ่าย");
    }
  }    
}

function onSuccess(result) {

  // alert("onSuccess callback");
  // alert("btnWhere : "+btnWhere);

   // convert JSON string to JSON Object
   var thisResult = JSON.parse(result);
    // console.log('thisResult : ' + thisResult);

   // convert json_metadata JSON string to JSON Object 
   var metadata = JSON.parse(thisResult.json_metadata);

   upImgData = JSON.stringify(metadata);
   filePath = thisResult.filename;

    console.log("filePath : "+filePath);

    // Convert image
    getFileContentAsBase64(filePath,function(base64Image){
      //window.open(base64Image);
      console.log("Convert to Base64 : "+base64Image); 
      // Then you'll be able to handle the myimage.png file as base64
      imgData = base64Image.split(",")[1]
    });

    // alert(btnWhere);
      function checkImg(){if(imgData!=undefined){
        $scope.btnUpload(imgData);
        clearInterval(waitImg);
        //alert("clear");
      }}

      if(btnWhere=="other"){
        $scope.editNotePopup();
      }else{
        var waitImg = setInterval(function(){ checkImg() }, 1500);
      }

  }


function onFail(message) {
    //alert('Failed because: ' + message);
    $scope.showAlert(message);
    btnWhere = undefined;
    //alert(btnCamera);
}

$scope.viewExif = function(){
      // alert("viewExif : "+upImgData);
}



   $scope.editNotePopup = function() {
      //console.log("Key for edit Slope : "+refJobsRec);
      $scope.otherImgs = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editNotePopup.html',
        title: 'บันทึกช่วยจำ',
        subTitle: 'คำอธิบายสำหรับรูปถ่าย',
        scope: $scope,
        buttons: [
          { 
            text: 'ไม่บันทึกภาพ',
            onTap: function(e) {
              btnWhere = undefined; 
            }
          },
          {
            text: '<b>บันทึกภาพ</b>',
            type: 'button-positive',
            onTap: function(e) {
              otherPhotoNote=$scope.otherImgs.note;
              if(otherPhotoNote==undefined){
                $scope.showAlert("กรุณาถ่ายภาพอีกครั้ง และจำเป็นต้องใส่บันทึกช่วยจำทุกครั้ง");
              }else{
                $scope.btnUpload(imgData);
              }
            }
          }
        ]
      });
      myPopup.then(function() {

      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 100000);     
    } 

/**
 * This function will handle the conversion from a file to base64 format
 *
 * @path string
 * @callback function receives as first parameter the content of the image
 */
function getFileContentAsBase64(path,callback){

    window.resolveLocalFileSystemURL(path, gotFile, fail);
            
    function fail(e) {
          alert('Cannot found requested file');
    }

    function gotFile(fileEntry) {
           fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                   var content = this.result;
                   callback(content);
              };
              // The most important point, use the readAsDatURL Method from the file plugin
              reader.readAsDataURL(file);
           });
    }
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
$scope.btnUpload = function(fileData){
  console.log('btnUpload' + fileData);
  $scope.showLoading();
  //auto gen ID
  jobsRecMeta = jobInfo.jobProv+"_"+jobInfo.jobArea+"_"+jobInfo.jobPin;
  metaImg = btnWhere+"_"+jobsRecMeta;
  imgName = metaImg+"@"+Date.now();

  var getStamp = new Date();
  var dd = ("0" + getStamp.getDate()).slice(-2);
  var mm = ("0" + (getStamp.getMonth() + 1)).slice(-2)
  var yyyy = getStamp.getFullYear();
  var dateRec = dd+"-"+mm+"-"+yyyy;

  if(btnWhere=="other"){

    refBMONimg = refStorage.child(imgOther+imgName+".jpg");
    refBMONimg.putString(fileData, 'base64').then(function(snapshot) {
        //alert("Uploaded Other Photo");
        imgDB.child("other").push({"jobRecId":jobInfo.jobId,"date":dateRec,"lat":latImg,"lng":lngImg,"user":userEmail,"meta":metaImg,"name":imgName,"status":"new","type":btnWhere,"note":otherPhotoNote});
        refJobsRec.child(jobInfo.jobId+"/imgOther").push({"name":imgName,"note":otherPhotoNote});
        setTimeout(function(){
          $scope.hideLoading();
          $scope.showMessage("บันทึกภาพแล้ว");
          btnWhere = undefined;     
        },1000)
    }) 

  

  }else{

    //alert("Uploaded 4d Photo"); 

      refBMONimg = refStorage.child(imgFolder+imgName+".jpg");
      refBMONimg.putString(fileData, 'base64').then(function(snapshot) {

      imgDB.child("4d").push({"jobRecId":jobInfo.jobId,"date":dateRec,"lat":latImg,"lng":lngImg,"user":userEmail,"meta":metaImg,"name":imgName,"status":"new","type":btnWhere});

      var refShowImg = refStorage.child(imgFolder+imgName+".jpg");

      setTimeout(function(){
        if(btnWhere=='front'){
            imgOnLocate.update({"front":imgName});
            refJobsRec.child(jobInfo.jobId+"/img4d").update({"front":imgName});
            $scope.showMessage("บันทึกภาพแล้ว");
            refShowImg.getDownloadURL().then(function(url) {
              frontImg = imgName;
              $("#frontImg").attr("src",url);
              $("#show4imgs").css("background-image","url('"+url+"')");
              $scope.hideLoading();
            });
        }else if(btnWhere=='right'){
            imgOnLocate.update({"right":imgName});
            refJobsRec.child(jobInfo.jobId+"/img4d").update({"right":imgName});
            $scope.showMessage("บันทึกภาพแล้ว");
            refShowImg.getDownloadURL().then(function(url) {
              rightImg = imgName;
              $("#rightImg").attr("src",url);
              $("#show4imgs").css("background-image","url('"+url+"')");
              $scope.hideLoading();
            });
        }else if(btnWhere=='back'){
            imgOnLocate.update({"back":imgName});
            refJobsRec.child(jobInfo.jobId+"/img4d").update({"back":imgName});  
            $scope.showMessage("บันทึกภาพแล้ว");    
            refShowImg.getDownloadURL().then(function(url) {
              backImg = imgName;
              $("#backImg").attr("src",url);
              $("#show4imgs").css("background-image","url('"+url+"')");
              $scope.hideLoading();
            });
        }else if(btnWhere=='left'){
            imgOnLocate.update({"left":imgName});
            refJobsRec.child(jobInfo.jobId+"/img4d").update({"left":imgName});
            $scope.showMessage("บันทึกภาพแล้ว");
            refShowImg.getDownloadURL().then(function(url) {
              leftImg = imgName;
              $("#leftImg").attr("src",url);
              $("#show4imgs").css("background-image","url('"+url+"')");
              $scope.hideLoading();
            });
        };
      }, 2500); 

    // }

    },function(err){
      $scope.showAlert(err);
      btnWhere = undefined;
    });
  }




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
    btnWhere = "other";
    $("#show4imgs").css("background-image","none");
    $scope.btnCamera();
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
