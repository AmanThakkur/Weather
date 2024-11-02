const apikey = "ec5e62bcb7693d5ad7b3777dd172b9e3";
const apiurl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".Weather-icon");
const locationBtn = document.querySelector(".location-Btn");

async function getData(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`
  );

  return await response.json();
}


async function gotLocation(position) {
  const data = await getData(
    position.coords.latitude,
    position.coords.longitude
  );
  updateUI(data);
}

function failedToGet() {
  console.log(`There was some issue`);
}

locationBtn.addEventListener("click", async () => {
  navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
});

async function checkWeather(city) {
  const response = await fetch(apiurl + city + `&appid=${apikey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".Weather").style.display = "none";
  } else {
    const data = await response.json();
    updateUI(data);
  }
}



function updateUI(data) {
  document.querySelector(".city").innerHTML = data.name;

  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";

  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";

  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
  
  const currentTime = Date.now() / 1000; 
  const isDayTime =
    currentTime >= data.sys.sunrise && currentTime < data.sys.sunset;

  let iconPath = "";
  console.log(data);

  if (data.weather[0].main.toLowerCase() === "clouds") {
    iconPath = isDayTime ? "image/clouds-day.png" : "image/clouds-night.png";
  } else if (data.weather[0].main.toLowerCase() === "clear") {
    iconPath = isDayTime ? "image/clear-day.png" : "image/clear-night.png";
  } else if (data.weather[0].main.toLowerCase() === "rain") {
    iconPath = isDayTime ? "image/rain-day.png" : "image/rain-night.png";
  } else if (data.weather[0].main.toLowerCase() === "drizzle") {
    iconPath = isDayTime ? "image/drizzle-day.png" : "image/rain-night.png";
  } else if (data.weather[0].main.toLowerCase() === "mist") {
    iconPath = isDayTime ? "image/mist-day.png" : "image/mist-night.png";
  } else if (data.weather[0].main.toLowerCase() === "haze") {
    iconPath = isDayTime ? "image/haze-day.png" : "image/haze-night.png";
  }

  weatherIcon.src = iconPath;
 

  document.querySelector(".Weather").style.display = "block";

  document.querySelector(".error").style.display = "none";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
