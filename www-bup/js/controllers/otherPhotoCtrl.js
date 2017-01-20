angular.module('BMON')

.controller('otherPhotoCtrl',function ($scope, $ionicViewService, $firebaseObject, $firebaseArray, $cordovaGeolocation, sharedProp, $location) {

    var jobInfo = sharedProp.getJobInfo();
    var jobLatLng = sharedProp.getJobLatLng();
    var lacateID = jobInfo.jobLocate;
    var latImg = jobLatLng.Lat
    var lngImg = jobLatLng.Lng
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
    $scope.otherImgs = {};
    
    console.log("jobLatLng : ",jobLatLng);
    alert("jobLatLng.Lat : "+jobLatLng.Lat+" jobLatLng.Lng : "+jobLatLng.Lng);
    
  $scope.goBack = function() {
    console.log('Going back');
    $ionicViewService.getBackView().go();
  }

$scope.btnCamera = function(bt){

  // This iOS/Android only example requires the dialog and the device plugin as well.
    navigator.camera.getPicture(onSuccess, onFail, { 

      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false 

    });
}

function onSuccess(result) {


   // convert JSON string to JSON Object
   var thisResult = JSON.parse(result);

   // convert json_metadata JSON string to JSON Object 
   var metadata = JSON.parse(thisResult.json_metadata);

   upImgData = JSON.stringify(metadata);
   fileName = thisResult.filename

    //var image = document.getElementById('myImage');
    //image.src = "data:image/jpeg;base64," + fileName

    alert(upImgData);

    if (thisResult.json_metadata != "{}") {
        if ((device.platform) == 'iOS') {

          // notice the difference in the properties below and the format of the result when you run the app.
          // iOS and Android return the exif and gps differently and I am not converting or accounting for the Lat/Lon reference.
          // This is simply the raw data being returned.

          alert('Lat: '+metadata.GPS.Latitude+' Lon: '+metadata.GPS.Longitude);
        } else {
          alert('Lat: '+metadata.gpsLatitude+' Lon: '+metadata.gpsLongitude);
          alert('Date: '+metadata.datetime);
        }
    }

    $("#otherPreview").css("background-image","url('data:image/jpeg;base64," + fileName+"')");
    
}

function onFail(message) {
    alert('Failed because: ' + message);
}

//take a photo suddenly
$scope.btnCamera();

$scope.btnUpload = function(){

  alert('btnUpload' + fileName);

  //auto gen ID
  jobsRecMeta = jobInfo.jobProv+"_"+jobInfo.jobArea+"_"+jobInfo.jobPin;
  metaImg = "other_"+jobsRecMeta;
  imgName = metaImg+"@"+Date.now();
  note = $scope.otherImgs.note;

  alert("note is : "+note);


  refBMONimg = refStorage.child(imgFolder+imgName+".jpg");

  refBMONimg.putString(fileName, 'base64').then(function() {

    // alert("latImg : "+latImg+" lngImg : "+lngImg);

    imgDB.push({"date":Date.now(), "lat":latImg, "lng":lngImg,"meta":metaImg,"name":imgName,"status":"new","type":"other","note":note});

    $scope.$apply(function(){ 
      $location.path('/operation');
    });

  }).catch(function(error){
    alert(error);
  });

  }
});
