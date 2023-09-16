const getCurrLoc = document.getElementById("get-location");
const latEl = document.getElementById("lat");
const lonEl = document.getElementById("lon");

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
