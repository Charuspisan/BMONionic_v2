// Initialize Firebase
var config = {
  apiKey: "AIzaSyAT2zGRp1nxRNbozq8RXoAprelLBSJXeLw",
  authDomain: "project-3351723142096034396.firebaseapp.com",
  databaseURL: "https://project-3351723142096034396.firebaseio.com",
  storageBucket: "project-3351723142096034396.appspot.com",
  messagingSenderId: "765512598560"
};

firebase.initializeApp(config);



    function SignUp() {
      
      var userEmail = document.getElementById('userEmail').value;
      var userPass = document.getElementById('password').value;
      
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(function(user){
          // User is signed in.
          var emailVerified = user.emailVerified;
          console.log("emailVerified working");
          if(emailVerified==false){
            console.log("if emailVerified false working");
            firebase.auth().currentUser.sendEmailVerification();
          }
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          alert(errorMessage);
          // ...
        })
        
    }

    function toggleSignIn() {
      
      var userEmail = document.getElementById('userEmail').value;
      var userPass = document.getElementById('password').value;
      
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        if (userEmail.length == 0) {
          alert('Please enter a Email');
          return;
        }
        if (userPass.length == 0) {
          alert('Please enter a Password');
          return;
        }
        // Sign in with custom token generated following previous instructions.
        // [START authwithtoken]
        firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error(errorMessage);
          alert(errorMessage);
        }).then(function(user){
          // User is signed in.
          var emailVerified = user.emailVerified;
          if(emailVerified==true){
            console.log("OK You are Verified");
          }else{
            console.log("Please Verified on Your email");
          }
        });
      }
    }

   function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          // document.getElementById('loginbt').textContent = 'Sign out';
          $('#loginbt').text('Sign out');
          console.log("Signin Ready : " + email +" Verification : "+emailVerified);

          //console.log(JSON.stringify(user, null, '  '));
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          //document.getElementById('loginbt').textContent = 'Sign in';
          $('#loginbt').text('Sign in')
          console.log("Still Signout");
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        //document.getElementById('loginbt').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]

      setTimeout(function(){
          $('#loginbt').on('click', function(){
            toggleSignIn();
          })
      }, 500);
    }

    window.onload = function() {
      initApp();
    };


// $(document).ready(function($) {
//   setTimeout(
//   function(){
//     $('#loginbt').on('click', function(){
//     //console.log('bt click');
//     toggleSignIn();
//     })
//   }, 500);

// }); 


      // auth.$onAuthStateChanged((user) => {
      //   if (user) {
      //     // If there is a user, take him to home page.
      //     //console.log("User is logged in!");
      //     firebase.auth().signOut();
      //     //console.log(user);
      //     //this.rootPage = HomePage;
      //   }
      // });