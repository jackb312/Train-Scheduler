$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyCKCT6U-nmrAsZ6-M4aAT9BnfjzTTRTyYs",
        authDomain: "train-scheduler-2f0b3.firebaseapp.com",
        databaseURL: "https://train-scheduler-2f0b3.firebaseio.com",
        projectId: "train-scheduler-2f0b3",
        storageBucket: "",
        messagingSenderId: "409778598221",
        appId: "1:409778598221:web:13702c272c8d936d14c704"
      };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
console.log(firebaseConfig.apiKey);
//global variables
var name;
var destination;
var firsttrain;
var frequency;
//button function for adding train
$("#add-train").on("click", function() {
    event.preventDefault();
    name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firsttrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();
    console.log(name);
    console.log(destination);
    console.log(firsttrain);
    console.log(frequency);
    //pushing to firebase database
    database.ref().push({
        name: name,
        destination: destination,
        firsttrain: firsttrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        //resets form after pushing to firebase
        $("form")[0].reset();
});
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    var minutesAway;
        // snapshot of first train time
    var firstTrainNew = moment(childSnapshot.val().firsttrain, "HH:mm").subtract(1, "years");
        // difference in time between first train and current moment
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        //modulus for different time and frequency
    var remainder = diffTime % childSnapshot.val().frequency;
        // minutes until next train
    var minutesAway = childSnapshot.val().frequency - remainder;
    console.log(minutesAway);
        // next train time
    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm");
    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + nextTrain + 
        "</td><td>" + minutesAway + "</td></tr>");
    // Errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});

