angular.module('BMON')

.controller('operationCtrl', function($scope, $ionicViewService, $firebaseObject, $firebaseArray, $ionicPopup, $timeout, $location, $window, sharedProp, $ionicLoading, $ionicScrollDelegate) {


  var refLocations = new Firebase("https://bmon-41086.firebaseio.com/locations/"); 
  var refJobsID = new Firebase("https://bmon-41086.firebaseio.com/jobsID/");
  var refJobsRec = new Firebase("https://bmon-41086.firebaseio.com/jobsRec/");

  var jobInfo = sharedProp.getJobInfo();

  console.log("Pass value : ",sharedProp.getJobInfo());
  console.log("jobInfo.jobId : "+jobInfo.jobId);


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

  $scope.goBack = function() {
    console.log('Going back');
    $ionicViewService.getBackView().go();
  }

  $scope.goNext = function(page) {
    console.log('Going to : '+page);
    $location.path(page);
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

  //get value from Get Assign Jobs page to variable
  //$scope.GetrefJobID = "-K_TaUNGfsnHpQdKs42B";
  
  //////////this for testing only //////
  // jobInfo.jobId = "-K_xGNfYq-zbVOGY4zPD";
  // $scope.GetrefJobID = "-K_xGNfYq-zbVOGY4zPD";
  // $scope.GetrefJobPin = "B1";
  // $scope.GetrefJobProv = "Songkhla";
  // $scope.GetrefJobArea = "phagan";
  // $scope.GetrefJobDate = "06/01/2017";
  // $scope.GetrefJobTool = "Water-level";
  // console.log("GetrefJobID : "+$scope.GetrefJobID);
  // console.log("Tool : "+$scope.GetrefJobTool);
  //////////////////////////////////////////////////

  $scope.GetrefJobID=jobInfo.jobId;
  $scope.GetrefJobPin=jobInfo.jobPin;
  $scope.GetrefJobProv=jobInfo.jobProv;
  $scope.GetrefJobArea=jobInfo.jobArea;
  $scope.GetrefJobDate=jobInfo.jobDate;
  $scope.GetrefJobTool=jobInfo.jobTool;
  $scope.GetrefJobLocate=jobInfo.jobLocate;

  
  var objRec = $firebaseObject(refJobsRec.child(jobInfo.jobId));
  var objGraphData = [];
  var objGraphLabels = [];
  
     // to take an action after the data loads, use the $loaded() promise
     objRec.$loaded().then(function() {
         // To iterate the key/value pairs of the object, use angular.forEach()
         $scope.objRec = objRec;
         $scope.hideLoading();
         angular.forEach(objRec, function(value, key) {
            //console.log("key ", key, "val ", value);
            // angular.forEach(value, function(val2, key2){
            //   if(key2!==''){
            //   console.log("key2 ", key2, "val2 ", val2);
            //   }
            // })
            // objGraphData.push(value);
         });
     // console.log("objGraphData : ",objGraphData);
      });


      //Start graph
      var dataArray=[]
      var graphData=[]
      var dataForCheckIndex=[]
      var indexArray=[]
      var labelsArray=[]
      var labelsData=[]

      var refGraph = refJobsRec.child(jobInfo.jobId).child('graph')

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
          console.log("Last data at : ",max);

            for(i=0;i<=max;i++){
              var data = i.toString()
              labelsArray.push(data);
            }
          console.log("labelsArray : ",labelsArray);



          if(jobInfo.jobTool=="One-man"){
            graphData = [];
            labelsData = [];
            graphData = dataArray.slice(0, max+1);
            labelsData = labelsArray;
            console.log("tool is One-man graphData : ",graphData);
            console.log("labelsData : ",labelsData);

          }else{

            graphData = [];
            labelsData = [];
            for (i=0;i<max+1;i++){
                if ((i+2)%2==0) {
                    graphData.push(dataArray[i]);
                    labelsData.push(labelsArray[i]);
                }
            }
            console.log("tool is Water-level graphData : ",graphData);
            console.log("labelsData : ",labelsData);

          }

          initChart();
 

        })



function initChart() {

    Highcharts.chart('container', {
        chart: {
            type: 'line',
            zoomType: 'x',
            resetZoomButton: {
              theme: {
              display: 'none'
              }
            }
        },
        legend: {
            enabled: false
        },
        title: {
            text: false
        },
        subtitle: {
            text: false
        },
        xAxis: {
            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            categories: labelsData
        },
        yAxis: {
            title: {
                text: false
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: false
            }
        },
        series: [{
                name: 'stat',
                //data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                data: graphData
            }]
    });
};







     //End graph


    //check tools from jobs assign detect tool type
    $scope.toolType = function() {
      //if 2man tool
      //return "odd"
      //if 1man tool
      //return "all"
      if(jobInfo.jobTool=='One-man'){
        return "all"
      }else if(jobInfo.jobTool=='Water-level'){
        return "even"
      }
    }
  

    $scope.editSlopePopup = function() {
      //console.log("Key for edit Slope : "+refJobsRec);
      $scope.editSlopeData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editSlopePopup.html',
        title: 'Edit Slope',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              var newSlope=$scope.editSlopeData.slopeInTxt;
              refJobsRec.child(jobInfo.jobId).update({slope:newSlope});
              console.log("New Slope : ",newSlope);
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
  
    
    $scope.editMeterPopup = function(key) {
      //console.log("Key for edit Slope : "+refJobsRec);
      $scope.editMeterData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editMeterPopup.html',
        title: 'Edit Meter (One-man)',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              var objNewMeter=$scope.editMeterData.meterInTxt;
              // console.log("meter key : ",key);
              //console.log("meter keyItem : ",keyItem);
              // console.log("objNewMeter : ",objNewMeter);
              //refJobsRec.child($scope.GetrefJobID).update(objNewMeter);
              refJobsRec.child(jobInfo.jobId).child(key).push(objNewMeter);   
              
              //One man tool
              //minus width of tool 1.05m
              refJobsRec.child(jobInfo.jobId).child('diff').child(key).set((objNewMeter/100)-1.05);
              var GraphItem = 1.05;
              var refDiff=refJobsRec.child(jobInfo.jobId).child('diff');
              refDiff.limitToFirst(parseInt(key)+1).on("value",function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                  var childData = childSnapshot.val();
                  // console.log("childSnapshot Inside : ",childData);
                  GraphItem = GraphItem + childData
                  // console.log("GraphItem Inside : ",GraphItem);
                }) 
              })
              console.log("GraphItem : "+GraphItem);
              //Sum of diff show on graph
              refJobsRec.child(jobInfo.jobId).child('graph').child(key).set(GraphItem.toFixed(3));           
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
    
 
    if(jobInfo.jobTool=='Water-level'){
      refJobsRec.child(jobInfo.jobId).child(0).set([0,0]);
      refJobsRec.child(jobInfo.jobId).child("graph").child(0).set("0");
      refJobsRec.child(jobInfo.jobId).child("diff").child(0).set(0);
    }
    
    
    $scope.edit2MeterPopup = function(key) {
      //console.log("Key for edit Slope : "+refJobsRec);
      $scope.edit2MeterData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'edit2MeterPopup.html',
        title: 'Edit Meter (Water-level)',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              var objNew2MeterPole1=$scope.edit2MeterData.pole1InTxt;
              var objNew2MeterPole2=$scope.edit2MeterData.pole2InTxt;
              console.log("2 meter key : ",key);
              //console.log("meter keyItem : ",keyItem);
              console.log("pole 1 : ",objNew2MeterPole1);
              console.log("pole 2 : ",objNew2MeterPole2);

              refJobsRec.child(jobInfo.jobId).child(key).push([objNew2MeterPole1,objNew2MeterPole2]);
              
              //Water level tool
              refJobsRec.child(jobInfo.jobId).child('diff').child(key).set(-((objNew2MeterPole1/100)-(objNew2MeterPole2/100)).toFixed(3));
              var GraphItem = 0;
              var refDiff=refJobsRec.child(jobInfo.jobId).child('diff');
              refDiff.limitToFirst(parseInt(key)+1).on("value",function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                  var childData = childSnapshot.val();
                  //console.log("childSnapshot Inside : ",childData);
                  GraphItem = GraphItem+childData
                  //console.log("GraphItem Inside : ",GraphItem);
                }) 
              })
              // console.log("GraphItem : "+GraphItem);
              // //Sum of diff show on graph
              refJobsRec.child(jobInfo.jobId).child('graph').child(key).set(GraphItem.toFixed(3));           
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
    
    

    $scope.editNotePopup = function(key) {
      //console.log("Key for edit Slope : "+refJobsRec);
      $scope.editNoteData = {};
      var myPopup = $ionicPopup.show({
        templateUrl: 'editNotePopup.html',
        title: 'Add Note',
        //subTitle:'',
        value:$scope.editNoteData.noteInTxt=objRec.note[key],
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              var objNewNote=$scope.editNoteData.noteInTxt;
              console.log("Note key : ",key);
              //console.log("meter keyItem : ",keyItem);
              console.log("objNewNote : ",objNewNote);
              refJobsRec.child(jobInfo.jobId).child('note').child(key).set(objNewNote);
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


  //slide page script

  $scope.data = {};
  // $scope.data.bgColors = [];
  // $scope.data.currentPage = 0;

  // for (var i = 0; i < 10; i++) {
  //   $scope.data.bgColors.push("bgColor_" + i);
  // }

  var setupSlider = function() {
    //some options to pass to our slider
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    //create delegate reference to link with slider
    $scope.data.sliderDelegate = null;

    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      if (newVal != null) {
        $scope.data.sliderDelegate.on('slideChangeEnd', function() {
          // $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };

  setupSlider();





  });











  
