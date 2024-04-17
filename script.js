function initMap() {
  // Create a new Google Map instance
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14, // Initial zoom level
    center: { lat: 51.38307277544511, lng: -2.369336518262417 }, // Initial center coordinates
  });

  // Function to geocode and place pins for addresses
  function geocodeAddresses(addresses) {
    // Create a Geocoder instance
    var geocoder = new google.maps.Geocoder();
    // Loop through each address
    addresses.forEach(function (address) {
      // Geocode the address
      geocoder.geocode(
        { address: address.address },
        function (results, status) {
          // If geocoding is successful
          if (status === "OK") {
            // Create a marker for the address
            var marker = new google.maps.Marker({
              map: map, // Set marker on the map
              position: results[0].geometry.location, // Set marker position
            });

            // Create InfoWindow content from CSV data
            var content =
              "<div><strong>" +
              address.address +
              "</strong><br>" +
              address.row10 +
              "</div>";

            var infoWindow = new google.maps.InfoWindow({
              content: content, // Content for InfoWindow
            });

            // Add click event listener to marker
            marker.addListener("click", function () {
              infoWindow.open(map, marker);
            });
          } else {
            // If geocoding fails, log an error
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    });
  }

  function loadAddressesFromCSV() {
    // URL of CSV file hosted on S3
    var csvFileUrl =
      "https://dhscsvdata.s3.eu-west-2.amazonaws.com/addresses.csv";
    // Fetch the CSV file
    fetch(csvFileUrl)
      .then((response) => response.text())
      .then((data) => {
        // Split the CSV data into an array of lines
        var lines = data.split("\n");
        // Get headers (first line)
        var headers = lines[0].split(",");
        // Find index of 'Address' and 'Row10' columns
        var addressIndex = headers.indexOf("Address");
        var row10Index = headers.indexOf("Row10");
        // Initialize array to store addresses and corresponding data
        var addresses = [];
        // Loop through each line (starting from second line)
        for (var i = 1; i < lines.length; i++) {
          var line = lines[i].split(",");
          // Check if the line is not empty
          if (line.length > 1) {
            // Extract address and row10 data
            var address = line[addressIndex];
            var row10 = line[row10Index];
            // Push address and row10 data to array
            addresses.push({ address: address, row10: row10 });
          }
        }
        // Call the geocodeAddresses function with the addresses array
        geocodeAddresses(addresses);
      })
      .catch((error) => {
        // If an error occurs during fetching or processing
        console.error("Failed to load CSV file:", error);
      });
  }

  // Call the loadAddressesFromCSV function when the page loads
  loadAddressesFromCSV();
}
