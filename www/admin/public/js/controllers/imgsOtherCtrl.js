angular.module('BMONadmin')

.controller('imgsOtherCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


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



  sharedProp.filterBarGetResult();
  console.log("sharedProp.sharedFilterBar : ",sharedProp.sharedFilterBar);

  var imgsOtherData

  refImages.child("other").once("value", function(snapshot) {
    imgsOtherData = snapshot.val();
    return imgsOtherData
  });

  var gotData = setInterval(function(){
    if(imgsOtherData!=undefined){
      console.log("otherimg: All images data: ",imgsOtherData); 
      clearInterval(gotData);
      //photoInit();
    } 
  }, 1000);  


  /*var img4d = {"front":{},
              "right":{},
              "back":{},
              "left":{}
              };*/
  $scope.imgsOther = {}

  /*function photoInit(){
    //console.log("photoInit : ",imgsData);
    var frontMeta = "front_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var rightMeta = "right_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var backMeta = "back_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var leftMeta = "left_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin*/

    //------init object img4d-------//
    $.each(sharedProp.sharedFilterBar.date, function(dateIndex, dateVal) {
      $scope.imgsOther[dateVal]={}
      //console.log("$scope.imgsOther : ",$scope.imgsOther);
    })

    var selectImg = setInterval(function(){
      if($scope.imgsOtherData!=""){
        console.log("selectOtherImg start");
        var i=0
        $.each(imgsOtherData, function(index, value) {
          $.each(sharedProp.sharedFilterBar.date, function(dateIndex, dateVal) {
            if(value.date==dateVal){
              //console.log("other img name : "+value.name+" : date : "+dateVal+" : Dropdown index : "+dateIndex)
              $scope.imgsOther[dateVal][i] = {"url":value.name,"note":value.note};
            }
            i++
          })  
        })
        console.log("$scope.imgsOther : ",$scope.imgsOther)

        $scope.$apply(function () {

            console.log("$scope.imgsOther on $apply : ",$scope.imgsOther); 
            $("#imgsOtherContainer .scroll").append('<h1 class="header">'+sharedProp.sharedFilterBar.prov+' : '+sharedProp.sharedFilterBar.area+' : '+sharedProp.sharedFilterBar.pin+'</h1>')

            $.each($scope.imgsOther, function(key, val) {

              $("#imgsOtherContainer .scroll").append('<h1>'+key+'</h1><div id="other-'+key+'"></span></div>')

              $.each(val, function(key2, val2) {

                console.log("key2 : ",key2+" val2 : ",val2)
                console.log("$scope.imgsOther[key].key2 : ",$scope.imgsOther[key][key2])

                var refShowImg = refStorage.child("imgOther/"+$scope.imgsOther[key][key2]["url"]+".jpg");
                refShowImg.getDownloadURL().then(function(url) {
                  $("#other-"+key).append('<div class="thumbOther"><img class="thumbImg" date="'+key+'" src="'+url+'"><div>'+val2.note+'</div></div>');
                });

              })    


            })

        });
        clearInterval(selectImg);

        setTimeout(function(){ 
          $(".thumbImg").click(function(){
            var url = $(this).attr("src");
            var date = $(this).attr("date");
            var name = date
            //alert();
            popupZoomImg(name,url);
          })
        }, 1500);


      }

    },500)


   // An alert dialog
   function popupZoomImg(name, url) {
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







  
