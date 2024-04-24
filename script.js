// Define geocodeAddresses as a standalone function that accepts the map object
function geocodeAddresses(map, addresses) {
  var geocoder = new google.maps.Geocoder();
  var currentInfoWindow = null; // Reference to the currently open InfoWindow

  addresses.forEach(function (addressData) {
      // Assemble the full address from the parts
      var fullAddress = `${addressData.Address}, ${addressData.City}, ${addressData.Country}`;
      
      geocoder.geocode({ 'address': fullAddress }, function (results, status) {
          if (status === 'OK') {
              var marker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
              });

              // Create the content string for the InfoWindow using the data from the CSV
              var content = `<div><strong>Address:</strong> ${addressData.Address}<br>
                            <strong>City:</strong> ${addressData.City}<br>
                            <strong>Country:</strong> ${addressData.Country}<br>
                            <strong>Description:</strong> ${addressData.Info_Description}<br>
                            <strong>Name:</strong> ${addressData.Person_Name}</div>`;

              var infoWindow = new google.maps.InfoWindow({
                  content: content
              });

              // Add a click listener to the marker to open the InfoWindow
              marker.addListener('click', function () {
                  // Close the currently open InfoWindow if it exists
                  if (currentInfoWindow) {
                      currentInfoWindow.close();
                  }
                  // Open the new InfoWindow
                  infoWindow.open(map, marker);
                  // Update the reference to the currently open InfoWindow
                  currentInfoWindow = infoWindow;
              });
          } else {
              console.error('Geocode was not successful for the following reason: ' + status);
          }
      });
  });
}

// Parse CSV function that converts CSV text to an array of objects
function parseCSV(text) {
  const lines = text.split("\n");
  // Extract headers
  const headers = lines[0].split(",").map((header) => header.trim());
  // Map over each line after header to create objects
  const data = lines.slice(1).map((line) => {
    const values = line.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);
    if (!values) return {}; // Skip empty lines
    return headers.reduce((object, header, index) => {
      // Trim values and remove double quotes
      object[header] = values[index].trim().replace(/^"(.*)"$/, "$1");
      return object;
    }, {});
  });
  return data.filter((address) => address.Address); // Filter out empty address objects
}

// Init map function that is called once the Google Maps script is loaded
function initMap() {
  // Create a map object centered at a specific latitude and longitude
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 51.38307277544511, lng: -2.369336518262417 },
  });

  // Load CSV data and then geocode addresses
  loadAddressesFromCSV(map);
}

// Function to load addresses from a CSV file hosted on a server
function loadAddressesFromCSV(map) {
  var csvFileUrl = "https://dhscsvdata.s3.eu-west-2.amazonaws.com/addresses.csv";
  
  fetch(csvFileUrl)
    .then(response => response.text())
    .then(data => {
      var addresses = parseCSV(data);
      // Save the addresses globally
      globalAddresses = addresses;
      // Geocode addresses and add markers to the map
      geocodeAddresses(map, addresses);
    })
    .catch(error => {
      console.error("Failed to load CSV file:", error);
    });
}

// Assign the initMap function to the window object to make it globally accessible
window.initMap = initMap;
// Function to show the map and hide the list
function showMapView() {
  document.getElementById("map-container").style.display = "block";
  document.getElementById("list-container").style.display = "none";
  
  // Optional: Toggle active class for tabs
  document.getElementById("mapViewTab").classList.add("active");
  document.getElementById("listViewTab").classList.remove("active");
}

// Function to show the list and hide the map
function showListView() {
  document.getElementById("map-container").style.display = "none";
  document.getElementById("list-container").style.display = "block";

  // Generate the list view using the addresses
  generateListView();

  // Optional: Toggle active class for tabs
  document.getElementById("mapViewTab").classList.remove("active");
  document.getElementById("listViewTab").classList.add("active");
}

// Global variable to store the addresses data
var globalAddresses = [];

// Function to generate the list view
function generateListView() {
  var listContainer = document.getElementById("list-container");
  listContainer.innerHTML = ''; // Clear previous content
  globalAddresses.forEach(function(address) {
    // Create list item for each address
    var listItem = document.createElement("div");
    listItem.innerHTML = `<strong>${address.Address}</strong><br>${address.City}, ${address.Country}<br>${address.Info_Description}<br>${address.Person_Name}<br><hr>`;
    listContainer.appendChild(listItem);
  });
}