// current rules END mechanism (remove from array, create message)
// pointing rules only for 3+ players
// stopit vs pauseit // startit vs resumeit
// truth or dare
// dilemma

var turn = 0;
var moreCount = 2;
var players = [];
var currentRules = [];

var introText = "<h2>Before starting... </h2><p>Follow the game rules to fully enjoy it.</p><p>Tap the screen to switch to the next game rule.</p><p>It's up to you to be reasonable and up to everybody to Enjoy!</p>";
var outroText = "<h2>Great game!</h2><p>Click to come back to the main screen and start another game!</p>";

// $("#player1").focus();

// click "more players" button to add players
$("#more").on("click", function() {
  moreCount++;
  $("#more").before('<div class="form-group"> <label for="player' + moreCount + '" class="sr-only">Player ' + moreCount + '</label> <input class="form-control form-control-sm input" id="player' + moreCount + '" type="text" placeholder="Player ' + moreCount + '"> </div>');
});

// click "Play" button to save players names and reach game page
$("#play").on("click", function() {
  players.length = 0;
  // save players
  for(i=1; i<=moreCount; i++) {
    if ($("input[id='player" + i + "']").val() !== "") {
      players.push($("input[id='player" + i + "']").val().toUpperCase());
    }
  }
  console.log(players);
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
  else if (instructions.length === 0) {
    // end of game message
    $("#text").html(outroText);
  }
  else {
    stopIt();
  }
});

// submit new rule
$("#add").on("click", function() {
  if ($("#rule").val() !== "") {
    instructions.push({nr: 0, sips: 3, text:$("#rule").val()});
  }
  screenSwitch("#screen");
});

// go back to main screen from list of current rules
$("#rules-ok").on("click", function() {
  screenSwitch("#screen");
});

// click stop button to return on players page
$("#stop").on("click", function() {
  stopIt();
});

// click new rule button to add a rule
$("#new-rule").on("click", function() {
  colorSwitch();
  screenSwitch("#new-rule-form");
  $("#rule").val("").focus();
});

// click current rule button to see list of current rules 
$("#current-rules").on("click", function() {
  colorSwitch();
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

// start the game
function startIt(nPlayer, text) {
  colorSwitch();
  if (nPlayer >= 3) {
    instructions = instructionsLibrary.slice();
  }
  else if (nPlayer >= 2) {
    instructions = instructionsLibrary.slice();
    instructions = instructions.filter(function(val) {
      return val.nr <= 2;
    });
  }
  screenSwitch("#screen");
  $("#text").html(text);
  console.log(instructions.length);
}

function pauseIt() {
  
}

function resumeIt() {
  
}

// stop the game
function stopIt() {
  colorSwitch();
  screenSwitch("#players-form");
  $("#player1").focus();
  // empty players and current Rules arrays
  players.length = 0;
  currentRules.length = 0;
}

function screenSwitch(toShow) {
  $("#players-form, #screen, #rules-screen, #new-rule-form").addClass("d-none");
  $(toShow).removeClass("d-none");
}

var instructions = [];
var instructionsLibrary = [
  // {nr: 0, sips: 3, text: ""}
  
  // general rule
  {nr: -1, sips: 3, text: "Everybody drinks from their bad hand until further notice. Drink 3 sips everytime you fail."},
  // one turn rule
  {nr: 0, sips: 3, text: "Everybody, do one turn of Never have I ever."},
  // pointing rules
  // {nr: 0, sips: 3, text: "Everybody, point to the dumbest player. He will distribute DDD sips."},
  {nr: 0, sips: 3, text: "Everybody, point the geekiest player. He will distribute DDD sips."},
  // confess rules
  // {nr: 1, sips: 3, text: "111, confess your biggest fear or drink DDD sips."},
  {nr: 1, sips: 3, text: "111, confess your latest lie or drink DDD sips."},
  // get judged rules
  // {nr: 1, sips: 3, text: "111, show your best celebration. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  // {nr: 1, sips: 3, text: "111, show your best dance move. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  {nr: 1, sips: 3, text: "111, tell your best pick up line. The others will judge if it's good. If not, drink DDD sips. If it is, distribute those sips."},
  // serie rules
  // {nr: 1, sips: 3, text: "111, start a serie of beers. The first to repeat or fail drinks DDD sips."},
  // {nr: 1, sips: 3, text: "111, start a serie of countries. The first to repeat or fail drinks DDD sips."},
  // {nr: 1, sips: 3, text: "111, start a serie of car brands. The first to repeat or fail drinks DDD sips."},
  // {nr: 1, sips: 3, text: "111, start a serie of computer brands. The first to repeat or fail drinks DDD sips."},
  {nr: 1, sips: 3, text: "111, start a serie of Disney movies. The first to repeat or fail drinks DDD sips."},
  // contest rules
  // {nr: 2, sips: 3, text: "111 and 222, play rock-paper-scissors against each other. The winner distributes DDD sips."},
  // {nr: 2, sips: 3, text: "111 and 222, the first to finish his drink distributes DDD sips."},
  {nr: 2, sips: 3, text: "111 and 222, wrestle. The winner distributes DDD sips."},
  // role rules
  {nr: 2, sips: 3, text: "111, you are now 222's mirror. You drink every sip s-he drinks from the game."},
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