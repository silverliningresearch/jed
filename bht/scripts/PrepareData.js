var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentDate; //dd-mm-yyyy
var currentYear;
var currentQuarter; //yyyy-Qx
var currentMonth; //yyyy-mm
var current_period; 
var nextDate; //dd-mm-yyyy

var download_time;

var total_completed;
var total_completed_percent;
var total_quota_completed;
var total_hard_quota;
var total_quota;
var this_month_completed;
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

  currentMonth = [year, month].join('-');;
  current_period =  currentMonth ;
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
  if (document.getElementById('selected_period') && document.getElementById('selected_period').value.length > 0)
  {
    if (document.getElementById('selected_period').value != "current-period")
    {
      current_period = document.getElementById('selected_period').value;
    }
  }
  
  console.log("current_period: ", current_period);
  switch(current_period) {
    case "2025-05":      
      total_quota = 334;
      break;   
    case "2025-07":      
      total_quota = 117;
      currentQuarter = "2025-Q3";
      break;   
    case "2025-08":      
    case "2025-09":      
      total_quota = 443;
      currentQuarter = "2025-Q3";
      break;   

    case "2025-10":      
    case "2025-11":      
    case "2025-12":          
      total_quota = 334;
      currentQuarter = "2025-Q4";
      break;   

    case "2026-01":      
    case "2026-02":      
    case "2026-03":          
      total_quota = 334;
      currentQuarter = "2026-Q1";
      break;   

      default:
      total_quota = 334;
      break;
  }
}

function getInterviewMonth(interviewEndDate)
{
// Input: "2023-12-12",
  var interviewDateParsed = interviewEndDate.split("-")

  var interviewYear = (interviewDateParsed[0]);
  var interviewMonth =(interviewDateParsed[1]);
  
  var result = [interviewYear,interviewMonth].join('-');
  
   return result;
}

function getQuarterFromMonth(month, year)
{
  //Input: mm, yyyy
  var quarter = 0;
  
  if ((month == '01') || (month == '02') || (month == '03')) {
    quarter = "Q1";  
  }
  else if ((month == '04') || (month == '05') || (month == '06')) {
    quarter = "Q2";  
  }
  else if ((month == '07') || (month == '08') || (month == '09')) {
    quarter = "Q3";  
  }
  else if ((month == '10') || (month == '11') || (month == '12')) {
    quarter = "Q4";  
  }
  return (year + "-" + quarter);
}

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone:  'Asia/Riyadh', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  var result = (flight_time_value > current_time_value);

  //result = true;
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
  var quota_data_temp = JSON.parse(airline_dest_quota);
  var interview_data_full  = JSON.parse(interview_statistics);
  var flight_list_full  = JSON.parse(JED_Departures_Flight_List_Raw);

  initCurrentTimeVars();		
  
  console.log("current_period: ",current_period);
  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    if ((quota_data_temp[i].Quota>0)
         && (quota_data_temp[i].period_id == currentQuarter))
    {
      
      // if (current_period == "2025-04") // Add up 100 due to missing Int / Dom info
      // {
      //   const twoColumnArray = [
      //     ["6E-BOM", 1],
      //     ["AI-DEL", 5],
      //     ["E5-HBE", 3],
      //     ["EK-DXB", 2],
      //     ["ET-ADD", 4],
      //     ["G9-RKT", 2],
      //     ["HY-TAS", 1],
      //     ["IX-CCJ", 1],
      //     ["IY-ADE", 3],
      //     ["J2-GYD", 1],
      //     ["J4-PZU", 4],
      //     ["J9-KWI", 5],
      //     ["KU-KWI", 1],
      //     ["ME-BEY", 3],
      //     ["MS-CAI", 7],
      //     ["NE-CAI", 11],
      //     ["NP-CAI", 5],
      //     ["OV-MCT", 6],
      //     ["PC-SAW", 2],
      //     ["QR-DOH", 3],
      //     ["RJ-AMM", 2],
      //     ["SD-PZU", 2],
      //     ["SM-ATZ", 1],
      //     ["SM-CAI", 7],
      //     ["SM-HMB", 1],
      //     ["SV-AMM", 2],
      //     ["SV-BCN", 1],
      //     ["SV-CAI", 3],
      //     ["SV-DAC", 1],
      //     ["SV-HYD", 2],
      //     ["SV-KUL", 2],
      //     ["SV-KWI", 1],
      //     ["SV-LAX", 2],
      //     ["TU-TUN", 1],
      //     ["UJ-CAI", 3],
      //     ["W4-MXP", 2],
      //     ["XY-CAI", 2],
      //     ["XY-SAW", 1],
      //   ];
      //   twoColumnArray.forEach(row => {
      //     if (quota_data_temp[i].quota_id == row[0]) {
      //       console.log(`Column 1: ${row[0]}, Column 2: ${row[1]}`);
      //       console.log("old quota", quota_data_temp[i].Quota);

      //       quota_data_temp[i].Quota = quota_data_temp[i].Quota + row[1];

      //       console.log("new quota", quota_data_temp[i].Quota);

      //     }
      //   });

      // }

      quota_data_temp[i].Quota = Math.round(quota_data_temp[i].Quota, 0);// divide to 3
      
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

    //current_period: 2023-12
    //InterviewDate: 2023-04-01
    var interview_year = interview["InterviewDate"].substring(0,4);
    var interview_month = interview["InterviewDate"].substring(5,7);//"2023-04-03 06:18:18"    
    var interview_quarter = getQuarterFromMonth(interview_month, interview_year);

    if (currentQuarter == interview_quarter)//"2023-04-01",
    {
      if (interview["quota_id"]) {
        var quota_id = '"quota_id"' + ":" + '"' +  interview["quota_id"] + '", ';
        var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewDate"] + '", ';
        var InterviewMonth = '"InterviewMonth"' + ":" + '"' + interview_year + "-" +  interview_month + '", ';
        var Completed_of_interviews = '"Completed_of_interviews"' + ":" + '"' +  interview["Number of interviews"] ;
        
        var str = '{' + quota_id + InterviewEndDate + InterviewMonth + Completed_of_interviews + '"}';

        interview_data.push(JSON.parse(str));
       }
    }
  }

  //prepare flight list
  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;
  
  this_month_flight_list  = []; //for DOOP
  this_month_flight_list.length = 0;
  
  for (i = 0; i < flight_list_full.length; i++) {
    let flight = flight_list_full[i];

    //airport_airline
    flight.quota_id = flight.AirlineCode + "-" + flight.Dest;//code for compare

    //current_period:2023-02
    //flight.Date: 08-02-2023
    if (current_period == flight.Date.substring(6,10) + "-" +  flight.Date.substring(3,5)) { 
      this_month_flight_list.push(flight);
    }		 

    //only get today & not departed flight
    if (((currentDate ==flight.Date) && notDeparted(flight.Time))
        || (nextDate ==flight.Date)
        ) 
    { 
      flight.Date_Time = flight.Date.substring(6,10) + "-" +  flight.Date.substring(3,5) + "-" + flight.Date.substring(0,2) + " " + flight.Time;

      today_flight_list.push(flight);
    }
  }
 
  //add quota data
  daily_plan_data = [];
  daily_plan_data.length = 0;
  
  for (i = 0; i < today_flight_list.length; i++) {
    let flight = today_flight_list[i];
    for (j = 0; j < quota_data.length; j++) {
      let quota = quota_data[j];
      if ((quota.quota_id == flight.quota_id) && (quota.Quota>0))
      {
        flight.Quota = quota.Quota;
        daily_plan_data.push(flight);
       }
    }
  }
   //console.log("this_month_flight_list: ", this_month_flight_list);
   //console.log("quota_data: ", quota_data);
   //console.log("daily_plan_data: ", daily_plan_data);
}
