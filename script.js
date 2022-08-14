let apiEndpoint = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&current_weather=true';
async function weather(){
    try{
    let responseObject = await fetch(apiEndpoint);
    let data = await responseObject.json();
    document.querySelector(".main").innerHTML += `
    <div class="card" style="width: 18rem;">
        <img src="sunny.jpg" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title">today</h5>
    <p class="card-text">Temprature:${data.current_weather.temperature} </p>
    </div>
    </div>
    `
    console.log(data);
    console.log(data.current_weather.temperature);
    }
    catch(err){
        console.log(err);
    }
}
weather();

