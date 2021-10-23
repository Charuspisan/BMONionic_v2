angular
  .module("BMON")

  .controller(
    "operationCtrl",
    function (
      $scope,
      $ionicViewService,
      $ionicPopup,
      $ionicModal,
      $timeout,
      $location,
      sharedProp,
    ) {

      $scope.goBack = function () {
        console.log("Going back");
        $ionicViewService.getBackView().go();
      };

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };


      var jobInfo = {};

      const fullURL = window.location.href;
      console.log("fullURL : "+fullURL);
      jobInfo.parentID = /jodId=([^&]+)/.exec(fullURL)[1];
      jobInfo.jobId = /pinId=([^&]+)/.exec(fullURL)[1];
      jobInfo.jobTool = /tool=([^&]+)/.exec(fullURL)[1];
      jobInfo.jobMeta = /meta=([^&]+)/.exec(fullURL)[1];

      console.log("jobInfo : ",jobInfo);

      sharedProp.setPinID(jobInfo.jobId);

      refJobsID.child(jobInfo.parentID).child("status").on("value", function (snapshot) {
        // console.log("value : ", value);
        let status = snapshot.val();
        console.log("status",status);
        if(status!="active"){
          console.log("Redirect to Unavailable page");
          sharedProp.hideLoading();
          $scope.goNext("/unavailable");
        }
      }); 

      refJobsID.child(jobInfo.parentID).child(jobInfo.jobId).on("value", function (snapshot) {
        // console.log("value : ", value);
        $scope.objID = snapshot.val();
        sharedProp.hideLoading();
        console.log("$scope.objID : ", $scope.objID);
      }); 

      refJobsRec.child(jobInfo.jobId).on("value", function (snapshot) {
        // console.log("value : ", value);
        $scope.objRec = snapshot.val();
        sharedProp.hideLoading();
        console.log("$scope.objRec : ", $scope.objRec);
      });


      sharedProp.checkChrome();
      sharedProp.getDeviceGPS();

      $scope.GetrefJobParentID = jobInfo.parentID;
      $scope.GetrefJobID = jobInfo.jobId;
      $scope.GetrefJobTool = jobInfo.jobTool;
      $scope.GetrefJobMeta = jobInfo.jobMeta;

      sharedProp.showLoading(); 

      //Start graph
      var dataArray = [];
      var graphData = [];
      var dataForCheckIndex = [];
      var indexArray = [];
      var labelsArray = [];
      var labelsData = [];
      var lastGraphData;

      var refGraph = refJobsRec.child(jobInfo.jobId).child("graph");

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

      refGraph.on("value", function (snapshot) {
        dataArray = [];
        dataForCheckIndex = [];
        labelsArray = [];

        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          if (childData == "") {
            dataArray.push(null);
            dataForCheckIndex.push(null);
            // indexArray.push(dataArray.indexOf(childData));
          } else if (childData == 0) {
            dataArray.push(0);
            dataForCheckIndex.push(0);
            // indexArray.push(dataArray.indexOf(childData));
          } else {
            dataArray.push(parseFloat(childData)); //why take effect to indexArray
            dataForCheckIndex.push(childData);
            // indexArray.push(dataArray.indexOf(childData));
          }
          indexArray.push(dataForCheckIndex.indexOf(childData));
        });

        var max = Math.max(...indexArray);
        console.log("Last data at : ", max);

        lastGraphData = Math.abs(max);

        for (i = 0; i <= max; i++) {
          var data = i.toString();
          labelsArray.push(data);
        }
        console.log("labelsArray : ", labelsArray);

        if (jobInfo.jobTool == "One-man") {
          graphData = [];
          labelsData = [];
          graphData = dataArray.slice(0, max + 1);
          labelsData = labelsArray;
          console.log("tool is One-man graphData : ", graphData);
          console.log("labelsData : ", labelsData);
        } else {
          graphData = [];
          labelsData = [];
          for (i = 0; i < max + 1; i++) {
            if ((i + 2) % 2 == 0) {
              graphData.push(dataArray[i]);
              labelsData.push(labelsArray[i]);
            }
          }
          console.log("tool is Water-level graphData : ", graphData);
          console.log("labelsData : ", labelsData);
        }

        initChart();
      });

      function initChart() {
        Highcharts.chart("container", {
          chart: {
            type: "line",
            zoomType: "x",
            resetZoomButton: {
              theme: {
                display: "none",
              },
            },
          },
          legend: {
            enabled: false,
          },
          title: {
            text: false,
          },
          subtitle: {
            text: false,
          },
          xAxis: {
            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            categories: labelsData,
            tickmarkPlacement: "on",
            title: {
              text: "เมตร",
              align: "high",
              margin: -15,
            },
          },
          yAxis: {
            tickmarkPlacement: "on",
            title: {
              text: "เมตร",
              align: "high",
              margin: -15,
            },
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: false,
              },
              enableMouseTracking: false,
            },
          },
          series: [
            {
              name: "stat",
              //data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
              data: graphData,
            },
          ],
        });
      }

      //End graph

      // check tools from jobs assign detect tool type
      $scope.toolType = function () {
        //if 2man tool
        //return "odd"
        //if 1man tool
        //return "all"
        if (jobInfo.jobTool == "One-man") {
          return "all";
        } else if (jobInfo.jobTool == "Water-level") {
          return "even";
        }
      };

      $scope.editSlopePopup = function () {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.editSlopeData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editSlopePopup.html",
          title: "บันทึกค่าความลาดชัน",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var newSlope = $scope.editSlopeData.slopeInTxt;
                refJobsRec.child(jobInfo.jobId).update({ slope: newSlope });
                console.log("New Slope : ", newSlope);
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      $scope.editMeterPopup = function (key) {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.editMeterData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editMeterPopup.html",
          title: "บันทึกค่า (One-man)",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var objNewMeter = $scope.editMeterData.meterInTxt;
                // console.log("meter key : ",key);
                //console.log("meter keyItem : ",keyItem);
                // console.log("objNewMeter : ",objNewMeter);
                //refJobsRec.child($scope.GetrefJobID).update(objNewMeter);
                // refJobsRec.child(jobInfo.jobId).child(key).set(objNewMeter);

                //One man tool
                //minus width of tool 1.05m

                var checkReEdit;
                refJobsRec
                  .child(jobInfo.jobId)
                  .child(key)
                  .once("value", function (snapshot) {
                    checkReEdit = snapshot.val();
                    // console.log("data : ",data);
                  });

                console.log("checkReEdit : ", checkReEdit);

                if (checkReEdit != "") {
                  reCalGraphDiffOne(key, objNewMeter);
                } else {
                  refJobsRec.child(jobInfo.jobId).child(key).set(objNewMeter);
                  refJobsRec
                    .child(jobInfo.jobId)
                    .child("diff")
                    .child(key)
                    .set(objNewMeter / 100 - 1.05);
                  var GraphItem = 1.05;
                  var refDiff = refJobsRec.child(jobInfo.jobId).child("diff");
                  refDiff
                    .limitToFirst(parseInt(key) + 1)
                    .on("value", function (snapshot) {
                      snapshot.forEach(function (childSnapshot) {
                        var childData = childSnapshot.val();
                        // console.log("childSnapshot Inside : ",childData);
                        GraphItem = GraphItem + childData;
                        // console.log("GraphItem Inside : ",GraphItem);
                      });
                    });
                  console.log("GraphItem : " + GraphItem);
                  //Sum of diff show on graph
                  refJobsRec
                    .child(jobInfo.jobId)
                    .child("graph")
                    .child(key)
                    .set(GraphItem.toFixed(3));
                }
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      if (jobInfo.jobTool == "Water-level") {
        refJobsRec.child(jobInfo.jobId).child(0).set([0, 0]);
        refJobsRec.child(jobInfo.jobId).child("graph").child(0).set("0");
        refJobsRec.child(jobInfo.jobId).child("diff").child(0).set(0);
      }

      $scope.edit2MeterPopup = function (key) {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.edit2MeterData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "edit2MeterPopup.html",
          title: "บันทึกค่า (Water-level)",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var objNew2MeterPole1 = $scope.edit2MeterData.pole1InTxt;
                var objNew2MeterPole2 = $scope.edit2MeterData.pole2InTxt;
                console.log("2 meter key : ", key);
                //console.log("meter keyItem : ",keyItem);
                console.log("pole 1 : ", objNew2MeterPole1);
                console.log("pole 2 : ", objNew2MeterPole2);

                var checkReEdit;
                refJobsRec
                  .child(jobInfo.jobId)
                  .child(key)
                  .once("value", function (snapshot) {
                    checkReEdit = snapshot.val();
                    // console.log("data : ",data);
                  });

                console.log("checkReEdit : ", checkReEdit);

                if (checkReEdit != "") {
                  reCalGraphDiffWater(
                    key,
                    objNew2MeterPole1,
                    objNew2MeterPole2
                  );
                } else {
                  refJobsRec
                    .child(jobInfo.jobId)
                    .child(key)
                    .set([objNew2MeterPole1, objNew2MeterPole2]);

                  //Water level tool
                  refJobsRec
                    .child(jobInfo.jobId)
                    .child("diff")
                    .child(key)
                    .set(-(objNew2MeterPole1 / 100 - objNew2MeterPole2 / 100));
                  var showDiff = -(
                    objNew2MeterPole1 / 100 -
                    objNew2MeterPole2 / 100
                  );
                  console.log("diff : " + showDiff);
                  var GraphItem = 0;
                  var refDiff = refJobsRec.child(jobInfo.jobId).child("diff");
                  refDiff
                    .limitToFirst(parseInt(key) + 1)
                    .on("value", function (snapshot) {
                      console.log("key is : " + key);
                      snapshot.forEach(function (childSnapshot) {
                        var childData = childSnapshot.val();
                        console.log("childSnapshot Inside : ", childData);
                        GraphItem =
                          parseFloat(GraphItem) + parseFloat(childData);
                        console.log("GraphItem Inside : ", GraphItem);
                      });
                    });
                  console.log("GraphItem : " + GraphItem);
                  // //Sum of diff show on graph
                  refJobsRec
                    .child(jobInfo.jobId)
                    .child("graph")
                    .child(key)
                    .set(GraphItem.toFixed(3));
                }
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      //re-calulate graph and diff
      function reCalGraphDiffWater(key, objNew2MeterPole1, objNew2MeterPole2) {
        console.log("reCalGraphDiff last graph data at : " + lastGraphData);

        refJobsRec
          .child(jobInfo.jobId)
          .child(key)
          .set([objNew2MeterPole1, objNew2MeterPole2]);

        //Water level tool
        refJobsRec
          .child(jobInfo.jobId)
          .child("diff")
          .child(key)
          .set(-(objNew2MeterPole1 / 100 - objNew2MeterPole2 / 100));

        var GraphItem = 0;
        var RunIndex = 0;
        var refDiff = refJobsRec.child(jobInfo.jobId).child("diff");
        //console.log("key is : "+key);
        refDiff
          .limitToFirst(parseInt(lastGraphData) + 1)
          .on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              console.log("RunIndex is : " + RunIndex);
              var childData = childSnapshot.val();
              console.log("childSnapshot Inside : ", childData);
              GraphItem = parseFloat(GraphItem) + parseFloat(childData);

              if (RunIndex % 2 == 0 && RunIndex <= lastGraphData) {
                console.log("GraphItem renew : ", GraphItem);
                console.log("RunIndex matching is : " + RunIndex);
                refJobsRec
                  .child(jobInfo.jobId)
                  .child("graph")
                  .child(RunIndex)
                  .set(GraphItem.toFixed(3));
              }

              RunIndex++;
            });
          });
      }

      function reCalGraphDiffOne(key, objNewMeter) {
        console.log("reCalGraphDiff last graph data at : " + lastGraphData);

        refJobsRec.child(jobInfo.jobId).child(key).set(objNewMeter);

        refJobsRec
          .child(jobInfo.jobId)
          .child("diff")
          .child(key)
          .set(objNewMeter / 100 - 1.05);

        var GraphItem = 0;
        var RunIndex = 0;
        var refDiff = refJobsRec.child(jobInfo.jobId).child("diff");
        console.log("refDiff key is : " + key);
        refDiff
          .limitToFirst(parseInt(lastGraphData) + 1)
          .on("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
              console.log("RunIndex is : " + RunIndex);
              var childData = childSnapshot.val();
              console.log("childSnapshot Inside : ", childData);
              GraphItem = parseFloat(GraphItem) + parseFloat(childData);

              if (RunIndex <= lastGraphData) {
                console.log("GraphItem renew : ", GraphItem);
                console.log("RunIndex matching is : " + RunIndex);
                refJobsRec
                  .child(jobInfo.jobId)
                  .child("graph")
                  .child(RunIndex)
                  .set(GraphItem.toFixed(3));
              }

              RunIndex++;
            });
          });
      }

      $scope.editToolPopup = function (jobIdRef) {
        console.log("Key for edit tool : " + jobIdRef);
        $scope.editToolData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editToolPopup.html",
          title: "แก้ไขชนิดของอุปกรณ์การวัด",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var newTool = $scope.editToolData.toolInTxt;
                refJobsID
                  .child($scope.GetrefJobParentID)
                  .child(jobIdRef)
                  .update({ tool: newTool });
                sharedProp.setJobTool(newTool);
                $scope.GetrefJobTool = jobInfo.jobTool;
                console.log(
                  "GetrefJobParentID : ",
                  $scope.GetrefJobParentID,
                  "jobIdRef : ",
                  jobIdRef,
                  " newTool : ",
                  newTool
                );
              },
            },
          ],
        });
        myPopup.then(function () {
          // setTimeout(function(){
          //   console.log($(".expanding").parent().parent().find(".list .item.item-accordion").length);
          //   $(".expanding").parent().parent().find(".list .item.item-accordion").css({"display":"block !important","line-height":"38px !important"})
          // }, 3000);
        });
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      $scope.editNotePopup = function (key) {
        //console.log("Key for edit Slope : "+refJobsRec);
        $scope.editNoteData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "editNotePopup.html",
          title: "บันทึกช่วยจำ",
          //subTitle:'',
          value: ($scope.editNoteData.noteInTxt = $scope.objRec.note[key]),
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "<b>บันทึก</b>",
              type: "button-positive",
              onTap: function (e) {
                var objNewNote = $scope.editNoteData.noteInTxt;
                console.log("Note key : ", key);
                //console.log("meter keyItem : ",keyItem);
                console.log("objNewNote : ", objNewNote);
                refJobsRec
                  .child(jobInfo.jobId)
                  .child("note")
                  .child(key)
                  .set(objNewNote);
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      //slide page script

      $scope.data = {};
      // $scope.data.bgColors = [];
      // $scope.data.currentPage = 0;

      // for (var i = 0; i < 10; i++) {
      //   $scope.data.bgColors.push("bgColor_" + i);
      // }

      var setupSlider = function () {
        //some options to pass to our slider
        $scope.data.sliderOptions = {
          initialSlide: 0,
          direction: "horizontal", //or vertical
          speed: 300, //0.3s transition
        };

        //create delegate reference to link with slider
        $scope.data.sliderDelegate = null;

        //watch our sliderDelegate reference, and use it when it becomes available
        $scope.$watch("data.sliderDelegate", function (newVal, oldVal) {
          if (newVal != null) {
            $scope.data.sliderDelegate.on("slideChangeEnd", function () {
              // $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
              //use $scope.$apply() to refresh any content external to the slider
              $scope.$apply();
            });
          }
        });
      };



      $ionicModal.fromTemplateUrl('takePhotosModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      $scope.$on('modal.shown', function() {
        $scope.setBG4d();
      });
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
      setupSlider();


      $scope.setBG4d = function(){

        // if($scope.objRec.img4d==undefined){
        //   alert();
        // }

        if($scope.objRec.img4d.front!=undefined){
          var refFrontimg = refStorage.child('img4d/' + $scope.objRec.img4d.front + ".jpg");
          refFrontimg.getDownloadURL().then(function (url) {
            console.log("url : "+url);
            $("#front_4d_wrapper").css(
              "background-image",
              "url('" + url + "')"
            );
          });
        }

        if($scope.objRec.img4d.right!=undefined){
          var refRightimg = refStorage.child('img4d/' + $scope.objRec.img4d.right + ".jpg");
          refRightimg.getDownloadURL().then(function (url) {
            console.log("url : "+url);
            $("#right_4d_wrapper").css(
              "background-image",
              "url('" + url + "')"
            );
          });
        }

        if($scope.objRec.img4d.back!=undefined){
          var refBackimg = refStorage.child('img4d/' + $scope.objRec.img4d.back + ".jpg");
          refBackimg.getDownloadURL().then(function (url) {
            console.log("url : "+url);
            $("#back_4d_wrapper").css(
              "background-image",
              "url('" + url + "')"
            );
          });
        }

        if($scope.objRec.img4d.left!=undefined){
          var refLefttimg = refStorage.child('img4d/' + $scope.objRec.img4d.left + ".jpg");
          refLefttimg.getDownloadURL().then(function (url) {
            console.log("url : "+url);
            $("#left_4d_wrapper").css(
              "background-image",
              "url('" + url + "')"
            );
          });
        }

      }
      

      $scope.Imgs4d = {
        storage:"img4d/",
        dataTarget:"4d",
        imgName:"",
        type:"",
        jobRecId:"",
        meta:""
      };


      $scope.fileNameChanged = function(event, direction) {
        console.log(event);
        console.log(jobInfo.jobMeta);
        if(direction=="other"){
          $scope.ImgOther.type=direction;
          $scope.ImgOther.meta=direction + "_" + jobInfo.jobMeta;
          $scope.ImgOther.imgName=direction + "_" + jobInfo.jobMeta + "@" + Date.now();
          $scope.ImgOther.jobRecId=jobInfo.jobId;
          sharedProp.takePic_fn(event, $scope.editNotePopupOtherImg);
        }else{
          $scope.Imgs4d.type=direction;
          $scope.Imgs4d.meta=direction + "_" + jobInfo.jobMeta;
          $scope.Imgs4d.imgName=direction + "_" + jobInfo.jobMeta + "@" + Date.now();
          $scope.Imgs4d.jobRecId=jobInfo.jobId;
          sharedProp.takePic_fn(event, upLoad4Dfn);            
        }
      }

      function upLoad4Dfn(imgData, exif) {

        console.log($scope.Imgs4d);
        img64data = imgData.split(",")[1];
        console.log(img64data);
        console.log(exif);

        sharedProp.btnUpload($scope.Imgs4d, img64data, exif);

      };

      $scope.ImgOther = {
        storage:"imgOther/",
        dataTarget:"other",
        imgName:"",
        type:"",
        jobRecId:"",
        meta:"",
        note:""
      };

      // function uploadOtherFn (imgData, exif){
      //   console.log($scope.ImgOther);
      //   img64data = imgData.split(",")[1];
      //   console.log(img64data);
      //   console.log(exif);
      //   sharedProp.btnUpload($scope.ImgOther, img64data, exif);
      // }


      $scope.editNotePopupOtherImg = function (img64data, exif) {
        //console.log("Key for edit Slope : "+refJobsRec);

        console.log("exif from editNotePopupOtherImg : ",exif);

        var myPopup = $ionicPopup.show({
          templateUrl: "editNotePopupOtherImg.html",
          title: "บันทึกช่วยจำ",
          subTitle: "คำอธิบายสำหรับรูปถ่าย",
          scope: $scope,
          buttons: [
            {
              text: "ไม่บันทึกภาพ",
              onTap: function (e) {
                $('#take-picture').val('');
              },
            },
            {
              text: "<b>บันทึกภาพ</b>",
              type: "button-positive",
              onTap: function (e) {
                otherPhotoNote = $scope.ImgOther.note;
                if (
                  otherPhotoNote == undefined ||
                  otherPhotoNote == null ||
                  otherPhotoNote == ""
                ) {
                  sharedProp.showAlert(
                    "กรุณาใส่บันทึกช่วยจำทุกครั้ง"
                  );
                  event.preventDefault();
                } else {
                  // alert("ready for upload");
                  // $scope.ImgOther.imgName = $scope.ImgOther.imgName + Date.now();
                  console.log("$scope.ImgOther : ",$scope.ImgOther);
                  sharedProp.btnUpload($scope.ImgOther, imgData, exif);
                }
              },
            },
          ],
        });
        myPopup.then(function () {});
        imgData = img64data.split(",")[1];
        setTimeout(()=>{
          // preview image
          $("#previewOtherImg").attr("src",img64data);
          if($("#previewOtherImg").attr("src").length==0){
            setInterval(()=>{
              $("#previewOtherImg").attr("src",img64data);
              console.log("waiting for preview Image");
            },1000);
          }
        },1000)
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };








  }
  );
