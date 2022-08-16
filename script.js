var latitude = 51.5002;
var longitude = -0.1262;
var x = "untouched";
var apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m&current_weather=true&timezone=auto&daily=weathercode,temperature_2m_max,
temperature_2m_min&daily=precipitation_sum`;
weather();
// function to update the url to the correct city selected in the html
function citySelector(){
    var city = document.querySelector("select").value;
    latitude = resolveCity(city)[0];
    console.log(resolveCity(city)[0]);
    longitude = resolveCity(city)[1];
    apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m&current_weather=true&timezone=auto&daily=weathercode&daily=temperature_2m_max&daily=temperature_2m_min&daily=precipitation_sum`
   
    weather();
    console.log("in the city selector function");
}

//the bottom function edits the weather of each day in the week
function weekWeatherModifier(date, dayIndex, minimun, maximum){
    let dayId;
    if(dayIndex==0)dayId='day1';
    else if(dayIndex==1)dayId='day2';
    else if(dayIndex==2)dayId='day3';
    else if(dayIndex==3)dayId='day4';
    else if(dayIndex==4)dayId='day5';
    else if(dayIndex==5)dayId='day6';
    else if(dayIndex==6)dayId='day7';
    document.getElementById(`${dayId}`).innerHTML = `
    <p>${date}</p>
    <p>max ${maximum}&#176c</p>
    <p>min ${minimun}&#176c</p>
    `
}
//the bottom function edits the current day's weather information
function todayWeatherModifier(temprature, weather , wind , humidity, precipitation){
    document.querySelector("#temprature").innerHTML = `${temprature}&#176c`;
    document.querySelector("#city").innerHTML = (document.querySelector("select").value);
    document.querySelector("#weather").innerHTML = weather;
    document.querySelector("#windspeed").innerHTML = wind;
    document.querySelector("#humidity").innerHTML = humidity;
    document.querySelector("#precipitation").innerHTML = precipitation;
    
}

let weatherType;
async function weather(){
    try{
    let responseObject = await fetch(apiEndpoint);  
    let data = await responseObject.json();
    weatherCodeConverter(data.current_weather.weathercode);
    document.querySelector("body").setAttribute("style", "background-image: url('background.webp')")
    weatherCodeConverter(data.current_weather.weathercode);
    
    console.log(data);
    console.log(data.current_weather.temperature);
    var temprature = data.current_weather.temperature;
    var weather = weatherCodeConverter(data.current_weather.weathercode);
    var wind = data.current_weather.windspeed;
    var time =  data.current_weather.time;
    // check the current time : console.log("time is "+ time);
    var indexOfTimeHourly = data.hourly.time.indexOf(time);

    // check the index of that time from the weeks hourly time array: console.log("the time is in index "+ indexOfTimeHourly);
    var humidity = data.hourly.relativehumidity_2m[indexOfTimeHourly];
    // use the index to get the current humidity from the weekly relative humidity array: console.log("the element with that index in humidity is "+ humidity);
    var precipitation  = data.daily.precipitation_sum[0];
    todayWeatherModifier(temprature, weather, wind, humidity, precipitation);
    for(i=0; i<6; i++){
        var dayIndex = i;
        var date =  data.daily.time[i];
        var maximum = data.daily.temperature_2m_max[i];
        var minimum = data.daily.temperature_2m_min[i];
        weekWeatherModifier(date , dayIndex, minimum, maximum);
    }
    }
    
    catch(err){
        console.log(err);
    }
}
// function to convert the weather code into a sensible description
function weatherCodeConverter(code){   
    if(code==0){
        weatherType = 'sunny.jpg' 
        return "Clear sky" ;
    }
    else if(code==1){
        weatherType = 'cloudy.jpg' 
        return "Mainly clear" ;
    }
    else if(code==2){
        weatherType = 'cloudy.jpg' 
        return "Partly cloudy" ;
    }
    else if(code==3){
        weatherType = 'cloudy.jpg' 
        return "Overcast" ;
    }
    else if(code==45){
        return "Fog" ;
    }
    else if(code==48){
        return "depositing rime fog" ;
    }
    else if(code==51){
        return "Drizzle: Light intensity" ;
    }
    else if(code==53){
        return "Drizzle: moderate intensity" ;
    }
    else if(code==55){
        return "Drizzle: dense intensity" ;
    }
    else if(code==56){
        return "Freezing Drizzle: Light intensity" ;
    }
    else if(code==57){
        return "Freezing Drizzle: dense intensity" ;
    }
    else if(code==61){
        return "Rain: Slight intensity" ;
    }
    else if(code==63){
        return "Rain: moderate intensity" ;
    }
    else if(code==65){
        return "Rain: heavy intensity" ;
    }
    else if(code==66||code==67){
        return "Freezing Rain: Light and heavy intensity" ;
    }
    else if(code==71||code==73||code==75){
        return "Snow fall: Slight, moderate, and heavy intensity" ;
    }
    else if(code==77){
        return "Snow grains" ;
    }
    else if(code==80){
        return "Rain showers: Slight" ;
    }
    else if(code==81){
        return "Rain showers: moderate" ;
    }
    else if(code==82){
        return "Rain showers: violent" ;
    }
    else if(code==85||code==86){
        return "Snow showers slight and heavy" ;
    }
    else if(code==95){
        return "Thunderstorm: Slight or moderate" ;
    }
    else if(code==96||code==99){
        return "Thunderstorm with slight and heavy hail" ;
    }
    else{
        return '';
    }
}
function resolveCity(city){
    // check which city is selected and return the corresponding location in lattitude and longtude
    switch(city){

        case "Berlin":
            return [52.5235, 13.4115];

        case "London":
            return [51.5002, -0.1262];
            
        case "AddisAbaba":
            return [9.0054, 38.7636];

        case "Paris":
            return [48.8567, 2.3510];

    }
}

//console.log(`the lattitude is ${resolveCity("Berlin")[0]} and the longtude is ${resolveCity("Berlin")[1]}`);
/*
<div class="card col-2 day" style="width: 18rem;">
        <img src="${weatherType}" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">TODAY</h5>
    <p class="card-text">weather ${weatherCodeConverter(data.current_weather.weathercode)}</p>
    <p class="card-text">Temprature ${data.current_weather.temperature} </p>
    <p class="card-text">Wind Direction ${data.current_weather.winddirection} </p>
    <p class="card-text">Wind Speed ${data.current_weather.windspeed} </p>  
    </div>
    </div>
     <div class="card col-2 day" style="width: 18rem;">
        <img src="${weatherType}" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">TODAY</h5>
    <p class="card-text">weather ${weatherCodeConverter(data.current_weather.weathercode)}</p>
    <p class="card-text">Temprature ${data.current_weather.temperature} </p>
    <p class="card-text">Wind Direction ${data.current_weather.winddirection} </p>
    <p class="card-text">Wind Speed ${data.current_weather.windspeed} </p>  
    </div>
    </div>
*/