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

  return [day, month, year].join('-');
}

function getTomorrow() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + (d.getDate()+1),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('-');
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

function notDeparted_flight_search(flight_date, flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  var result = false;
  
  //allow departure time range compare to the current time: -4h +4h
  
  //if next date, plus 24 hour
  if (flight_date == getTomorrow()) 
  {  
    flight_time_value = flight_time_value + 24*60;
  }

  if ((current_time_value < (flight_time_value + 240)) && (current_time_value > (flight_time_value - 240))) //within[-4h +4h]
  {
      result = true; 
  }

  return (result);
}

function load_flight_list() {
  flightRawList = JSON.parse(JED_Departures_Flight_List_Raw);
  flightList = [];
  flightList.length = 0;
  flightShortList = [];
  flightShortList.length = 0;

  
  var terminal_value = api.fn.answers().Q2; 
  var terminal  = "Terminal 1";

  if (terminal_value == 1 )
  {
    terminal  = "Terminal 1";
  }
  else if (terminal_value == 2 )
  {
    terminal  = "North Terminal";
  }
  else
  {
    terminal  = "South Terminal";
  }

  console.log("terminal_value: ", terminal_value);
  console.log("terminal: ", terminal);

  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if (
        ((flight.Date == getToDate() || (flight.Date == getTomorrow())) && notDeparted_flight_search(flight.Date, flight.Time)) //today flight && departure
        && ((flight.TER == terminal) || (terminal  == "ALL")))
    {
      {
        var item  = flightRawList[i];
        var Via = "";
        var ViaName = "";

        if (  flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Via = '"Via"' + ":" + '"' +  flightRawList[i].Next + '", ';
          ViaName = '"ViaName"' + ":" + '"' +  flightRawList[i].NextName + '", ';
        }

        var Show = flightRawList[i].Flight + " (" 
        Show += flightRawList[i].Time +" " + flightRawList[i].Date  + " to " + flightRawList[i].DestName ;
        if (flightRawList[i].Next && flightRawList[i].Next !="" && flightRawList[i].Next != flightRawList[i].Dest) {
          Show += " via " +  flightRawList[i].Next ;
        }
        Show +=")";

        item.Show = Show; 
        item.Via = Via; 
        item.ViaName = ViaName;
      
        flightList.push(item);
      }
    }
  }

  aui_init_search_list(flightList);
  console.log("Load flight list done!");
}

function save_flight_value(question, value) {
  console.log("question:", question);
  console.log("value:", value);

  api.fn.answers({flight_show:  value.Show});
  api.fn.answers({terminal: value.TER});
  api.fn.answers({flight_number:   value.Flight});

  api.fn.answers({airport_code:   value.Dest});
  api.fn.answers({airport_name: value.DestName});
  api.fn.answers({airline_code:   value.AirlineCode}); //airline code
  api.fn.answers({airline_name:   value.Airline});  //airline name
  api.fn.answers({int_dom:   value.int_dom}); //International vs. domestic

  api.fn.answers({dep_date:   value.Date}); //Date
  api.fn.answers({dep_time:   value.Time}); //Time
 

  console.log("save flight  done!");
}

function show_airport_airline_search_box(question) {
  load_flight_list();
  
  var defaultValue = "";

  aui_show_external_search_box(question, defaultValue);
}

function hide_flight_search_box() {
  aui_hide_external_search_box();
}