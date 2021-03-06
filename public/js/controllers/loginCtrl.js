angular
  .module("BMON")

  .controller(
    "loginCtrl",
    function (
      $scope,
      $firebaseAuth,
      $ionicPopup,
      $timeout,
      $location,
      sharedProp,
    ) {
      var auth = $firebaseAuth();
 

      var usersDB = firebase.database().ref("users/");

      $scope.userEmail = "";
      $scope.userPass = "";

      $scope.goNext = function (page) {
        console.log("Going to : " + page);
        $location.path(page);
      };

      $scope.$on("$viewContentLoaded", function () {
        sharedProp.hideLoading();
      });


      var userEmail, userPass

      $scope.signIn = function (user) {
        $scope.firebaseUser = null;
        $scope.error = null;
        userEmail = $scope.userEmail;
        userPass = $scope.userPass;
        if (userPass == null) {
          $scope.showAlert("กรุณาระบุรหัสผ่าน");
        }
        if (userEmail == null) {
          $scope.showAlert("กรุณาระบุอีเมล์");
        }

        auth
          .$signInWithEmailAndPassword(userEmail, userPass)
          .then(function (user) {
            sharedProp.showLoading();
            console.log("signInWithEmailAndPassword : ",user);
          })
          .catch(function (error) {
            $scope.error = error;
            sharedProp.hideLoading();
            //alert($scope.error);
            console.log("signin error : ", error);
            $scope.alertFactory(error);
          });
      };









      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function (user) {

        sharedProp.setPass(userPass);

        $("#userPass").val("");

        $scope.firebaseUser = user;

        // var isLogin = sharedProp.getIsLoginPage();
        // console.log("isLogin : " + isLogin);

        if (user != null) {

          var uid = user.uid;
          console.log("uid from loginCtrl : ",uid);
          
          if (user.emailVerified) {
            usersDB.child(user.uid).once("value", function (snap) {
              var data = snap.val();

              if (data.role == "admin") {
                $scope.$apply(function () {
                  sharedProp.setEmail(user.email);
                  usersDB.child(user.uid).update({ lastAccess: Date.now() });
                  sharedProp.hideLoading();
                  // $location.path("/locations");
                  $location.path("/managejobs");
                });
                console.log("admin");
              } else if (data.role == "leader") {
                $scope.$apply(function () {
                  sharedProp.setEmail(user.email);
                  usersDB.child(user.uid).update({ lastAccess: Date.now() });
                  $location.path("/managejobs");
                });
              }else if (data.role == "user") {
                //pass email to next page
                sharedProp.setEmail(user.email);
                setTimeout(function () {
                  $scope.$apply(function () {
                    usersDB.child(user.uid).update({ lastAccess: Date.now() });
                    sharedProp.hideLoading();
                    // $location.path("/getjobs");
                    // $location.path("/operation");
                    alert("User ถูกยกเลิกการใช่งาน");
                  });
                  // console.log("openform");
                }, 500);
              }
            });
          } else {
            console.log("รอการอนุมัติ กรุณาเช็คอีเมล์");
            sharedProp.hideLoading();
            // $('#statusReg').html("รอการอนุมัติ กรุณาเช็คอีเมล์");
            $scope.showAlert("รอการอนุมัติ กรุณาเช็คอีเมล์");
            usersDB.child(user.uid).update({ lastAccess: Date.now() });
          }
        } else {
          sharedProp.hideLoading();
          // $('#statusReg').html("กรุณาล็อกอิน");
        }
      });


      // An alert dialog
      $scope.showAlert = function (error) {
        var alertPopup = $ionicPopup.alert({
          title:
            '<center><i class="icon ion-error ion-android-warning"></i></center>',
          template: "<center>" + error + "</center>",
          buttons: [
            {
              text: "รับทราบ",
              type: "button-positive",
            },
          ],
        });

        alertPopup.then(function (res) {});
      };

      // An alert dialog
      $scope.showMessage = function (message) {
        var alertPopup = $ionicPopup.alert({
          title: "",
          template: "<center>" + message + "</center>",
          buttons: [
            {
              text: "รับทราบ",
              type: "button-positive",
            },
          ],
        });

        alertPopup.then(function (res) {});
      };

      $scope.alertFactory = function (error) {
        switch (error.message) {
          case "The email address is badly formatted.":
            $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
          case "The email address is badly formatted.":
            $scope.showAlert("กรุณาตรวจสอบความถูกต้องของอีเมล์");
            break;
          case "The password is invalid or the user does not have a password.":
            $scope.showAlert("กรุณาตรวจสอบความถูกต้องของรหัสผ่าน");
            break;
          case "There is no user record corresponding to this identifier. The user may have been deleted.":
            $scope.showAlert("ไม่พบอาสาสมัครที่ใฃ้อีเมล์นี้");
            break;
          case "Password should be at least 6 characters":
            $scope.showAlert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            break;
          case "The email address is already in use by another account.":
            $scope.showAlert("อีเมล์นี้ถูกใช้งานโดยอาสาสมัครคนอื่นแล้ว");
            break;
        }
      };

      $scope.signUpPopup = function () {
        console.log("signUpPopup");
        $scope.signUpData = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "signUpPopup.html",
          title: "สมัครสมาชิก",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "สมัคร",
              type: "button-positive",
              onTap: function (e) {
                var rareEmail = $scope.signUpData.emailInTxt;
                var Email = rareEmail.toLowerCase();
                var Pass = $scope.signUpData.passInTxt;
                var Name = $scope.signUpData.nameInTxt;
                var Surname = $scope.signUpData.surnameInTxt;
                console.log("Email : " + Email);
                signUp(Email, Pass, Name, Surname);
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function signUp(Email, Pass, Name, Surname) {
        $scope.firebaseUser = null;
        $scope.error = null;

        if (Email == null || Pass == null || Name == null || Surname == null) {
          $scope.showAlert("กรุณาใส่ข้อมูลให้ครบทุกช่อง");
          // console.log(Email,Pass,Name,Surname)
        } else {
          auth
            .$createUserWithEmailAndPassword(Email, Pass)
            .then(function (user) {
              firebase.auth().currentUser.sendEmailVerification();

              $scope.showMessage(
                "<center>กรุณายืนยันการสมัครจากลิงก์<br />ที่เราได้จัดส่งให้ทางอีเมล์ที่ใช้ในการสมัคร</center>"
              );
              // console.log("user.uid : "+user.uid);
              //rec to db
              usersDB.child(user.uid).set({
                //username: name,
                email: Email,
                name: Name,
                surname: Surname,
                // password:userPass,
                role: "user",
                regisDate: Date.now(),
                lastAccess: Date.now(),
              });
            })
            .catch(function (error) {
              $scope.error = error;
              console.log("signup error : ", error);
              $scope.alertFactory(error);
            });
        }
      }

      $scope.passResetPopup = function () {
        console.log("passReset");
        $scope.passReset = {};
        var myPopup = $ionicPopup.show({
          templateUrl: "passResetPopup.html",
          title: "ขอตั้งรหัสใหม่",
          subTitle: "",
          scope: $scope,
          buttons: [
            { text: "ยกเลิก" },
            {
              text: "ตั้งรหัส",
              type: "button-positive",
              onTap: function (e) {
                var passResetEmail = $scope.passReset.emailInTxt;
                sendRequestResetPass(passResetEmail);
              },
            },
          ],
        });
        myPopup.then(function () {});
        $timeout(function () {
          myPopup.close(); //close the popup after 3 seconds for some reason
        }, 100000);
      };

      function sendRequestResetPass(passResetEmail) {
        auth.$sendPasswordResetEmail(passResetEmail).then(
          function () {
            // Email sent.
            // alert("กรุณาเช็คอีเมล์ แล้วคลิกลิ๊งค์เพื่อตั้งรหัสผ่านใหม่");
            $scope.showMessage(
              "กรุณาเช็คอีเมล์ แล้วคลิกลิ๊งค์เพื่อตั้งรหัสผ่านใหม่"
            );
          },
          function (error) {
            $scope.alertFactory(error);
          }
        );
      }
    }
  );
