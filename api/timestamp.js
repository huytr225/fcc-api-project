var months  = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];

function parsetime (time) {
  //December 15, 2015
  return months[time.getMonth()] + " "
      +  time.getDate()  + ", "
      +  time.getFullYear();
}

function unixtime(time) {
  return time.getTime()/1000;
}


exports.timestamp = function(date){
    var date1 = new Date(date);
    var date2 = new Date(date*1000);
    var myDate= date1;
    var response = {
        unix: null,
        natural: null
    }
    
    if(date2 != "Invalid Date") myDate = date2;
    if(myDate  != "Invalid Date"){
        response.unix = unixtime(myDate);
        response.natural = parsetime(myDate);
    }
    return response;
};