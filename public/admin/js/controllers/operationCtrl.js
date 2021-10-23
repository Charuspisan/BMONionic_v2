angular.module('BMONadmin')

.controller('operationCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


  const refLocations = firebase.database().ref("locations/");
  const refJobsID = firebase.database().ref("jobsID/");
  const refJobsRec = firebase.database().ref("jobsRec/");


  //read data for create filter 
    refLocations.on("value", function(snapshot) {

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

        console.log("$scope.data : ",$scope.data);
        console.log("$scope.queryProv : ",$scope.queryProv);
        console.log("$scope.queryArea : ",$scope.queryArea);
        console.log("$scope.Areas : ",$scope.Areas);

        // sharedProp.setLocateData(queryData,queryProv,queryArea);

    });


  $scope.selectFilter = {};
  var DropdownIndex

  $scope.SelectBar = {};
  $scope.SelectBar.provChange = function(prov){
    console.log("selected prov is : "+prov);
    $scope.selectFilter.area = "blank";
    $scope.selectFilter.pin = "blank";
    $("#showGraphWrapper,.colGraphData").empty();
    sharedProp.filterBarResetDate();
  }
  $scope.SelectBar.areaChange = function(area){
    console.log("selected area is : "+area);
    searchFromProv_Area($scope.selectFilter.prov,$scope.selectFilter.area);
    $scope.selectFilter.pin = "blank";
    $("#showGraphWrapper,.colGraphData").empty();
    sharedProp.filterBarResetDate();
  }
  $scope.SelectBar.pinChange = function(pin){
    console.log("selected pin is : "+pin);
    $scope.selectFilter.date1 = "blank";
    $scope.selectFilter.date2 = "blank";
    $scope.selectFilter.date3 = "blank";
    $scope.selectFilter.date4 = "blank";
    $scope.selectFilter.date5 = "blank";
    $scope.selectFilter.date6 = "blank";
    $scope.selectFilter.date7 = "blank";
    $scope.selectFilter.date8 = "blank";
    $scope.selectFilter.date9 = "blank";
    $scope.selectFilter.date10 = "blank";
    $scope.selectFilter.date11 = "blank";
    $scope.selectFilter.date12 = "blank";
    $("#showGraphWrapper,.colGraphData").empty();
    sharedProp.filterBarResetDate();
  }
  $scope.SelectBar.dateChange = function(index, date){
    console.log("selected date is : "+date+" : index is : "+index);
    DropdownIndex = index
    DDVal = "$scope.selectFilter.date"+index
    //console.log("DDVal : "+DDVal+" ::: "+"index : "+index);
    if(date==""||date=="blank"||date==undefined){
      sharedProp.filterBarSetResult($scope.selectFilter.prov,$scope.selectFilter.area,$scope.selectFilter.pin,DropdownIndex,undefined,undefined);
      $(".colGraphData .date"+DropdownIndex).empty();
    }
    var result = sharedProp.filterBarGetResult()
    setTimeout(function(){
      console.log("sharedProp.filter : ",result.date);
    },1000);  
      
  }
  // $scope.SelectBar.date2Change = function(date2){
  //   console.log("selected date2 is : "+date2);
  // }
  // $scope.SelectBar.date3Change = function(date3){
  //   console.log("selected date3 is : "+date3);
  // }
  // $scope.SelectBar.date4Change = function(date4){
  //   console.log("selected date4 is : "+date4);
  // }
  // $scope.SelectBar.date5Change = function(date5){
  //   console.log("selected date5 is : "+date5);
  // }

  var selectedDate=["-","-","-","-","-","-","-","-","-","-","-","-"]

  $scope.drawGraph = function(date){

    console.log("selected prov is : "+$scope.selectFilter.prov);
    console.log("selected area is : "+$scope.selectFilter.prov);
    console.log("selected pin is : "+$scope.selectFilter.pin);
    // console.log("selected date 1 is : "+$scope.selectFilter.date1);
    console.log("selected date 1 is : "+$scope.selectFilter.date1);
    console.log("selected date 2 is : "+$scope.selectFilter.date2);
    console.log("selected date 3 is : "+$scope.selectFilter.date3);
    console.log("selected date 4 is : "+$scope.selectFilter.date4);
    console.log("selected date 5 is : "+$scope.selectFilter.date5);
    console.log("selected date 6 is : "+$scope.selectFilter.date6);
    console.log("selected date 7 is : "+$scope.selectFilter.date7);
    console.log("selected date 8 is : "+$scope.selectFilter.date8);
    console.log("selected date 9 is : "+$scope.selectFilter.date9);
    console.log("selected date 10 is : "+$scope.selectFilter.date10);
    console.log("selected date 11 is : "+$scope.selectFilter.date11);
    console.log("selected date 12 is : "+$scope.selectFilter.date12);

      var dateIndex

      if(date==0){
        if($scope.selectFilter.date1=="blank"||$scope.selectFilter.date1==undefined){
          graphData[0] = ""
          selectedDate[0] = "-"
          initChart();     
        }else if($scope.selectFilter.date1!=undefined){
          dateIndex = $scope.selectFilter.date1
          selectedDate[0] = dateIndex           
        }
      }else if(date==1){
        if($scope.selectFilter.date2=="blank"||$scope.selectFilter.date2==undefined){
          graphData[1] = ""
          selectedDate[1] = "-"
          initChart();     
        }else if($scope.selectFilter.date2!=undefined){
          dateIndex = $scope.selectFilter.date2
          selectedDate[1] = dateIndex           
        }
      }else if(date==2){
        if($scope.selectFilter.date3=="blank"||$scope.selectFilter.date3==undefined){
          graphData[2] = ""
          selectedDate[2] = "-"
          initChart();     
        }else if($scope.selectFilter.date3!=undefined){
          dateIndex = $scope.selectFilter.date3
          selectedDate[2] = dateIndex           
        }
      }else if(date==3){
        if($scope.selectFilter.date4=="blank"||$scope.selectFilter.date4==undefined){
          graphData[3] = ""
          selectedDate[3] = "-"
          initChart();     
        }else if($scope.selectFilter.date4!=undefined){
          dateIndex = $scope.selectFilter.date4
          selectedDate[3] = dateIndex           
        }
      }else if(date==4){
        if($scope.selectFilter.date5=="blank"||$scope.selectFilter.date5==undefined){
          graphData[4] = ""
          selectedDate[4] = "-"
          initChart();     
        }else if($scope.selectFilter.date5!=undefined){
          dateIndex = $scope.selectFilter.date5
          selectedDate[4] = dateIndex           
        }
      }else if(date==5){
        if($scope.selectFilter.date6=="blank"||$scope.selectFilter.date6==undefined){
          graphData[5] = ""
          selectedDate[5] = "-"
          initChart();     
        }else if($scope.selectFilter.date6!=undefined){
          dateIndex = $scope.selectFilter.date6
          selectedDate[5] = dateIndex           
        }
      }else if(date==6){
        if($scope.selectFilter.date7=="blank"||$scope.selectFilter.date7==undefined){
          graphData[6] = ""
          selectedDate[6] = "-"
          initChart();     
        }else if($scope.selectFilter.date7!=undefined){
          dateIndex = $scope.selectFilter.date7
          selectedDate[6] = dateIndex           
        }
      }else if(date==7){
        if($scope.selectFilter.date8=="blank"||$scope.selectFilter.date8==undefined){
          graphData[7] = ""
          selectedDate[7] = "-"
          initChart();     
        }else if($scope.selectFilter.date8!=undefined){
          dateIndex = $scope.selectFilter.date8
          selectedDate[7] = dateIndex           
        }
      }else if(date==8){
        if($scope.selectFilter.date9=="blank"||$scope.selectFilter.date9==undefined){
          graphData[8] = ""
          selectedDate[8] = "-"
          initChart();     
        }else if($scope.selectFilter.date9!=undefined){
          dateIndex = $scope.selectFilter.date9
          selectedDate[8] = dateIndex           
        }
      }else if(date==9){
        if($scope.selectFilter.date10=="blank"||$scope.selectFilter.date10==undefined){
          graphData[9] = ""
          selectedDate[9] = "-"
          initChart();     
        }else if($scope.selectFilter.date10!=undefined){
          dateIndex = $scope.selectFilter.date10
          selectedDate[9] = dateIndex           
        }
      }else if(date==10){
        if($scope.selectFilter.date11=="blank"||$scope.selectFilter.date11==undefined){
          graphData[10] = ""
          selectedDate[10] = "-"
          initChart();     
        }else if($scope.selectFilter.date11!=undefined){
          dateIndex = $scope.selectFilter.date11
          selectedDate[10] = dateIndex           
        }
      }else if(date==11){
        if($scope.selectFilter.date12=="blank"||$scope.selectFilter.date12==undefined){
          graphData[11] = ""
          selectedDate[11] = "-"
          initChart();     
        }else if($scope.selectFilter.date12!=undefined){
          console.log("$scope.selectFilter.date12 is : "+$scope.selectFilter.date12)
          dateIndex = $scope.selectFilter.date12
          selectedDate[11] = dateIndex           
        }
      }else{
        initChart();   
      }
      console.log("dateIndex is : "+dateIndex);

    var prov = $scope.selectFilter.prov,
    area = $scope.selectFilter.area,
    pin = $scope.selectFilter.pin,
    date1 = $scope.selectFilter.date1,
    date2 = $scope.selectFilter.date2,
    date3 = $scope.selectFilter.date3,
    date4 = $scope.selectFilter.date4,
    date5 = $scope.selectFilter.date5,
    date6 = $scope.selectFilter.date6,
    date7 = $scope.selectFilter.date7,
    date8 = $scope.selectFilter.date8,
    date9 = $scope.selectFilter.date9,
    date10 = $scope.selectFilter.date10,
    date11 = $scope.selectFilter.date11,
    date12 = $scope.selectFilter.date12

    //sharedProp.filterBarSetResult(prov,area,pin,date1,date2,date3,date4,date5,date6,date7,date8,date9,date10,date11,date12,id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12);

    //got prov,area,date and pin use it for search selected pin on jobsID DB matching pin and get it key (that is jobsRec key on jobsRec DB)
    refJobsID.orderByChild("area").equalTo($scope.selectFilter.area).once("value", function(snapshot) {
      // var data = snapshot.val();
      // console.log("matching area : ",data);

          snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if(childData.operate_date==dateIndex) {
                 console.log("jobRec key : ",childData);
                 obj=childData;

                 Object.keys(obj).forEach(function(key) {
                    // console.log(key, obj[key]);
                    // console.log(obj[key].pin);
                    if(obj[key].pin==$scope.selectFilter.pin){
                      console.log("found pin on : ",key);
                      console.log("DropdownIndex : "+DropdownIndex);

                      sharedProp.filterBarSetResult(prov,area,pin,DropdownIndex,dateIndex,key);

                      genChart(date, key);
                      genNote(date, key);
                    }
                });
              }
          });      

    })

    // console.log("matchDate1 : ",obj);

  }


var noteDatas = []
$scope.noteDatas = noteDatas

function genNote(date, id){

  console.log("genNote Date Dropdown : "+date+" jobsRec : "+id);
  refJobsRec.child(id).once("value", function(snapshot) {
    var data = snapshot.val();
    noteDatas[date] = data.note;
    console.log("Note : ",$scope.noteDatas);
  })

}

      //Start graph

     // $scope.objRec
    var graphData=[]
    $scope.graphDatas=graphData

  function genChart(date, id){

      // refJobsRec.child(id).on("value", function(snapshot) {
      //   // console.log("value : ",value);
      //   $scope.objRec = snapshot.val();
      // });

      var dataArray=[]
      var dataForCheckIndex=[]
      var indexArray=[]
      var labelsArray=[]
      var labelsData=[]
      var lastGraphData

      var refGraph = refJobsRec.child(id).child('graph')

        $scope.graph = {};
        $scope.graph.data = [
          //Awake
          //[-5, null, -12, null, -23,null, -28],
          //Asleep
          //[-8, -9, -14, -12, -18, -22, -24],
          //Add more
          //[-10, -19, -24, -28, -28, -36, -34]
        ];
    
        //$scope.graph.labels = [];
        //$scope.graph.series = ['1 ม.ค. 2559', '1 ก.พ. 2559', '1 มี.ค. 2559'];
        
        refGraph.on("value",function(snapshot){

          console.log("graph data : ",snapshot.val());

          dataArray = [];
          dataForCheckIndex = [];
          labelsArray=[]
          
          snapshot.forEach(function(childSnapshot) {

            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(childData==""){
              dataArray.push(null);
              dataForCheckIndex.push(null);
              // indexArray.push(dataArray.indexOf(childData));
            }else if(childData==0){
              dataArray.push(0);
              dataForCheckIndex.push(0);
              // indexArray.push(dataArray.indexOf(childData));
            }else{
              dataArray.push(parseFloat(childData)); //why take effect to indexArray
              dataForCheckIndex.push(childData);
              // indexArray.push(dataArray.indexOf(childData));
            }
              indexArray.push(dataForCheckIndex.indexOf(childData));
             
          });

          var max = Math.max(...indexArray);
          // console.log("Last data at : ",max);

          // lastGraphData = max;

          //   for(i=0;i<=max;i++){
          //     var data = i.toString()
          //     labelsArray.push(data);
          //   }

          // console.log("labelsArray : ",labelsArray);  
          // console.log("dataArray : ",dataArray);

          // var type = "One-man"

          // if(type=="One-man"){
          //   graphData = [];
          //   labelsData = [];
            graphData[date] = dataArray.slice(0, max+1);
          //   labelsData = labelsArray;
          console.log("graphData : ",graphData);
          //   // console.log("labelsData : ",labelsData);

          // }else{

          //   graphData = [];
          //   labelsData = [];
          //   for (i=0;i<max+1;i++){
          //       if ((i+2)%2==0) {
          //           graphData.push(dataArray[i]);
          //           labelsData.push(labelsArray[i]);
          //       }
          //   }
          //   console.log("tool is Water-level graphData : ",graphData);
            
          // }

          })

          
          // var labelsDataCheck = setInterval(function () {
          //   if(labelsData==""){
          //     console.log("Waiting for labelsData");
          //   }else{
          //     console.log("Got for labelsData");
          //     clearInterval(labelsDataCheck);
              // initChart();
          //   }
          // },1000);

          var graphDataCheck = setInterval(function () {
            if(graphData==""){
              console.log("Waiting for graphDataCheck");
            }else{
              console.log("Got for graphDataCheck");
              clearInterval(graphDataCheck);
              initChart();


              $('#preview').html(chart.getTable());
              $('#export').html("เปรียบเทียบสถิติ-กราฟ"+'\n'+ "พื้นที่ : " + $scope.selectFilter.prov + " : " + $scope.selectFilter.area + " : " + $scope.selectFilter.pin +'\n'+ chart.getCSV());



            }
          },3000);  


      }


  $scope.downloadCSV = function(){
        var data, filename, link;
        var csv = $("#export").html();
        if (csv == null) return;
        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();
        var now = d.getFullYear() + '/' +
            ((''+month).length<2 ? '0' : '') + month + '/' +
            ((''+day).length<2 ? '0' : '') + day;

        // filename = 'export.csv';
        filename = "Stat-"+$scope.selectFilter.prov+"_"+$scope.selectFilter.area+"_"+$scope.selectFilter.pin+"_"+now+".csv" || 'export.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
  }    


      var chart=null;
      function initChart() {

        // console.log("labelsData : ",labelsData);
        console.log("graphData : ",graphData);
        chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'showGraphWrapper',
                        type: 'line',
                        zoomType: 'x',
                        resetZoomButton: {
                          theme: {
                          display: 'none'
                          }
                        }
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
                    // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    // categories: labelsData,
                    tickmarkPlacement:'on',
                    title: {
                      text: "เมตร",
                      align: "high",
                      margin: -15
                  }
                },
                yAxis: {
                    tickmarkPlacement:'on',
                    title: {
                      text: "เมตร",
                      align: "high",
                      margin: -15
                  }
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    },
                    series: {
                        connectNulls: true
                    }
                },
                series: [{
                            name: selectedDate[0],
                            data: graphData[0]
                          }, {
                            name: selectedDate[1],
                            data: graphData[1]
                          }, {
                            name: selectedDate[2],
                            data: graphData[2]
                          }, {
                            name: selectedDate[3],
                            data: graphData[3]
                          }, {
                            name: selectedDate[4],
                            data: graphData[4]
                          }, {
                            name: selectedDate[5],
                            data: graphData[5]
                          }, {
                            name: selectedDate[6],
                            data: graphData[6]
                          }, {
                            name: selectedDate[7],
                            data: graphData[7]
                          }, {
                            name: selectedDate[8],
                            data: graphData[8]
                          }, {
                            name: selectedDate[9],
                            data: graphData[9]
                          }, {
                            name: selectedDate[10],
                            data: graphData[10]
                          }, {
                            name: selectedDate[11],
                            data: graphData[11]
                          }
                ]

            });
        };


     //End graph


  $scope.dates
  var dates = [];
  //search for dates on selected prov and area
  function searchFromProv_Area(prov,area){

    $scope.dates = [];
    dates = [];

    console.log("searchFromProv_Area is : "+$scope.selectFilter.prov+" : "+$scope.selectFilter.area);

        refJobsID.on("value", function(snapshot) {
        $scope.JobsIDdata = snapshot.val();
        // console.log($scope.JobsIDdata);

          var queryDate = [];
          

          snapshot.forEach(function(childSnapshot) {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if(queryDate.indexOf(childData.operate_date) == -1) {
                 queryDate.push(childData.operate_date);
                 console.log("queryDate : ",queryDate);
                 dates.push({prov:childData.province,area:childData.area,date:childData.operate_date});
                 console.log("dates : ",dates);
              }
          });
        });

        $scope.dates = dates

  }



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

   $scope.viewNotePopup = function(note) {
     var alertPopup = $ionicPopup.alert({
       title: 'บันทึกฃ่วยจำ',
       template: "<center>"+note+"</center>"
     });
     alertPopup.then(function(res) {
       
     });
   };

   var filterBarStatus = true
   $scope.toggleFilterBar = function(){
      if(filterBarStatus == true){
        $(".filterBar").hide();
        filterBarStatus = false
      }else{
        $(".filterBar").show();
        filterBarStatus = true      
      }
   };

  })

.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});









  
