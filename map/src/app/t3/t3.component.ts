import { Component, OnInit } from '@angular/core';

let latitude: any;
let longitude: any
 
let arr1: any = [];
let coords: any = 0;
let coordString: any = [];
let coordFinalArray: any = [];
let arrLat: any = [];
let arrLng: any = [];
let newArrLat: any = [];
let newArrLng: any = [];
let path = false
function printpolygon(coords: any, arrLat: any, arrLng: any, latitude: any, longitude: any) {
  let oddNodes: any = false;
  let j = coords - 1;
  for (let i = 0; i < coords; i++) {
    if (arrLng[i] < longitude && arrLng[j] >= longitude || arrLng[j] < longitude && arrLng[i] >= longitude && (arrLat[i] <= latitude || arrLat[j] <= latitude)) {
      if ((arrLat[i] + (longitude - arrLng[i]) * (arrLat[j] - arrLat[i]) / (arrLng[j] - arrLng[i])) < latitude) {
        oddNodes = !oddNodes
      }
    }
    j = i;
  }
  return oddNodes;
}

@Component({
  selector: 'app-t3',
  templateUrl: './t3.component.html',
  styleUrls: ['./t3.component.css']
})
export class T3Component implements OnInit {
  
  constructor() { }
  ngOnInit(): void {

    function initMap(): void {
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 20.5937, lng: 78.9629 },
          zoom: 4,
        }
      );

      // Create the search box and link it to the UI element.
      const input = document.getElementById("origin-input") as HTMLInputElement;
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

        if (places) {
          latitude = places[0].geometry?.location?.lat();
          longitude = places[0].geometry?.location?.lng();
        }
       
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

        for (let x = 0; x < arrLat.length; x++) {
          let value = arrLat[x]
          let value2 = parseFloat(value)
          newArrLat.push(value2)
        }
        for (let y = 0; y < arrLng.length; y++) {
          let value3 = arrLng[y]
          let value4 = parseFloat(value3)
          newArrLng.push(value4)
        }

        if (printpolygon(coords, newArrLat, newArrLng, latitude, longitude)) {
          (document.getElementById("success") as HTMLElement).innerText = "Yes! Entered location belongs to drawn zone.";
          (document.getElementById("success") as HTMLElement).style.color = "green";
         
        }
        else {
          (document.getElementById("success") as HTMLElement).innerText = "Sorry! Entered location doesn’t belongs to drawn zone.";
          (document.getElementById("success") as HTMLElement).style.color = "red";
        }
      });

      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
          ]
        },
        markerOptions: {
          icon: 'images/car-icon.png'
        },
        polygonOptions: {
          fillColor: '#66ff99',
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: '#006699',
          clickable: false,
          editable: false,
          zIndex: 1
        }
      });

      drawingManager.setMap(map);

      google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon: any) {
        for (var i = 0; i < polygon.getPath().getLength(); i++) {
          arr1.push(polygon.getPath().getAt(i).toUrlValue(6))
          coords++
          path = true
        }
        console.log(coords);
        
        (document.getElementById("origin-input") as HTMLInputElement).removeAttribute("disabled");
        
        coordString = arr1.toString(',')
        coordFinalArray = coordString.split(',')
        for (let j = 0; j < coordFinalArray.length; j++) {
          if (j % 2 == 0) {
            arrLat.push(coordFinalArray[j])
          }
          else {
            arrLng.push(coordFinalArray[j])
          }
        }
        console.log(arrLat);
        console.log(arrLng);
        
        
      });
    }
    initMap()
  }
}
