const getCurrLoc = document.getElementById("get-location");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");
const weatherBtn = document.getElementById('get-weather');

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
  }
  else {
    geolocFail();
  }
});




function getWeather(ev) {
    let lat  = latEl.value;
    let lon = lonEl.value;
    let lang = 'en';
    let units = 'metric';
    let key = 
    let url = 'https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}';

    fetch(url)
    .then(resp => {
        if(!resp.ok) throw Error(resp.statusText);
        return resp.json();
    })
    .then(data => {
        displayWeather(data);
    })
    .catch(console.err);

}


function displayWeather (resp) {
    console.log(resp + "here");
}


weatherBtn.addEventListener('click', getWeather());