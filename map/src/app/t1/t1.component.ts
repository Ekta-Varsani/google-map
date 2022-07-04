import { Component, OnInit } from '@angular/core';
// let map :google.maps.Map
@Component({
  selector: 'app-t1',
  templateUrl: './t1.component.html',
  styleUrls: ['./t1.component.css']
})
export class T1Component implements OnInit {

  constructor() { }
  ngOnInit(): void {
    
    function currentpos(){
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          let latitude = position.coords.latitude
          let longitude = position.coords.longitude

          function initAutocomplete() {
            //load map
            const map = new google.maps.Map(
              document.getElementById("map") as HTMLElement,
              {
                center: { lat: latitude, lng: longitude },
                zoom: 12,
                mapTypeId: "roadmap",
              }
            );

            //load marker
           let marker = new google.maps.Marker({
              position: new google.maps.LatLng(latitude, longitude),
              map: map,
              draggable:true,
              // title: "Hello World!",
              animation: google.maps.Animation.DROP
            });
          
            // get lat and lng while dragging
            google.maps.event.addListener(marker, 'dragend', 
            function(marker: { latLng: any; }){
              var latLng = marker.latLng; 
              let currentLatitude = latLng.lat();
              let currentLongitude = latLng.lng();
              latitude=currentLatitude
              longitude=currentLongitude
              console.log(currentLatitude);
              console.log(currentLongitude);

              function getReverseGeocodingData(lat:any, lng:any) {
                var latlng = new google.maps.LatLng(lat, lng);
                // This is making the Geocode request
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'location': latlng},  (results, status) =>{
                  if (status == google.maps.GeocoderStatus.OK) {
                    if (results) {
                      var address = (results[0].formatted_address);
                      var la = (results[0].geometry.location.lat());
                      (document.getElementById("pac-input" )as HTMLInputElement).value = address
                      
                    }
                  } 
                }); 
              }
              getReverseGeocodingData(latitude,longitude)
            })

            // Create the search box and link it to the UI element.
            const input = document.getElementById("pac-input") as HTMLInputElement;
            const searchBox = new google.maps.places.SearchBox(input);
          
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          
            // Bias the SearchBox results towards current map's viewport.
            map.addListener("bounds_changed", () => {
              searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
            });
          
            let markers: google.maps.Marker[] = [];
          
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener("places_changed", () => {
              const places = searchBox.getPlaces();
          
              if (places?.length == 0) {
                return;
              }
          
              // Clear out the old markers.
              markers.forEach((marker) => {
                marker.setMap(null);
              });
              markers = [];
          
              // For each place, get the icon, name and location.
              const bounds = new google.maps.LatLngBounds();
          
              places?.forEach((place) => {
                // console.log(place.geometry?.location?.lat());
                // console.log(place.geometry?.location?.lng());
                if (!place.geometry || !place.geometry.location) {
                  console.log("Returned place contains no geometry");
                  return;
                }
          
                const icon = {
                  url: place.icon as string,
                  size: new google.maps.Size(71, 71),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(17, 34),
                  scaledSize: new google.maps.Size(25, 25),
                };
          
                // Create a marker for each place.
                markers.push(
                  new google.maps.Marker({
                    map,
                    icon,
                    title: place.name,
                    position: place.geometry.location,
                  })
                );
          
                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
              });
              map.fitBounds(bounds);
            });
          }
          initAutocomplete()
        })
      }
    }
    currentpos()
  }

}
