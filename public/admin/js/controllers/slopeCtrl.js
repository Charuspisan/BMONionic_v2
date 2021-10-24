angular.module('BMONadmin')

.controller('slopeCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {

  var refLocations = firebase.database().ref("locations/");
  var refJobsID = firebase.database().ref("jobsID/");
  var refJobsRec = firebase.database().ref("jobsRec/");


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
        // $scope.$apply();

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
    resetAllData()
  }
  $scope.SelectBarSlope.areaChange = function(area){
    console.log("selected area slope is : "+area);
    $scope.selectFilterSlope.pinStart = "blank";
    $scope.selectFilterSlope.pinEnd = "blank";
    resetAllData()
  }
  $scope.SelectBarSlope.pinStartChange = function(pin){
    console.log("selected Slope pin start is : "+pin);
    $scope.selectFilterSlope.pinEnd = "blank";
    resetAllData()
  }
  $scope.SelectBarSlope.pinEndChange = function(pin){
    
    resetAllData();
    $scope.MetaQuery = []

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

  function resetAllData(){
    $scope.MetaQuery = [];
    $("#showGraphSlopeWrapper,.colGraphSlopeData").empty();
    $("#previewSlope").empty();
    seriesData = []
    // console.log("resetAllData - seriesData : ",seriesData)
    dataCheck = []
    $scope.graphSlop.slope = {}
  }

  $scope.downloadCSVslope = function(){
        var data, filename, link;
        var csv = $("#exportSlope").html();
        if (csv == null) return;
        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();
        var now = d.getFullYear() + '/' +
            ((''+month).length<2 ? '0' : '') + month + '/' +
            ((''+day).length<2 ? '0' : '') + day;

        // filename = args.filename || 'export.csv';
        filename = "Slope-"+$scope.selectFilterSlope.prov+"_"+$scope.selectFilterSlope.area+"_"+$scope.selectFilterSlope.pinStart+"-"+$scope.selectFilterSlope.pinEnd+"_"+now+".csv" || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
  }

    $scope.graphSlop = []
    $scope.graphSlop.date = []
    $scope.graphSlop.slope = {}
    $scope.graphSlop.series = []

    function initXaxis(){

      refJobsID.once("value", function(snapshot) {

        console.log("refJobsID slope : ",snapshot.val());


          snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if($scope.graphSlop.date.indexOf(childData.operate_date) == -1) {
                 $scope.graphSlop.date.push(childData.operate_date);
                 // console.log("$scope.graphSlop.date : ",$scope.graphSlop.date);
              }
          });

          $scope.graphSlop.date.sort(function(a, b){
              var aa = a.split('-').reverse().join(),
                  bb = b.split('-').reverse().join();
              return aa < bb ? -1 : (aa > bb ? 1 : 0);
          });

          // console.log("snapshot count : "+Object.keys(snapshot).length)

          // var checkSlopeDataLoaded = setInterval(function(){
          //   if($scope.graphSlop.date.length==Object.keys(snapshot).length){
              // initChart();
          //     clearInterval(checkSlopeDataLoaded);
          //   }
          // },500)

      })
    }  
    initXaxis();

    // var objGraph = []
    var dataCheck = []

    function getSlope(i){

      var meta = $scope.MetaQuery[i]
      $scope.graphSlop.slope[meta] = []
      var num = i
      // objGraph[num] = $scope.graphSlop.slope[meta]

      refJobsRec.orderByChild("meta").equalTo($scope.MetaQuery[i]).once("value", function(snapshot) {
        // console.log("snapshot count : "+Object.keys(snapshot).length)
        $scope.dataJobRec = snapshot.val();
        console.log("$scope.dataJobRec slope : ",$scope.dataJobRec);

        snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            //if($scope.graphSlop.date.indexOf(childData.operate_date) == -1) {
               $scope.graphSlop.slope[meta].push({date:childData.operate_date,slope:childData.slope});
            //}
        });


      })
      console.log("$scope.graphSlop.slope : "+i+" : ",$scope.graphSlop.slope);

        var checkSlopeDataSorted = setInterval(function(){
          console.log("dataCheck num : ",num)
          if(dataCheck[num]==undefined||dataCheck[num]!=$scope.graphSlop.slope[meta]){
            dataCheck[num] = $scope.graphSlop.slope[meta]
            console.log("dataCheck"+num+" : ",dataCheck[num])
          }else{
            $scope.graphSlop.slope[meta].sort(function(a,b){
              var aa = a.date.split('-').reverse().join();
              var bb = b.date.split('-').reverse().join();
              return aa < bb ? -1 : (aa > bb ? 1 : 0);
            });

            console.log("sorted : ",$scope.graphSlop.slope[meta])
            clearInterval(checkSlopeDataSorted);
            // console.log("$scope.graphSlop.slope : ",$scope.graphSlop.slope);
            genSeries($scope.graphSlop.slope);
            initChart(seriesData);
            $('#previewSlope').html(chart.getTable());
            $('#exportSlope').html("เปรียบเทียบสถิติ-ค่ามุมเอียง"+'\n'+ "พื้นที่ : " + $scope.selectFilterSlope.prov + " : " + $scope.selectFilterSlope.area + " : " + $scope.selectFilterSlope.pinStart + " ถึง " + $scope.selectFilterSlope.pinEnd +'\n'+ chart.getCSV());
          }
        },1000)
      
    }

    var seriesData = []
    function genSeries(data){
      console.log("data : ",data)
      seriesData = []
      var mainIndex = $scope.graphSlop.date
      var loop = mainIndex.length
      var preVal = []
      var preValGen = function(){for(b=0;b<loop;b++){preVal.push("")}}
      var i = 0
      // setTimeout(function(){
        $.each(data,function(key, value){
          // console.log("key : ",key)
          // console.log("value : ",value)
          var nameKey = key.split("_").pop();
          preValGen();
          console.log("preVal : ",preVal)
          seriesData.push({name:nameKey,data:preVal})
          preVal = []

          $.each( value, function( key2, value2 ) {
            // console.log("genSeries lv2 key2 : ",key2)
            // console.log("genSeries lv2 value2.slpoe : ",value2.slope)
            var insertAt = mainIndex.indexOf(value2.date);
            console.log("matching "+value2.date+" at : "+insertAt);
            seriesData[i].data[insertAt]=value2.slope

          });
          i++
        });        
      // },2000)
      console.log("genSeries : ",seriesData)
    }
 

    var chart=null;
    function initChart(seriesData) {

      //console.log("graphData : ",graphData);
      console.log("$scope.graphSlop.date : ",$scope.graphSlop.date);

          chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'showGraphSlopeWrapper',
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
                          enabled: true
                      },
                      enableMouseTracking: true
                  },
                  series: {
                      connectNulls: true
                  }
              },
              series: seriesData
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









  
