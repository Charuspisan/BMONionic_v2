angular.module('BMONadmin')

.controller('imgs4dCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


  var refLocations = firebase.database().ref("locations/");
  var refJobsID = firebase.database().ref("jobsID/");
  var refJobsRec = firebase.database().ref("jobsRec/");
  var refImages = firebase.database().ref("images/");
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

  var imgsData

  refImages.child("4d").once("value", function(snapshot) {
    imgsData = snapshot.val();
    return imgsData
  });

  var gotData = setInterval(function(){
    if(imgsData!=undefined){
      //console.log("images data: ",imgsData); 
      clearInterval(gotData);
      photoInit();
    } 
  }, 1000);  


  /*var img4d = {"front":{},
              "right":{},
              "back":{},
              "left":{}
              };*/
  $scope.img4d = {}

  function photoInit(){
    //console.log("photoInit : ",imgsData);
    var frontMeta = "front_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var rightMeta = "right_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var backMeta = "back_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin
    var leftMeta = "left_"+sharedProp.sharedFilterBar.prov+"_"+sharedProp.sharedFilterBar.area+"_"+sharedProp.sharedFilterBar.pin

    //------init object img4d-------//
    $.each(sharedProp.sharedFilterBar.date, function(dateIndex, dateVal) {
      $scope.img4d[dateVal]={}
      $scope.img4d[dateVal]["front"]=undefined
      $scope.img4d[dateVal]["right"]=undefined
      $scope.img4d[dateVal]["back"]=undefined
      $scope.img4d[dateVal]["left"]=undefined
    })

    var selectImg = setInterval(function(){
      if($scope.img4d!=""){
        console.log("selectImg start");
        $.each(imgsData, function(index, value) {
          var metaSouce = (value.meta).split("@");
          var meta = metaSouce[0];
          //console.log("meta : ",meta);
          $.each(sharedProp.sharedFilterBar.date, function(dateIndex, dateVal) {
            if(meta==frontMeta&&value.date==dateVal){
              console.log("front img name : "+value.name+" : date : "+dateVal);



            // var refShowImg = refStorage.child("img4d/"+[value.name]+".jpg");
            // refShowImg.getDownloadURL().then(function(url) {
            //   $("#"+dateVal).attr("src",url);
            // });


              //img4d["front"][dateVal] = index;
              $scope.img4d[dateVal]["front"] = value.name;
            }else if(meta==rightMeta&&value.date==dateVal){
              console.log("right img name : "+value.name+" : date : "+dateVal);
              //img4d["right"][dateVal] = index;
              $scope.img4d[dateVal]["right"] = value.name;
            }else if(meta==backMeta&&value.date==dateVal){
              console.log("back img name : "+value.name+" : date : "+dateVal);
              //img4d["back"][dateVal] = index;
              $scope.img4d[dateVal]["back"] = value.name;
            }else if(meta==leftMeta&&value.date==dateVal){
              console.log("left img name : "+value.name+" : date : "+dateVal);
              //img4d["left"][dateVal] = index;
              $scope.img4d[dateVal]["left"] = value.name;
            }
          })  
        })
        $scope.$apply(function () {
          $scope.img4d = $scope.img4d;
            console.log("img4d",$scope.img4d); 

            $("#imgs4dContainer .scroll").append('<h1 class="header">'+sharedProp.sharedFilterBar.prov+' : '+sharedProp.sharedFilterBar.area+' : '+sharedProp.sharedFilterBar.pin+'</h1>')

            $.each($scope.img4d, function(key, val) {

              console.log("$scope.img4d : key",key)
              console.log("$scope.img4d front img : " + val.front)
              console.log("$scope.img4d right img : " + val.right)

              if(key!=""){
                $("#imgs4dContainer .scroll").append('<h1>'+key+'</h1><div id="'+key+'"><span class="thumb4d">Front<br><img class="front" src=""></a></span><span class="thumb4d">Right<br><img class="right" src=""></span><span class="thumb4d">Back<br><img class="back" src=""></span><span class="thumb4d">Left<br><img class="left" src=""></span></div>')               
              
                $.each(val, function(key2, val2) {

                  console.log("key2 : ",key2+" val2 : "+val2)
                  console.log("$scope.img4d[key].key2 : "+$scope.img4d[key][key2])

                  var refShowImg = refStorage.child("img4d/"+$scope.img4d[key][key2]+".jpg");
                  refShowImg.getDownloadURL().then(function(url) {
                    $("#"+key+" ."+key2).attr("src",url);
                  });

                })
              }     


            })


        });
        clearInterval(selectImg);  

        $(".front, .right, .back, .left").click(function(){
          var url = $(this).attr("src");
          var pos = $(this).attr("class");
          var date = $(this).parent().parent().attr("id");
          var name = pos+" : "+date
          popupZoomImg(name,url);
        })

      }
    },500)

  }

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







  
