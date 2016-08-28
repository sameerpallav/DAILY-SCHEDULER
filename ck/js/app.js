/**
     * Calendar function
     * @param meetings
*/
function Calendar(meetings){
	this.workMinutes = 1440;
	this.meetings = meetings.sort(function(a, b){return a.id - b.id;});
	this.schedule = [];
	this.meetup = {};
  this.minuteHeight = 2;
}

Calendar.prototype.dailyScheduler = function (){
	this.meetingManager();
	this.calcPosition();
	this.render();
};

Calendar.prototype.meetingManager =  function (){
     var meetup = this.meetup, i, j;

     var meetings = this.meetings;
     
     for (i=0; i < this.workMinutes; i++) {
       this.schedule[i] = [];
     }
     
     for (i = 0; i < meetings.length; i++) {

       meetup = meetings[i];
       if (meetup.start > meetup.end) {
         var temp = meetup.start;
         meetup.start = meetup.end;
         meetup.end = temp;
       }
       
       for (j=meetup.start; j<meetup.end; j++) {
         this.schedule[j].push(meetup.id);
       }
     }
};

Calendar.prototype.calcPosition = function (){
     var meetup;
     var meetings = this.meetings;
     for (i = 0; i < this.workMinutes; i++) {
       var next_conflictid = 0;
       var timeslotLength = this.schedule[i].length;
       if (this.schedule.length > 0) {
         
         for (j=0; j<this.schedule[i].length; j++) {
           meetup = meetings[this.schedule[i][j]-1];
           if (!meetup.main || meetup.main < this.schedule[i].length) {
             meetup.main = this.schedule[i].length;
             
             if (!meetup.conflictid) {
               meetup.conflictid = next_conflictid;
               
               next_conflictid++;
             }
           }
         }
       }
     }
     return meetings;
}

Calendar.prototype.render = function (){
	 var meetup = this.meetup;
	 var meetings = this.meetings;

	 for (i=0; i<meetings.length; i++) {
	   meetup = meetings[i];
	   
	   meetup.height = meetup.end - meetup.start;
	   meetup.top = meetup.start;

	   meetup.width = 600 / meetup.main;
	   
	   meetup.left = meetup.conflictid * meetup.width;
	   
	   var div = document.createElement("div");
     var content = document.createTextNode('Meeting: ' + meetup.id);
     div.appendChild(content);
     div.style.position = "absolute";
	   div.style.width = meetup.width + "px";
	   div.style.height = this.minuteHeight*meetup.height + "px";
	   div.style.top = this.minuteHeight*meetup.top + "px";
	   div.style.left = meetup.left + "px";
	   div.style.background = (function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++ ) {
              color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
      })();
	   
	   document.getElementById("calendar-dom").appendChild(div);
	 }
	 return meetings;
};


var meetings = [
    {
    "id": 1,
        "start": 60,
        "end": 150
    },
    {
    "id": 2,
        "start": 540,
        "end": 570
    },
    {
    "id": 3,
        "start": 555,
        "end": 600
    },
    {
    "id": 4,
        "start": 585,
        "end": 660
    }
];
var calendar = new Calendar(meetings);
calendar.dailyScheduler();