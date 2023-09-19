const getCurrLoc = document.getElementById("get-location");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");
const weatherBtn = document.getElementById("get-weather");
import { key } from "./config.js";

let location_timeout;

function geolocFail() {
  alert("Enable GeoLocation Services");
  clearTimeout(location_timeout); // Clear the timeout if geolocation fails
}

getCurrLoc.addEventListener("click", () => {
  if (navigator.geolocation) {
    location_timeout = setTimeout(geolocFail, 10000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(location_timeout); // Clear the timeout when geolocation succeeds
        console.log("button clicked");
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        latEl.value = lat.toFixed(2);
        lonEl.value = long.toFixed(2);
        console.log(lat + ": latitude, " + long + ": longitude");
      },
      function (error) {
        clearTimeout(location_timeout); // Clear the timeout if there's an error
        geolocFail();
      }
    );
  } else {
    geolocFail();
  }
});


function msToTime(unix_timestamp) {
  const date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  if(hours > 12) hours -= 12;
  
  // Will display time in 10:30:23 format
  const formattedTime = hours + ':' + minutes.substr(-2);
  
  console.log(formattedTime);

  return formattedTime;
}

function getWeather(ev) {
  let lat = latEl.value;
  let lon = lonEl.value;
  console.log(lat + "  " + lon);
  let lang = "en";
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;

  fetch(url)
    .then((resp) => {
      if (!resp.ok) throw Error(resp.statusText);
      return resp.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch(console.error);
}

function displayWeather(resp) {
  const temp = Math.round(resp.main.temp);
  const summary =
    resp.weather[0].description.charAt(0).toUpperCase() +
    resp.weather[0].description.slice(1);
  const humidity = resp.main.humidity;
  const tempMin = Math.round(resp.main.temp_min);
  const tempMax = Math.round(resp.main.temp_max);
  const sunrise = msToTime(resp.sys.sunrise);
  const sunset = msToTime(resp.sys.sunset);

  document.querySelector(".temp").textContent = (temp + "°");
  document.querySelector(".weather-desc").textContent = summary;
  document.getElementById("weather-humidty").textContent =
    "Humidty: " + humidity + "%";
  document.getElementById("weather-high").textContent =
    "High: " + tempMax + "°";
  document.getElementById("weather-low").textContent = "Low: " + tempMin + "°";
  document.getElementById("weather-sunrise").textContent = ("Sunrise: " + sunrise + "am ☀️");
  document.getElementById("weather-sunset").textContent = ("Sunset: " + sunset + "pm 🌙");
}

weatherBtn.addEventListener("click", getWeather);
