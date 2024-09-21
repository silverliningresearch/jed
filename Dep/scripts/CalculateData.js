/************************************/
function CalculateAirportAirLineReport() {
  prepareInterviewData();
 
  total_completed = 0;
  total_quota_completed = 0;

  //check what not belong to quota data
  var found_temp = 0;
  var not_in_quota_list =[];
  for (i = 0; i < interview_data.length; i++) 
  {
    total_completed = total_completed +   parseInt(interview_data[i].Completed_of_interviews);    
    found_temp = 0;
    for (j = 0; j < quota_data.length; j++) 
    {
      if (quota_data[j].quota_id.toUpperCase() == interview_data[i].quota_id.toUpperCase()) 
      { 
        found_temp = 1;
      }
    }
    if (found_temp==0) not_in_quota_list.push(interview_data[i]);
  }
  console.log("not_in_quota_list: ", not_in_quota_list);


  for (i = 0; i < quota_data.length; i++) {//airport_airline_report.length;
    row = quota_data[i];
    row.Completed = 0;

    for (j = 0; j < interview_data.length; j++) {
      if (row.quota_id.toUpperCase() == interview_data[j].quota_id.toUpperCase()) 
      { 
        row.Completed = row.Completed  + parseInt(interview_data[j].Completed_of_interviews);
      }
    }

    row.Difference = row.Completed -  row.Quota;
    row.Difference_percent =(100*(row.Difference/row.Quota)).toFixed(0);
    row.Prioritisation_score = row.Difference_percent*row.Difference/100;

    row.Completed_percent =(100*(row.Completed/row.Quota)).toFixed(0);

    //total_completed = total_completed + row.Completed;
        
    if ( row.Difference > 0) { //over quota
      total_quota_completed = total_quota_completed +row.Quota*1;
    }
    else { //<= 0
      if (row.Completed) {
        total_quota_completed = total_quota_completed + row.Completed*1;
      }
    }

  }

  total_completed_percent = (100*(total_completed/total_quota)).toFixed(0);   

}
