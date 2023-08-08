
let weather = {
  apiKey: "ba2d63d6d0254999f95e9b70e6b4397f",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q="
      + city
      + "&units=metric&appid="
      + this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));

  },
  displayWeather: function (data) {
    const { name } = data;
    const { lon, lat } = data.coord;
    const { icon, description } = data.weather[0];
    const { temp, humidity, pressure } = data.main;
    const { country } = data.sys;
    const { speed, deg, gust } = data.wind;
    const { sunrise, sunset } = data.sys;
    console.log(name, icon, description, temp, humidity, speed, pressure, deg, gust, lon, lat, country, sunrise, sunset)
    document.querySelector(".lat").innerText = "latitude: " + lat + "°";
    document.querySelector(".city").innerText = "" + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
    document.querySelector(".description").innerText = description;
    document.querySelector(".pressure").innerText = "pressure: " + pressure + " hPa";
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".lon").innerText = "longitude: " + lon + "°";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".country").innerText = country + ".";
    document.querySelector(".windd").innerText = "direction: " + deg + "°";
    document.querySelector(".windg").innerText = "wind gust: " + gust + " m/s";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {

    var api_key = '1f6c797122644563916c1b52e5525a88';


    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(latitude + ',' + longitude)
      + '&pretty=1'
      + '&no_annotations=1';


    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status === 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city);

      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send();  // make the request


  },
  geolocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error)
    }
    else {
      weather.fetchWeather("NEW DELHI");
    }
  }
}


const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '6f930820a32a6302f3ee3d41252bfc3c';
// const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM'

  timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

  dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {

    let { latitude, longitude } = success.coords;


    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

      console.log(data)
      fetchWeather(data);
    })



  })


}

function fetchWeather(data) {


  let otherDayForcast = ''
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
            <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                <div class="temp">Day: ${day.temp.day}&#176;C</div>
                <div class="temp">Night: ${day.temp.night}&#176;C</div>
            </div>
            
            `
    } else {
      otherDayForcast += `
            <div class="weather-forecast-item">
           
                <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Day: ${day.temp.day}&#176;C</div>
                <div class="temp">Night: ${day.temp.night}&#176;C</div>
            </div>
             </div>
            `
    }
  })


  weatherForecastEl.innerHTML = otherDayForcast;
}

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

geocode.geolocation();