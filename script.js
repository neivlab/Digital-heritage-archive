// Function to initialize the map
function initMap() {
  // Create a new Google Map instance
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8, // Initial zoom level
    center: { lat: 51.38307277544511, lng: -2.369336518262417 }, // Initial center coordinates
  });

  // Function to geocode and place pins for addresses
  function geocodeAddresses(addresses) {
    // Create a Geocoder instance
    var geocoder = new google.maps.Geocoder();
    // Loop through each address
    addresses.forEach(function (address) {
      // Geocode the address
      geocoder.geocode({ address: address }, function (results, status) {
        // If geocoding is successful
        if (status === "OK") {
          // Center the map on the first result
          map.setCenter(results[0].geometry.location);
          // Create a marker for the address
          var marker = new google.maps.Marker({
            map: map, // Set marker on the map
            position: results[0].geometry.location, // Set marker position
          });
        } else {
          // If geocoding fails, log an error
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    });
  }

  // Function to load addresses from CSV
  function loadAddressesFromCSV() {
    // Path to the CSV file
    var csvFilePath = "your_csv_file.csv"; // Replace with the path to the CSV file
    // Create a new XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    // Open the file
    xhr.open("GET", csvFilePath);
    // Set response type
    xhr.responseType = "text";
    // When the file is loaded
    xhr.onload = function () {
      // If the request was successful
      if (xhr.status === 200) {
        // Split the CSV data into an array of addresses
        var addresses = xhr.responseText.split("\n");
        // Call the geocodeAddresses function with the addresses array
        geocodeAddresses(addresses);
      } else {
        // If the request failed, log an error
        console.error("Failed to load CSV file. Status: " + xhr.status);
      }
    };
    // Send the request
    xhr.send();
  }

  // Automatically load addresses from CSV when the page loads
  loadAddressesFromCSV();
}
