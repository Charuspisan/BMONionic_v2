angular.module('BMONadmin')

.controller('slopeCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");


  //read data for create filter 
    refLocations.once("value", function(snapshot) {

        $scope.data = snapshot.val();
        var queryData = snapshot.val();
        var queryProv = [];
        var queryArea = [];
        var areas = [];

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(queryProv.indexOf(childData.province) == -1) {
               queryProv.push(childData.province);
               console.log("queryProv : ",queryProv);
            }
            if(queryArea.indexOf(childData.area) == -1) {
               queryArea.push(childData.area);
               console.log("queryArea : ",queryArea);
               areas.push({prov:childData.province,area:childData.area});
            }

        });

        $scope.queryProv = queryProv;
        $scope.queryArea = queryArea;
        $scope.Areas = areas;
        $scope.$apply();

        console.log("$scope.data : ",$scope.data);
        console.log("$scope.queryProv : ",$scope.queryProv);
        console.log("$scope.queryArea : ",$scope.queryArea);
        console.log("$scope.Areas : ",$scope.Areas);
    });


  //receive scope form html
  $scope.selectFilterSlope = {};
  $scope.SelectBarSlope = {};
  //query for search by meta
  $scope.MetaQuery = []

  $scope.SelectBarSlope.provChange = function(prov){
    console.log("selected prov slope is : "+prov);
    $scope.selectFilterSlope.area = "blank";
    $scope.selectFilterSlope.pinStart = "blank";
    $scope.selectFilterSlope.pinEnd = "blank";
  }
  $scope.SelectBarSlope.areaChange = function(area){
    console.log("selected area slope is : "+area);
    $scope.selectFilterSlope.pinStart = "blank";
    $scope.selectFilterSlope.pinEnd = "blank";
  }
  $scope.SelectBarSlope.pinStartChange = function(pin){
    console.log("selected Slope pin start is : "+pin);
    $("#showGraphSlopeWrapper,.colGraphSlopeData").empty();
  }
  $scope.SelectBarSlope.pinEndChange = function(pin){

    $scope.MetaQuery = []
    $scope.graphSlop.slope = []

    console.log("selected Slope pin end is : "+pin);
    $("#showGraphSlopeWrapper,.colGraphSlopeData").empty();

    console.log("$scope.selectFilterSlope : ",$scope.selectFilterSlope);
    var start = parseInt($scope.selectFilterSlope.pinStart.substring(1));
    var end = parseInt($scope.selectFilterSlope.pinEnd.substring(1));
    // var start = 4
    // var end = 11
    var diff = end-start

    var prov = $scope.selectFilterSlope.prov
    var area = $scope.selectFilterSlope.area

    console.log("diff : "+diff);
    
    for(i=0;i<=diff;i++){
      if((start+i)<=9){
        var val = prov+"_"+area+"_"+"B0"+(start+i);
        $scope.MetaQuery.push(val);
      }else{
        var val = prov+"_"+area+"_"+"B"+(start+i);
        $scope.MetaQuery.push(val);
      }
      getSlope(i);
      console.log("getSlope : "+i);
    }

    console.log("$scope.MetaQuery : ",$scope.MetaQuery);

  }

    $scope.graphSlop = []
    $scope.graphSlop.date = []
    $scope.graphSlop.slope = []
    $scope.graphSlop.series = []

    refJobsID.once("value", function(snapshot) {

      console.log("refJobsID slope : ",snapshot.val());
      console.log("snapshot count : "+Object.keys(snapshot).length)

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            //if($scope.graphSlop.date.indexOf(childData.operate_date) == -1) {
               $scope.graphSlop.date.push(childData.operate_date);
               console.log("$scope.graphSlop.date : ",$scope.graphSlop.date);

            //}
        });

        // var checkSlopeDataLoaded = setInterval(function(){
        //   if($scope.graphSlop.date.length==Object.keys(snapshot).length){
              initChart();
        //       clearInterval(checkSlopeDataLoaded);
        //   }
        // },500)

    })


    function getSlope(i){

      refJobsRec.orderByChild("meta").equalTo($scope.MetaQuery[i]).once("value", function(snapshot) {

        $scope.dataJobRec = snapshot.val();
        console.log("$scope.dataJobRec slope : ",$scope.dataJobRec);
        var meta = $scope.MetaQuery[i]
        $scope.graphSlop.slope[meta] = []

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            //if($scope.graphSlop.date.indexOf(childData.operate_date) == -1) {
               $scope.graphSlop.slope[meta].push(childData.slope);

            //}
        });

      })
      console.log("$scope.graphSlop.slope : "+i+" : ",$scope.graphSlop.slope);
    }

 


    function initChart() {

      //console.log("graphData : ",graphData);

          Highcharts.chart('showGraphSlopeWrapper', {
              chart: {
                  type: 'line'
              },
              legend: {
                  enabled: true
              },
              title: {
                  text: false
              },
              subtitle: {
                  text: false
              },
              xAxis: {
                  //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  categories: $scope.graphSlop.date,
                  tickmarkPlacement:'on',
                  title: {
                    text: "วันที่",
                    align: "high",
                    margin: -15
                }
              },
              yAxis: {
                  tickmarkPlacement:'on',
                  title: {
                    text: "องศา",
                    align: "high",
                    margin: -15
                }
              },
              plotOptions: {
                  line: {
                      dataLabels: {
                          enabled: false
                      },
                      enableMouseTracking: false
                  },
                  series: {
                      connectNulls: true
                  }
              },
              series: [
                        {
                          name: "test",
                          data: [0,1,2,3]
                        },
                        {
                          name: "test2",
                          data: [0,-1,-2,-3]
                        }
              ]
            })
          }


   //End graph





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

  })









  
