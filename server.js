const getCurrLoc = document.getElementById("get-location");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");
const weatherBtn = document.getElementById("get-weather");
import { key } from "./config.js";
let location_timeout;
const topContainer = document.querySelector(".top-container");
const inputTextList = document.querySelectorAll(".inputsText");
const selectOption = document.getElementById("locationType");
const goBtn = document.getElementById("go-btn");
const introContainer = document.querySelector(".intro-container");
const introH1 = document.getElementById("intro-h1");
const cityHeader = document.getElementById("cityHeader");
const cityInput = document.getElementById("cityInput");
const cityBtn = document.getElementById("cityBtn");
const backBtn = document.getElementById("back-btn");

// initialize
topContainer.classList.add("hidden");
latEl.classList.add("hidden");
lonEl.classList.add("hidden");
weatherBtn.classList.add("hidden");
getCurrLoc.classList.add("hidden");
cityBtn.classList.add("hidden");
cityHeader.classList.add("hidden");
cityInput.classList.add("hidden");
backBtn.classList.add("hidden");

inputTextList.forEach(function (inputText) {
  inputText.classList.add("hidden");
});

function geolocFail() {
  alert("Enable GeoLocation Services");
  clearTimeout(location_timeout); // Clear the timeout if geolocation fails
}

function capitalizeWords(str) {
  // Split the string into words using a space as the separator
  const words = str.split(" ");

  // Create an array to store the capitalized words
  const capitalizedWords = [];

  // Iterate over each word
  for (const word of words) {
    // Capitalize the first character of the word and concatenate the rest
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);

    // Push the capitalized word to the array
    capitalizedWords.push(capitalizedWord);
  }

  // Join the capitalized words back into a single string with spaces
  const result = capitalizedWords.join(" ");

  return result;
}

getCurrLoc.addEventListener("click", () => {
  if (navigator.geolocation) {
    location_timeout = setTimeout(geolocFail, 10000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(location_timeout); // Clear the timeout when geolocation succeeds
        
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        latEl.value = lat.toFixed(2);
        lonEl.value = long.toFixed(2);
   
        getWeatherCoord();
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

function getCityWeather() {
  const cityName = cityInput.value;

  let lang = "en";
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}&units=${units}`;

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

function msToTime(unix_timestamp) {
  const date = new Date(unix_timestamp * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes();

  if (hours > 12) hours -= 12;

  // Will display time in 10:30 format
  const formattedTime = hours + ":" + minutes.substr(-2);
  return formattedTime;
}

function getWeatherCoord(ev) {
  let lat = latEl.value;
  let lon = lonEl.value;
  
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

function getWeatherIcon(id) {
  if (id >= 200 && id < 233) return "./open-weather-symbols/thunderstorm.png";
  else if (id >= 801) return "./open-weather-symbols/clouds.png";
  else if (id >= 300 && id < 532) return "./open-weather-symbols/rain.png";
  else if (id === 800) return "./open-weather-symbols/clear-sky.png";
  else if (id >= 600 && id < 623) return "./open-weather-symbols/snow.png";
  else if (id >= 701 && id < 782)
    return "./open-weather-symbols/mist-atmosphere.png";
  else {
    console.log("No matching icon found for weather ID: " + id);
    return "";
  }
}

function getWeatherBackground(id) {
  if (id >= 200 && id < 233) return "./weather-backgrounds/thunderstorm.jpeg";
  else if (id >= 801) return "./weather-backgrounds/clouds.jpg";
  else if (id >= 300 && id < 532) return "./weather-backgrounds/rain.jpg";
  else if (id === 800) return "./weather-backgrounds/sun.jpg";
  else if (id >= 600 && id < 623) return "./weather-backgrounds/snow.jpg";
  else if (id >= 701 && id < 782) return "./weather-backgrounds/mist.jpeg";
  else {
    console.log("No matching icon found for weather ID: " + id);
    return "";
  }
}

function displayWeather(resp) {
  console.log(resp);
  const temp = Math.round(resp.main.temp);
  const summary = capitalizeWords(resp.weather[0].description);
  const humidity = resp.main.humidity;
  const tempMin = Math.round(resp.main.temp_min);
  const tempMax = Math.round(resp.main.temp_max);
  const sunrise = msToTime(resp.sys.sunrise);
  const sunset = msToTime(resp.sys.sunset);
  const city = resp.name;
  const weatherID = resp.weather[0].id;
  const weatherIcon = getWeatherIcon(weatherID);
  const weatherBackground = getWeatherBackground(weatherID);
  const country = resp.sys.country;

  document.querySelector(".temp").textContent = temp + "°";
  document.querySelector(".weather-desc").textContent = summary;
  document.getElementById("weather-humidty").textContent =
    "Humidty: " + humidity + "%";
  document.getElementById("weather-high").textContent =
    "High: " + tempMax + "°";
  document.getElementById("weather-low").textContent = "Low: " + tempMin + "°";
  document.getElementById("weather-sunrise").textContent =
    "Sunrise: " + sunrise + "am ☀️";
  document.getElementById("weather-sunset").textContent =
    "Sunset: " + sunset + "pm 🌙";
  document.querySelector(".location").textContent = city + ", " + country;
  document.querySelector(".weather-icon").src = weatherIcon;
  document.querySelector(
    "body"
  ).style.backgroundImage = `url(${weatherBackground})`;
  topContainer.classList.remove("hidden");
}

weatherBtn.addEventListener("click", getWeatherCoord);

function hideIntro() {
  introContainer.style.display = "none";
}

goBtn.addEventListener("click", function goButtonClicked() {
  const val = selectOption.value;

  if (val === "select") {
    alert("Choose either City Name or Coordinates");
  } else if (val === "city") {
    cityBtn.classList.remove("hidden");
    cityHeader.classList.remove("hidden");
    cityInput.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    hideIntro();
  } else if (val === "coordinates") {
    hideIntro();
    latEl.classList.remove("hidden");
    lonEl.classList.remove("hidden");
    weatherBtn.classList.remove("hidden");
    getCurrLoc.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    inputTextList.forEach(function (inputText) {
      inputText.classList.remove("hidden");
    });
  }
});

cityBtn.addEventListener("click", getCityWeather);

backBtn.addEventListener("click", () => {
  topContainer.classList.add("hidden");
  latEl.classList.add("hidden");
  lonEl.classList.add("hidden");
  weatherBtn.classList.add("hidden");
  getCurrLoc.classList.add("hidden");
  cityBtn.classList.add("hidden");
  cityHeader.classList.add("hidden");
  cityInput.classList.add("hidden");
  backBtn.classList.add("hidden");
  introContainer.style.display = "flex";
  inputTextList.forEach(function (inputText) {
    inputText.classList.add("hidden");
  });
});


selectOption.addEventListener("click", () => {
  document.addEventListener("keydown", keyPressed);
  function keyPressed(e) {
    if (e.code == "Enter") {
      e.preventDefault();
      goBtn.click();
    }
  }
});
