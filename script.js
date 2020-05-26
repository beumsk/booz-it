// BOOZ-IT animation on load
// END mechanism for current rules (remove from array, create message)
// resumeIt to take into account player change? -> names, rules, etc.

var turn = 0;
var players = [];
var currentRules = [];

var introText = "<h2>Before starting... </h2><p>Follow the game rules to fully enjoy it.</p><p>Tap the screen to switch to the next game rule.</p><p>It's up to you to be reasonable and up to everybody to Enjoy!</p>";
var outroText = "<h2>Great game!</h2><p>Click to come back to the main screen and start another game!</p>";

// $("#player1").focus();

// click "more players" button to add players + empty input event
$("#add-player-btn").on("click", function() {
  var playerID = $("input[id^='player']").length + 1;
  $(this).before('<div class="form-group"> <label for="player' + playerID + '" class="sr-only">Player ' + playerID + '</label> <input class="form-control form-control-sm input" id="player' + playerID + '" type="text" placeholder="Player ' + playerID + '"> <span class="empty empty' + playerID + '" aria-hidden="true">&times;</span> </div>');
  $(".empty" + playerID).on("click", function() {
    $(this).prev("input").val("");
  });
});

// click "Play" button to save players names and reach game page
$("#start-btn").on("click", function() {
  savePlayers();
  // show game page if players.length >= 2
  if (players.length >= 2) {
    startIt(players.length, introText);
  }
  else {
    $("#errors").text("You must have at least 2 players.");
  }
});

// click game page to reach next instruction
$("#text").on("click", function() {
  if (instructions.length > 0) {
    colorSwitch();
    // get random  instruction and name 
    var randomInstruction = Math.floor(Math.random() * instructions.length);
    var randomPlayer = Math.floor(Math.random() * players.length);
    var randomPlayer2 = Math.floor(Math.random() * players.length);
    // make sure players are not identical
    while (randomPlayer2 === randomPlayer) {
      randomPlayer2 = Math.floor(Math.random() * players.length);
    }
    // create actual instruction
    var instruction = instructions[randomInstruction].text
    .replace("111", players[randomPlayer])
    .replace("222", players[randomPlayer2])
    .replace("DDD", instructions[randomInstruction].sips);
    instruction.replace("a", "!");
    // if game has at least 3 players
    if (players.length >= 3) {
      var randomPlayer3 = Math.floor(Math.random() * players.length);
      // make sure players are not identical
      while (randomPlayer3 === randomPlayer || randomPlayer3 === randomPlayer2) {
        randomPlayer3 = Math.floor(Math.random() * players.length);
      }
      instruction = instruction.replace("333", players[randomPlayer3]);
    }
    $("#text").html("<p>" + instruction + "</p>");
    // add instruction if general rule
    if (instructions[randomInstruction].nr === -1) {
      currentRules.push(instructions[randomInstruction].text);
    }
    // remove instruction from array
    delete instructions[randomInstruction];
    instructions = instructions.filter(Boolean);
  }
  // end of game
  else if (instructions.length === 0) {
    endIt();
  }
  else {
    stopIt();
  }
});

// submit new rule
$("#add-rule-btn").on("click", function() {
  if ($("#rule").val() !== "") {
    instructions.push({nr: 0, sips: 3, text:$("#rule").val()});
  }
  screenSwitch("#play-screen");
});

// go back to main screen from list of current rules
$("#rules-ok-btn").on("click", function() {
  screenSwitch("#play-screen");
});

// click stop button to return on players page
$("#stop-btn").on("click", function() {
  stopIt();
});

// click new rule button to add a rule
$("#new-rule-btn").on("click", function() {
  screenSwitch("#new-rule-screen");
  $("#rule").val("").focus();
});

// click current rule button to see list of current rules 
$("#current-rules-btn").on("click", function() {
  screenSwitch("#rules-screen");
  $("#rules-list").html("");
  if (currentRules.length > 0) {
    currentRules.forEach(function(val) {
      $("#rules-list").append("<p>"+val+"</p>");
    });
  }
  else {
    $("#rules-list").append("<p>There is no general rules at the moment.</p>");
  }
});

// click on resume to resume the game
$("#resume-btn").on("click", function() {
  resumeIt();
});

// click on x to empty input
$(".empty").on("click", function() {
  $(this).prev("input").val("");
});

// click "Restart" button to save players names and reach game page
$("#restart-btn").on("click", function() {
  startIt(players.length, introText);
});

// click Change players button to return on players page
$("#change-btn").on("click", function() {
  $("#resume-btn").addClass("d-none");
  stopIt();
});

// start the game
function startIt(nPlayer, text) {
  // make sure currentRules array is emptied 
  currentRules.length = 0;
  // take all instructions if players are 3 or more
  if (nPlayer >= 3) {
    instructions = instructionsLibrary.slice();
  }
  // remove instructions design for more than 2 players
  else if (nPlayer >= 2) {
    instructions = instructionsLibrary.slice();
    instructions = instructions.filter(function(val) {
      return val.nr <= 2;
    });
  }
  screenSwitch("#play-screen");
  $("#text").html(text);
  $("#resume-btn").removeClass("d-none");
  console.log(instructions.length, players);
}

function resumeIt() {
  // $("#text").html("Click to continue your game.");
  screenSwitch("#play-screen");
}

// end of game
function endIt() {
  screenSwitch("#end-screen");
}

// stop the game
function stopIt() {
  screenSwitch("#players-screen");
  $("#player1").focus();
}

// save players in array
function savePlayers() {
  // make sure to empty players array
  players.length = 0;
  // save players
  var playersElts = $("input[id^='player']");
  for(var i = 0; i <= playersElts.length-1; i++) {
    if (playersElts[i].value !== "") {
      players.push(playersElts[i].value.toUpperCase());
    }
  }
}

function screenSwitch(toShow) {
  colorSwitch();
  $("[id$='-screen']").addClass("d-none");
  $(toShow).removeClass("d-none");
}

var instructions = [];
var instructionsLibrary = [
  // {nr: 0, sips: 3, text: ""}
  
  // general rule
  {nr: -1, sips: 3, text: "Everybody drinks from their bad hand until further notice. Drink 3 sips everytime you fail."},
  // one turn rule
  {nr: 1, sips: 3, text: "111, start one turn of Truth or Dare with the player on your right."},
  {nr: 1, sips: 3, text: "111, start one turn of rock-paper-cisors with the player on your right."},
  {nr: 1, sips: 3, text: "111, start one turn of Never have I ever."},
  // confess rules
  {nr: 1, sips: 3, text: "111, confess your biggest fear or drink DDD sips."},
  {nr: 1, sips: 3, text: "111, confess your latest lie or drink DDD sips."},
  // get judged rules
  {nr: 1, sips: 3, text: "111, show your best celebration. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  {nr: 1, sips: 3, text: "111, show your best dance move. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  {nr: 1, sips: 3, text: "111, tell your best pick up line. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  // serie rules
  {nr: 1, sips: 3, text: "111, start a serie of beers. The first to repeat or fail drinks DDD sips."},
  {nr: 1, sips: 3, text: "111, start a serie of countries. The first to repeat or fail drinks DDD sips."},
  {nr: 1, sips: 3, text: "111, start a serie of car brands. The first to repeat or fail drinks DDD sips."},
  {nr: 1, sips: 3, text: "111, start a serie of computer brands. The first to repeat or fail drinks DDD sips."},
  {nr: 1, sips: 3, text: "111, start a serie of Disney movies. The first to repeat or fail drinks DDD sips."},
  // contest rules
  {nr: 2, sips: 3, text: "111 and 222, play rock-paper-scissors against each other. The winner distributes DDD sips."},
  {nr: 2, sips: 3, text: "111 and 222, the first to finish his drink distributes DDD sips."},
  {nr: 2, sips: 3, text: "111 and 222, wrestle. The winner distributes DDD sips."},
  // dilemma rules
  {nr: 2, sips: 3, text: "111, ask a dilemma question to 222. He drinks if he doesn't answer."},
  // role rules
  {nr: 2, sips: 3, text: "111, you are now 222's mirror. You drink every sip s-he drinks from the game."},
  // pointing rules
  {nr: 3, sips: 3, text: "Everybody, point to the dumbest player. He will distribute DDD sips."},
  {nr: 3, sips: 3, text: "Everybody, point the geekiest player. He will distribute DDD sips."},
  // compare rules
  {nr: 3, sips: 3, text: "111, between 222 and 333, who is the best at FIFA?"}
];
// console.log(instructions.length);

function colorSwitch() {
  $("#window").css("background-color", colors[turn]);
  turn = (turn >= colors.length-1) ? turn = 0 : turn += 1;
}

var colors = [
  "#e53935",
  "#fb8c00",
  "#fdd835",
  "#43a047",
  "#1e88e5",
  "#3949ab",
  "#8e24aa"
];
