const apiKey = "dd2fa0931c9451c317652098ae4cbe0d";

const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const airpollutionUrl =
  "https://api.openweathermap.org/data/2.5/air_pollution";

// =========================
// ELEMENTS
// =========================

const weathericon = document.getElementById("weatherimg");
const searchbox = document.getElementById("searchbox");

const AirQualitybox = document.getElementById("quality");
const pm = document.getElementById("pm");

const searchBtn = document.querySelector(".search-box button");

// =========================
// SET VALUE
// =========================

const getValue = (selector, value) => {
  document.querySelector(selector).innerHTML = value;
};

// =========================
// AIR QUALITY
// =========================

const AirQuality = async (lat, lon) => {
  try {
    const response = await fetch(
      `${airpollutionUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const data = await response.json();

    updateAirQuality(data);

  } catch (error) {
    console.log(error);
  }
};

const updateAirQuality = (data) => {

  const pm2_5 = data.list[0].components.pm2_5;

  const aqi = data.list[0].main.aqi;

  pm.innerHTML = pm2_5.toFixed(1);

  if (aqi === 1) {
    AirQualitybox.innerHTML = "Good";
    AirQualitybox.style.color = "#27ae60";
  }

  else if (aqi === 2) {
    AirQualitybox.innerHTML = "Fair";
    AirQualitybox.style.color = "#2ecc71";
  }

  else if (aqi === 3) {
    AirQualitybox.innerHTML = "Moderate";
    AirQualitybox.style.color = "#f39c12";
  }

  else if (aqi === 4) {
    AirQualitybox.innerHTML = "Poor";
    AirQualitybox.style.color = "#e75c0b";
  }

  else {
    AirQualitybox.innerHTML = "Very Poor";
    AirQualitybox.style.color = "#FF0000";
  }
};

// =========================
// WEATHER
// =========================

const checkWeather = async (city) => {

  try {

    searchBtn.innerHTML = "⟳";
    searchBtn.classList.add("spinner");

    const response = await fetch(
      `${apiUrl}${city}&appid=${apiKey}`
    );

    if (!response.ok) {

      searchBtn.innerHTML = "Search";
      searchBtn.classList.remove("spinner");

      return showNotification("Enter Correct City Name", "error");
    }

    const data = await response.json();

    // =========================
    // UPDATE UI
    // =========================

    getValue("#cityName", data.name);

    getValue("#temp", Math.round(data.main.temp) + "°C");

    getValue("#weather", data.weather[0].main);

    getValue("#humidity", data.main.humidity);

    getValue("#wind", data.wind.speed);

    getValue("#pressure", data.main.pressure);

    // =========================
    // WEATHER ICON
    // =========================

    const weatherMain = data.weather[0].main;
const iconCode = data.weather[0].icon;

// fallback default image
const defaultIcon = "https://openweathermap.org/img/wn/01d@4x.png";

// safe function
const setIcon = (url) => {
  weathericon.src = url;
  weathericon.onerror = () => {
    weathericon.src = defaultIcon;
  };
};

// map weather conditions to stable online icons
if (weatherMain === "Clouds") {
  setIcon("https://openweathermap.org/img/wn/03d@4x.png");
}

else if (weatherMain === "Clear") {
  setIcon("https://openweathermap.org/img/wn/01d@4x.png");
}

else if (weatherMain === "Rain") {
  setIcon("https://openweathermap.org/img/wn/09d@4x.png");
}

else if (weatherMain === "Drizzle") {
  setIcon("https://openweathermap.org/img/wn/10d@4x.png");
}

else if (
  weatherMain === "Mist" ||
  weatherMain === "Haze" ||
  weatherMain === "Fog"
) {
  setIcon("https://openweathermap.org/img/wn/50d@4x.png");
}

else if (weatherMain === "Snow") {
  setIcon("https://openweathermap.org/img/wn/13d@4x.png");
}

else {
  setIcon(defaultIcon);
}

    // =========================
    // AIR QUALITY
    // =========================

    const { lat, lon } = data.coord;

    AirQuality(lat, lon);

    // =========================
    // SUCCESS
    // =========================

    showNotification("Weather Updated", "success");

  } catch (error) {

    console.log(error);

    showNotification("Something went wrong", "error");
  }

  finally {

    searchBtn.innerHTML = "Search";

    searchBtn.classList.remove("spinner");
  }
};

// =========================
// SEARCH
// =========================

const handleSearch = () => {

  const city = searchbox.value.trim();

  if (!city) {
    return showNotification("Enter Your City Name", "error");
  }

  if (city.length < 3) {
    return showNotification("City name is too short", "error");
  }

  checkWeather(city);

  searchbox.value = "";
};

// =========================
// ENTER KEY SUPPORT
// =========================

searchbox.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    handleSearch();
  }
});

// =========================
// TOAST NOTIFICATION
// =========================

function showNotification(msg, type) {

  let bgColor;

  switch (type) {

    case "success":
      bgColor = "linear-gradient(to right, #11998e, #38ef7d)";
      break;

    case "error":
      bgColor = "linear-gradient(to right, #93291e, #ed213a)";
      break;

    default:
      bgColor = "#333";
  }

  Toastify({
    text: msg,
    duration: 2500,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,

    style: {
      background: bgColor,
      color: "#fff",
      borderRadius: "10px",
    },

  }).showToast();
}

// =========================
// DEFAULT WEATHER
// =========================

window.onload = () => {

  checkWeather("Jamshedpur");

  console.log("Weather App Loaded");
};