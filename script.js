"strict";

const mapContainer = document.getElementById("map");
const profile = document.getElementById("profile");
const exitButton = document.querySelector(".exitButton");
const newJob = document.getElementById("newJob");
const newJobExitButton = document.getElementById("newJobExitButton");

var jobTitle = document.querySelector("#jobTitle");
var newJobType = document.querySelector("#newJobType");
var jobPrice = document.querySelector("#jobPrice");
var newJobDescription = document.querySelector("#newJobDescription");
var jobTime = document.querySelector("#jobTime");
var fileInput = document.querySelector("#file-input");

const clearNewJobValues = function () {
  jobTitle.value = "";
  newJobType.value = "";
  jobPrice.value = "";
  jobTime.value = "";
  newJobDescription.value = "";
  fileInput.files[0] = "";
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

const makeNewMarker = function (jobtype, location, id) {
  // Create a new L.icon object for each marker
  var customIcon = L.icon({
    iconUrl: `${jobtype}.png`,
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });

  // Create a new marker with the custom icon
  const marker = L.marker(location, {
    icon: customIcon,
  });

  marker.id = id;

  return customIcon, marker;
};

const newJobbie = function (latlng) {
  var popup = L.popup()
    .setContent(
      "Do you want to add a job here? <br> <button class='popupButtons' id='yesPopUpButton'>yes</button> <button class='popupButtons' id='noPopUpButton'>no</button>"
    )
    .setLatLng(latlng)
    .openOn(map);

  // document
  //   .querySelector(".leaflet-popup-close-button")
  //   .addEventListener("click", map.removeLayer(marker));

  document
    .querySelector("#noPopUpButton")
    .addEventListener("click", function () {
      map.removeLayer(popup);
    });

  document
    .querySelector("#yesPopUpButton")
    .addEventListener("click", function (e) {
      e.preventDefault();
      console.log(latlng);
      mapContainer.style.width = "65%";
      newJob.style.display = "inline-block";
      newJobExitButton.addEventListener("click", function () {
        console.log(latlng);
        newJob.style.display = "none";
        map.removeLayer(marker);
        map.removeLayer(popup);
        mapContainer.style.width = "100%";
      });
      document
        .querySelector(".submitButton")
        .addEventListener("click", function () {
          let NewJobListing = new JobListing({
            id: i++,
            title: jobTitle.value,
            time: jobTime.value,
            type: newJobType.value,
            price: jobPrice.value,
            description: newJobDescription.value,
            photos: fileInput.files[0],
            location: latlng,
          });

          NewJobListing.id = i++;
          NewJobListing.title = jobTitle.value;
          NewJobListing.type = newJobType.value;
          NewJobListing.time = jobTime.value;
          NewJobListing.price = jobPrice.value;
          NewJobListing.description = newJobDescription.value;
          NewJobListing.photos = fileInput.files[0];
          NewJobListing.location = latlng;

          map.removeLayer(popup);

          jobs.push(NewJobListing);
          console.log(jobs);

          let uniqueJobArray = jobs.filter(
            (item, index, array) =>
              array.findIndex((t) => t.location === item.location) === index
          );
          console.log(uniqueJobArray);

          // Loop through the jobs array and add each object as a marker on the map
          uniqueJobArray.forEach((job) => {
            // Create a function that returns a new icon object with the desired properties for each marker
            createJobMarker(job).addTo(map);
            addPopupContent(job);

            // Create a marker for the job object and add it to the map

            // Create a popup with the job details and bind it to the marker
          });

          profile.style.display = "none";
          newJob.style.display = "none";
          console.log("HEY");
          mapContainer.style.width = "100%";

          // clearJobListing(NewJobListing);

          clearNewJobValues();
          console.log();
        });

      console.log(JobListing);
    });

  popup.on("popupclose", function () {
    if (!popup.confirmed) {
      map.removeLayer(marker);
    }
  });

  popup.on("popupok", function () {
    popup.confirmed = true;
  });
};

map.on("click", function (e) {
  newJobbie(e.latlng);
  console.log(e.latlng);
  e.latlng = null;
  console.log(e.latlng);
});

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
  const marker = L.marker(job.location, {
    icon: getJobIcon(job),
  });
  return marker;
};

const addPopupContent = function (job) {
  const popupContent = `
              <h2>${job.title}</h2>
              <p><strong>Type:</strong> ${job.type}</p>
              <p><strong>Price:</strong> ${job.id.price}</p>
              <p><strong>Description:</strong> ${job.description}</p>`;
  marker.bindPopup(popupContent);
  console.log(job.location);
};
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
