$(function() {
    var current = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(current)
});

var currentTime = moment().hour();

var weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

var weekday = today.getDay();

// Get Input text with save button
var agenda = JSON.parse(localStorage.getItem("agenda")) || {};

$(".saveBtn").on('click', function(event) {
    // this gets closest class= row
    var row = $(this).closest('.row');
    // this looks with the row class the next input box
    var input = row.find('input[type=text]');
    // finds id of searched input
    var inputID = input.attr('id');
    agenda[inputID] = input.val();
    // console.log(input.attr('class'), input.attr('id'), input.attr('type'), input.val());
    localStorage.setItem("agenda", JSON.stringify(agenda));
});

// look for all input field with a text type & print on time row
$(":text").each(function() {
    const id = $(this).attr('id');
    console.log(id + ': ', agenda[id]);
    $(this).val(agenda[id]);
});

// Color code events: past, present, future
var currentTime = moment().format('h a');
$(".time-item").each(function() {
    // find all time-item elements
    // loop through each time-item to get h4
    // use moment to convert selected time
    const timeName = $(this).find('h4');
    var timeItem = timeName.text();
    var inputTime = moment(timeItem, "h:mm a").format('h a');

    var row = $(this).closest('.row');
    // this looks with the row class the next input box
    var input = row.find('input[type=text]');    
    if(inputTime < currentTime){
        input.css("background-color", "lightgrey")
    } 
    else if(inputTime > currentTime) {
        input.css("background-color", "#81d64f")
    } else {input.css("background-color", "#ed5a5a")}

});

var lastDate = null;

  var nav = new DayPilot.Navigator("nav", {
    selectMode: "week",
    onBeforeCellRender: function(args) {
      if (args.cell.day < DayPilot.Date.today()) {
        args.cell.cssClass = "navigator-disabled-cell";
      }
    },
    onTimeRangeSelect: function(args) {
      if (args.day < DayPilot.Date.today()) {
        args.preventDefault();
        nav.select(lastDate, {dontNotify: true, dontFocus: true});
      }
      else {
        lastDate = args.start;
      }
    },
    onTimeRangeSelected: function(args) {
      dp.startDate = args.start;
      dp.update();
    }
  });
  nav.init();

  var dp = new DayPilot.Calendar("dp", {
    viewType: "Week",
    onTimeRangeSelected: function (args) {
      DayPilot.Modal.prompt("Create a new event:", "Event 1").then(function(modal) {
        var dp = args.control;
        dp.clearSelection();
        if (!modal.result) { return; }
        dp.events.add(new DayPilot.Event({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          text: modal.result
        }));
      });
    },
    onBeforeCellRender: function(args) {
      if (args.cell.start < DayPilot.Date.today()) {
        args.cell.disabled = true;
        args.cell.backColor = "#eee";
      }
    }
  });
  dp.events.list = [
    {
      id: "1",
      start: DayPilot.Date.today().addHours(10),
      end: DayPilot.Date.today().addHours(12),
      text: "Event 1"
    }
  ];
  dp.init();