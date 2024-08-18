var flightRawList;
var flightList = [];
var flightShortList = [];
var flightForInterview;
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function is_gate_valid (gate_zone, Schengen) {
  var result = false;
  //gate A (1) ==> only show Schengen: 
  //gate B (2) or T (3) ==> only show Non-Schengen: 
  if (gate_zone == "1")  
  {
    if (Schengen == "S") result = true;
  } else if (gate_zone == "2" || gate_zone == "3")
  {
    if (Schengen == "N") result = true;
  }
  return result;
}

 function flight_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          return true;
        }
      }
    }
  }
  return false;
}

function notDeparted_flight_search(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Europe/Budapest', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  //plus  4 hour
  flight_time_value = flight_time_value + 240;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function load_flight_list() {
  flightRawList = JSON.parse(MUC_Departures_Flight_List_Raw);
  flightList = [];
  flightList.length = 0;
  flightShortList = [];
  flightShortList.length = 0;

  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if ((flight.Date == getToDate() && notDeparted_flight_search(flight.Time)) //today flight && departure
    ) 
    {
      {
        
        var Date = '"Date"' + ":" + '"' +  flightRawList[i].Date + '", ';
        var Time = '"Time"' + ":" + '"' +  flightRawList[i].Time + '", ';
        var Flight = '"Flight"' + ":" + '"' +  flightRawList[i].Flight + '", ';
        var Airline = '"Airline"' + ":" + '"' +  flightRawList[i].Airline + '", '; //name
        var AirlineCode = '"AirlineCode"' + ":" + '"' +  flightRawList[i].AirlineCode + '", ';//code
        var Dest = '"Dest"' + ":" + '"' +  flightRawList[i].Dest + '", ';
        var DestName = '"DestName"' + ":" + '"' +  flightRawList[i].DestName + '", ';
        var Via = "";
        var ViaName = "";

        if (  flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Via = '"Via"' + ":" + '"' +  flightRawList[i].Next + '", ';
          ViaName = '"ViaName"' + ":" + '"' +  flightRawList[i].NextName + '", ';
        }

        var Show = '"Show"' + ":" + '"' +  flightRawList[i].Flight + " (" 
        Show += flightRawList[i].Time + " to " + flightRawList[i].DestName ;
        if (flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Show += " via " +  flightRawList[i].Next ;
        }
        Show +=")";

        var str = '{' + Date + Time + AirlineCode + Airline + Flight +  Dest + DestName + Via + ViaName +  Show + '"}';
      
        flightList.push(JSON.parse(str));
      }
    }
  }
}

function update_drop_box_list() {
  var input = document.getElementById('inputFlightCodeID').value;
  var searchList = document.getElementById('flightDropBoxList');
  
  searchList.innerHTML = '';
  flightShortList = [];
  flightShortList.length = 0;

  input = input.toLowerCase();

  var count = 0;
  for (i = 0; i < flightList.length; i++) {
    let flight = flightList[i];
    var today = getToDate();
    
    if (today == flight.Date)
    { 
      if (flight.Show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = flight.Show;
        searchList.appendChild(elem);
        flightShortList.push(flight);
        count++;
      }
    }
    
    if (count > 10) {
      break;
    }
  }

  if (flight_in_list_found(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeID').value);
  }  
  
  console.log("search flight done!");
}

function select_flight() {
  var selectedFlight = document.getElementById('inputFlightCodeID').value;
  var found = false;

  for (i = 0; i < flightShortList.length; i++) {
    var currentFlight = flightShortList[i];
    if (currentFlight.Show == selectedFlight) { 
      //store detail data here
      //Search engine to produce Flight no., Airline, Destination, Via - to be added later
      flightForInterview = currentFlight;
      console.log("currentFlight_v1: ", flightForInterview);
      found = true;
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}


function select_flight_v2(result_data) {
  var selectedFlight = document.getElementById('inputFlightCodeID').value;
  var found = false;
  var today = getToDate();
  if (result_data.Date === today){
    found = true;
    flightForInterview = flightList[selectedFlight];
    console.log("currentFlight_v2: ", flightForInterview);
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}


