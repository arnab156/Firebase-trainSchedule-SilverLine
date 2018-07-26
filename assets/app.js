
   // Initialize Firebase
      var config = {
      apiKey: "AIzaSyCj7o8z4W7nyaWd_poJbDDt2stwNWaIJPk",
      authDomain: "silverlineproject-f8c21.firebaseapp.com",
      databaseURL: "https://silverlineproject-f8c21.firebaseio.com",
      projectId: "silverlineproject-f8c21",
      storageBucket: "",
      messagingSenderId: "596274034431"
    };
  firebase.initializeApp(config); 
    var database = firebase.database();
    // Create a variable to reference the database
    var trainNum = "";
    var destination = "";
    var frequency = 0;
    var firstTrain = "00:00";

      // Capture Button Click
      $("#addTrain").on("click", function(event) {
      // Don't refresh the page!
        event.preventDefault();

        // YOUR TASK!!!
        var frequency = 0;
        // Code in the logic for storing and retrieving the most recent user.
        trainNum = $("#train-num").val();
        destination = $("#train-destination").val();
        frequency = $("#frequency").val();
        firstTrain = $("#first-train").val();
        
        database.ref().push({
            trainNum: trainNum,
            destination: destination,
            frequency: frequency,
            firstTrain: firstTrain,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
      }); 
    
  database.ref().on("child_added", function(snapshot) {
      console.log(snapshot.val());
      console.log(snapshot.key);
      console.log(snapshot.val().destination);
      var createRow = function() {
    
      var tBody = $("tbody");
      var tRow = $("<tr>");
      
      var trainNum = $("<td>").text(snapshot.val().trainNum);
      var destination = $("<td>").text(snapshot.val().destination);
      var frequency = snapshot.val().frequency; //ok returns number
      var firstTime = snapshot.val().firstTrain; //returns correct first time 
       
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      // console.log(firstTimeConverted);
      
      // Current Time
      var currentTime = moment();
      // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // console.log("DIFFERENCE IN TIME: " + diffTime);
      // Time apart (remainder)
      var tRemainder = diffTime % frequency;
      // console.log(tRemainder); // working
      // Minute Until Train
      var tMinutesTillTrain =  frequency - tRemainder;
      var minAway = $("<td>").text(tMinutesTillTrain);
      // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
      // CHANGE COLOR OF TEXT WHEN TRAIN IS CLOSE
       if (tMinutesTillTrain<5){
         minAway.addClass("text-warning");
       } 
      // Next Train
    
      var nextTrainpre = moment().add(tMinutesTillTrain, "minutes");
      // console.log("next train: " + nextTrainpre.format('LT'));
      var nextTrain =  $("<td>").text(nextTrainpre.format('LT'));
      // console.log("ARRIVAL TIME: " + moment(nextTrain).format('LT')); // wrong
      
      var departureTime = $("<td>").text(moment().add((tMinutesTillTrain+5), "minutes").format('LT'));
      // console.log("departure TIME: " + moment(departureTime).format("hh:mm")); //wrong

      var editBtn = $("<button type='button' data-toggle='modal' data-target='#exampleModal'> Edit</button>");
      var deleteBtn = $("<button> Delete</button>");
      editBtn.attr({
        "class": "edit btn btn-warning",
        "data-id": snapshot.key,
      });
      deleteBtn.attr({
        "class": "del btn btn-danger",
        "data-id": snapshot.key,
      });
      tRow.append(trainNum,destination,minAway,nextTrain,departureTime,editBtn,deleteBtn);
      
      tBody.append(tRow);
 
  };

  createRow();

  });

  $(document).on("click", ".edit", function(){
    var id  = $(this)[0].dataset.id;
    var trainNum = prompt ("enter train") ;
    var destination = prompt ("enter new destination");
    var frequency = prompt("new fre");
    var firstTrain = prompt("military time ");
    
    editTrain(id,trainNum,destination,frequency,firstTrain);
  })

  function editTrain (id,trainNum,destination,frequency,firstTrain){
    database.ref("id").set({
              trainNum: trainNum,
              destination: destination,
              frequency: frequency,
              firstTrain: firstTrain
      })
    location.reload();
}

  $(document).on("click", ".del", function(){
    var id  = $(this)[0].dataset.id;
    database.ref(id).remove();
    location.reload();
  })

  setInterval(function(){

    location.reload();
  }, 60000)

//   //Triggers Modal
//   $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
//   })
// $(document).ready(function() {
//     $("#exampleModal").modal();
//   });

// $(function(){
//     $('#exampleModal').modal({
//        show:true,
//        backdrop:'static'
//     });
//      //now on button click
//       $('#exampleModal').modal('show');
//     });

// $('#trigger').click(function () {
// 	$('#exampleModal').modal({show : true});
// });