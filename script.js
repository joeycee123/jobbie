"strict";

// const { marker } = require("leaflet");

// const { marker, popup } = require("leaflet");

const mapContainer = document.getElementById("map");
const newJob = document.getElementById("newJob");
const profile = document.getElementById("profile");
const exitButton = document.querySelector(".exitButton");
const newJobExitButton = document.getElementById("newJobExitButton");
const SubmitButton = document.querySelector(".submitButton");

// for the profile
const PersonPhoto = document.querySelector(".image-container");
const personName = document.querySelector(".personName");

// the jobhtml inputs
const jobTypehtml = document.querySelector(".jobType");
const jobPayhtml = document.querySelector(".jobPay");
const jobTimehtml = document.querySelector(".jobTime");
const JobDescriptionhtml = document.querySelector(".jobDescription");

const clearNewJobValues = function () {
  jobTitle.value = "";
  newJobType.value = "";
  jobPrice.value = "";
  jobTime.value = "";
  newJobDescription.value = "";
  // fileInput.files[0] = "";
  // location = {};
};

class JobListing {
  constructor(id, title, type, description, payment, time, photos, location) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.description = description;
    this.payment = payment;
    this.time = time;
    this.photos = photos;
    this.location = location;
  }
}

let markers = [];

let jobs = [];

// this is the refined array - USE THIS ONE!,
let uniqueJobs = [];

let jobbieicon = [];

let i = 1;

// Initialize the map
var map = L.map("map").setView([51.505, -0.09], 13);

// Add a tile layer to the map
// Create the street map and satellite map tile layers
var streetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

var satelliteMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

// Add the street map tile layer to the map
streetMap.addTo(map);

// Create a control to switch between the street map and satellite map
var baseMaps = {
  "Street Map": streetMap,
  "Satellite Map": satelliteMap,
};

L.control.layers(baseMaps).addTo(map);

var latitude;
var longitude;

map.on("click", function (e) {
  this.location = e.latlng;

  latitude = this.location.lat;
  longitude = this.location.lng;

  console.log(this.location);

  addPopup(this.location);

  console.log(this.location);
  SubmitButton.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(latitude, longitude);
    addJobtoList(latitude, longitude);
    closejobinput();
    clearNewJobValues();
  });

  e.latlng = null;
  console.log(e.latlng);
});

const addJobtoList = function (latitude, longitude) {
  var jobTitle = document.querySelector("#jobTitle");
  var newJobType = document.querySelector("#newJobType");
  var jobPrice = document.querySelector("#jobPrice");
  var newJobDescription = document.querySelector("#newJobDescription");
  var jobTime = document.querySelector("#jobTime");
  var fileInput = document.querySelector("#file-input");

  let i = 1;
  let NewJobListing = new JobListing({
    id: i++,
    title: jobTitle.value,
    time: jobTime.value,
    type: newJobType.value,
    price: jobPrice.value,
    description: newJobDescription.value,
    photos: fileInput.value,
    location: { latitude, longitude },
  });

  NewJobListing.id = i++;
  NewJobListing.title = jobTitle.value;
  NewJobListing.type = newJobType.value;
  NewJobListing.time = jobTime.value;
  NewJobListing.price = jobPrice.value;
  NewJobListing.description = newJobDescription.value;
  NewJobListing.photos = fileInput.value;
  NewJobListing.location = { latitude, longitude };

  // this adds the newJoblisting to the array

  jobs.push(NewJobListing);

  jobs.forEach((job) => {
    if (
      !uniqueJobs.some(
        (uniqueJob) => job.location.latitude === uniqueJob.location.latitude
      )
    ) {
      uniqueJobs.push(job);
    }
  });

  uniqueJobs.forEach((job) => {
    // Create a function that returns a new icon object with the desired properties for each marker

    createJobMarker(job).addTo(map);
  });

  return uniqueJobs;
};

const clearJobListing = function (joblisting) {
  joblisting.id.location = null;
};

const getJobIcon = function (job) {
  var ID = Date.now();

  jobbieicon[ID] = L.icon({
    iconUrl: `${job.type}.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return jobbieicon[ID];
};

const createJobMarker = function (job) {
  const popupContent = `
              <h2>${job.title}</h2>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Price (per hour):</strong> ${job.price}</p>
              <p><strong>Time (in hours):</strong> ${job.time}</p>
              <button class="infoButton">info</button>`;

  const marker = L.marker([job.location.latitude, job.location.longitude], {
    icon: getJobIcon(job),
  }).bindPopup(popupContent);

  marker.on("popupopen", function () {
    const infoButton = document.querySelector(
      ".leaflet-popup-content .infoButton"
    );
    if (infoButton) {
      infoButton.addEventListener("click", function () {
        // Find the job that corresponds to the clicked marker
        const clickedMarkerLat = marker.getLatLng().lat;
        const clickedMarkerLng = marker.getLatLng().lng;
        const clickedJob = uniqueJobs.find((job) => {
          return (
            job.location.latitude === clickedMarkerLat &&
            job.location.longitude === clickedMarkerLng
          );
        });

        jobTypehtml.innerHTML = `<h1>${clickedJob.type}</h1>`;
        jobPayhtml.innerHTML = `<h1>$ ${clickedJob.price} per hour</h1>`;
        jobTimehtml.innerHTML = `<h1>Time: ${clickedJob.time} hours</h1>`;
        JobDescriptionhtml.innerHTML = `<h3>${clickedJob.description}</h3>`;

        console.log(clickedJob);

        mapContainer.style.width = "65%";
        profile.style.display = "inline-block";
      });
    }
  });

  return marker;
};

// marker.on("click", this.marker);

// const addPopupContent = function (job) {
//   const popupContent = `
//               <h2>${job.title}</h2>
//               <p><strong>Type:</strong> ${job.type}</p>
//               <p><strong>Price:</strong> ${job.price}</p>
//               <p><strong>Description:</strong> ${job.description}</p>`;
//   marker.bindPopup(popupContent);
// };

const addPopup = function (latlng) {
  const newJobPopUp = L.popup({
    className: "NewJobPopUp",
  })
    .setContent(
      "Do you want to add a job here? <br> <button class='popupButtons' id='yesPopUpButton'>yes</button> <button class='popupButtons' id='noPopUpButton'>no</button>"
    )
    .setLatLng(latlng)
    .openOn(map);

  document
    .querySelector("#noPopUpButton")
    .addEventListener("click", function () {
      map.removeLayer(newJobPopUp);
      return;
    });

  document
    .querySelector("#yesPopUpButton")
    .addEventListener("click", function () {
      console.log("we are getting here");
      showJobInputForm();
      return newJobPopUp;
    });

  newJobExitButton.addEventListener("click", function () {
    map.removeLayer(newJobPopUp);
  });

  SubmitButton.addEventListener("click", function () {
    map.removeLayer(newJobPopUp);
  });
};

const closejobinput = function (mapContainer, newJob) {
  mapContainer = document.getElementById("map");
  newJob = document.getElementById("newJob");

  newJob.style.display = "none";
  mapContainer.style.width = "100%";
};

newJobExitButton.addEventListener("click", closejobinput);

const closePopup = function (marker) {
  if (!popup.confirmed) {
    map.removeLayer(marker);
  }
};

const exitNewJob = function () {
  newJob.style.display = "none";
  mapContainer.style.width = "100%";
};

const showJobInputForm = function (mapContainer, newJob) {
  mapContainer = document.getElementById("map");
  newJob = document.getElementById("newJob");

  mapContainer.style.width = "65%";
  newJob.style.display = "inline-block";
};

// popup.on("popupclose", function () {
//   if (!popup.confirmed) {
//     map.removeLayer(marker);
//   }
// });

// const resetLocation = function (job, latlng) {
//   job.id.location = null;

// };

// Get the user's current location and update the map
navigator.geolocation.getCurrentPosition(function (position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;

  map.setView([lat, lng], 13);
  // L.marker([lat, lng]).addTo(map);

  // Create a custom marker icon
  customIcon = L.icon({
    iconUrl: "dog.png",
    iconSize: [80, 80],
    iconAnchor: [45, 94],
    popupAnchor: [-3, -76],
  });

  // Create a marker with the custom icon
  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

  marker.on("click", function (e) {
    mapContainer.style.width = "65%";
    profile.style.display = "inline-block";
  });
});

exitButton.addEventListener("click", function () {
  profile.style.display = "none";
  newJob.style.display = "none";
  mapContainer.style.width = "100%";
});

// Displays images in the #image-container
// if there is multiple files
$("#file-input").change(function () {
  var files = this.files;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#image-container").append(
        "<div class='image-div'><img src='" +
          e.target.result +
          "' class='newJobImage'></div>"
      );
    };

    reader.readAsDataURL(file);
  }
});

// // define a function to navigate to the new page
// function navigateToNewPage() {
//   // set the location to the new HTML file
//   window.location.href = "login.html";
// }

// // call the function when a button is clicked
// document
//   .querySelector("#myButton")
//   .addEventListener("click", navigateToNewPage);
