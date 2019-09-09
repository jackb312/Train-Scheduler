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
$("#add-train").on("click", function(event){
    event.preventDefault();
    var name = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firsttrain = $("#first-train").val().trim();
    var frequency = $("#frequency").val().trim();
    console.log(name);
    console.log(destination);
    console.log(firsttrain);
    console.log(frequency);
    database.ref().push({
        name: name,
        destination: destination,
        firsttrain: firsttrain,
        frequency: frequency,
        minutesAway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
});
database.ref().on("child_added", function(childSnapshot) {
        // Chang year so first train comes before now
    var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        // Difference between the current and firstTrain
    var diffTime = moment().diff(moment(firstTrainNew), "minutes");
    var remainder = diffTime % childSnapshot.val().frequency;
        // Minutes until next train
    var minutesAway = childSnapshot.val().frequency - remainder;
        // Next train time
    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");

    $("#add-row").append("<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination +
        "</td><td>" + childSnapshot.val().frequency +
        "</td><td>" + nextTrain + 
        "</td><td>" + minutesAway + "</td></tr>");

            // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
                // Change the HTML to reflect
        $("#train-name").html(snapshot.val().name);
        $("#destination").html(snapshot.val().email);
        $("#first-train").html(snapshot.val().age);
        $("#frequency").html(snapshot.val().comment);
    });
});
});

