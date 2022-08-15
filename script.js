var latitude = 51.5002;
var longitude = -0.1262;
var x = "untouched";
var apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m&current_weather=true&timezone=auto&daily=weathercode,temperature_2m_max,
temperature_2m_min`;
weather();
// function to update the url to the correct city selected in the html
function citySelector(){
    var city = document.querySelector("select").value;
    latitude = resolveCity(city)[0];
    console.log(resolveCity(city)[0]);
    longitude = resolveCity(city)[1];
    apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current_weather=true&timezone=auto&daily=weathercode&daily=temperature_2m_max&daily=temperature_2m_min`
    x = "touched";
    weather();
}
function test(){
    console.log(x);
    
}
//the bottom function edits the weather of each day in the week
function weekWeatherModifier(date, dayIndex, minimun, maximum){
    document.getElementById(`${dayIndex}`).innerHTML = `
    <p>${date}</p>
    <p>min ${minimun}</p>
    <p>min ${maximum}</p>`
}
//the bottom function edits the current day's weather information
function todayWeatherModifier(temprature, weather , wind , humidity){
    document.querySelector("#temprature").innerHTML = temprature;
    document.querySelector("#city").innerHTML = (document.querySelector("select").value);
    document.querySelector("#weather").innerHTML = weather;
    document.querySelector("#windspeed").innerHTML = wind;
    document.querySelector("#humidity").innerHTML = humidity;
    
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
    var humidity = data.current_weather.windspeed;
    todayWeatherModifier(temprature, weather, wind, humidity);
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
    else if(code==1||code==2||code==3){
        weatherType = 'cloudy.jpg' 
        return "Mainly clear, partly cloudy, and overcast" ;
    }
    else if(code==45||code==48){
        return "Fog and depositing rime fog" ;
    }
    else if(code==51||code==53||code==55){
        return "Drizzle: Light, moderate, and dense intensity" ;
    }
    else if(code==56||code==57){
        return "Freezing Drizzle: Light and dense intensity" ;
    }
    else if(code==61||code==63||code==65){
        return "Rain: Slight, moderate and heavy intensity" ;
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
    else if(code==80||code==81||code==82){
        return "Rain showers: Slight, moderate, and violent" ;
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