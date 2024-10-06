var airportsList;
/************************************/

function load_airports_list() {
  airportsList = JSON.parse(airport_list);

  for (i = 0; i < airportsList.length; i++) {
    airportsList[i].Show = airportsList[i].AirportName + ", " +  airportsList[i].CountryName + " (" + airportsList[i].AirportCode +")" ;
  }

  aui_init_search_list(airportsList);
  console.log("load_airport_code done!");
}

function save_airport_value(question, value) {
  console.log("question:", question);
  console.log("value:", value);

  api.fn.answers({Core_Q6_2_AirportCode:   value.AirportCode}); 
  api.fn.answers({Core_Q6_2_AirportName:   value.AirportName}); 
  api.fn.answers({Core_Q6_2_CountryCode:   value.CountryCode}); 
  api.fn.answers({Core_Q6_2_CountryName:   value.CountryName}); 

  console.log("save_airport_value  done!");
}

function show_airport_search_box(question) {
  load_airports_list();
  
  var defaultValue = "";

  aui_show_external_search_box(question, defaultValue);
}

function hide_airport_search_box() {
  aui_hide_external_search_box();
}