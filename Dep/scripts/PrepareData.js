var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentDate; //dd-mm-yyyy
var currentYear;
var currentMonth; //mm
var nextDate; //dd-mm-yyyy

var download_time;

var total_completed;
var total_completed_percent;
var total_quota_completed;
var total_hard_quota;
var total_quota;

/************************************/
function initCurrentTimeVars() {
  var today = new Date();

  var day = '' + today.getDate();
  var month = '' + (today.getMonth() + 1); //month start from 0;
  var year = today.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  currentDate = [day, month, year].join('-');
  currentYear = year;
  currentMonth =[month, year].join('-');;

  //////////
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  var tomorrowMonth = '' + (tomorrow.getMonth() + 1); //month start from 0;
  var tomorrowDay = '' + tomorrow.getDate();
  var tomorrowYear = tomorrow.getFullYear();

  if (tomorrowMonth.length < 2) tomorrowMonth = '0' + tomorrowMonth;
  if (tomorrowDay.length < 2) tomorrowDay = '0' + tomorrowDay;

  nextDate  = [tomorrowDay, tomorrowMonth, tomorrowYear].join('-');
  //////////
  if (document.getElementById('year_month') && document.getElementById('year_month').value.length > 0)
  {
    if (document.getElementById('year_month').value != "current-month")
    {
      currentMonth = document.getElementById('year_month').value;
    }
  }
 
  switch(currentMonth) {
    case "04-2024":          
      total_quota = 1410;
      break;
    case "06-2024":          
      total_quota = 1854;
      break;      
    default:
      total_quota = 1410;
      break;
  }
  
  console.log("currentMonth: ", currentMonth);
}


function isCurrentMonth(interviewEndDate)
{
// Input: "2023-04-03 10:06:22 GMT"
  var interviewDateParsed = interviewEndDate.split("-")

  var interviewYear = (interviewDateParsed[0]);
  var interviewMonth =(interviewDateParsed[1]);
  
  var result = false;

  if ( currentMonth ==[interviewMonth,interviewYear].join('-'))
  {
    result = true;
  }

   return result;
}
function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  var result = (flight_time_value > current_time_value);
  return (result);
}

function isvalid_id(id)
{
  valid = true;

  var i = 0;
  for (i = 0; i < removed_ids_data.length; i++) 
  { 
    if (removed_ids_data[i].removed_id == id)
    {
      valid = false;
    }
  }
  return valid;
}

function prepareInterviewData() {
  var quota_data_temp = JSON.parse(quota_info);
  var interview_data_full  = JSON.parse(interview_statistics);

  initCurrentTimeVars();		
  
  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    if ((quota_data_temp[i].Quota>0)
         && (quota_data_temp[i].Month == currentMonth))
    {
      quota_data.push(quota_data_temp[i]);
    }
  }
  
  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_full[0].download_time;
  for (i = 0; i < interview_data_full.length; i++) {
    var interview = interview_data_full[i];

    var interview_year = interview["InterviewDate"].substring(0,4);
    var interview_month = interview["InterviewDate"].substring(5,7);//"2023-04-01",

    if (isCurrentMonth(interview.InterviewDate))
    {
      if (interview["Survey"]) {
        var quota_id;
        var location = "";
        var survey  = "";

        if (interview["Survey"] == 1) survey = "Check-in & Departures Immigration";
        if (interview["Survey"] == 2) survey = "Commercial - Retail and F&B";
        if (interview["Survey"] == 3) survey = "Wayfinding, FIDS, Seatings & Gates, Wi-Fi";
        if (interview["Survey"] == 4) survey = "Airport Facilities - Prayer Rooms";
        if (interview["Survey"] == 5) survey = "Airport Facilities - Smoking Rooms";
        if (interview["Survey"] == 6) survey = "Accessibility";
        if (interview["Survey"] == 7) survey = "Arrival Immigration";
        quota_id = survey;

        if (interview["Location"] == 1) location = "Arrivals";
        if (interview["Location"] == 2) location = "Departures";

        if (location!="") quota_id = survey + " - " +  location;

        quota_id = '"quota_id"' + ":" + '"' +  quota_id +   '", ';
        var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewDate"] + '", ';
        var Completed_of_interviews = '"Completed_of_interviews"' + ":" + '"' +  interview["Number of interviews"] ;
        
        var str = '{' + quota_id + InterviewEndDate + Completed_of_interviews + '"}';

        interview_data.push(JSON.parse(str));
       }
    }
  }

 
   //console.log("quota_data: ", quota_data);
}
