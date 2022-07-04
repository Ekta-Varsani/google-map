import { Component, OnInit } from '@angular/core';

 // autocomplete service  
 class AutocompleteDirectionsHandler {
  map: google.maps.Map;
  originPlaceId: string;
  destinationPlaceId: string;
  travelMode: google.maps.TravelMode;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById(
      "origin-input"
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      "destination-input"
    ) as HTMLInputElement;


    // Specify just the place data fields that you need.
    const originAutocomplete = new google.maps.places.Autocomplete(
      originInput,
      { fields: ["name", "formatted_address", "place_id", "geometry"] }
    );

    // Specify just the place data fields that you need.
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput,
      { fields: ["name", "formatted_address", "place_id", "geometry"] }
    );

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
  }

  setupPlaceChangedListener(
    autocomplete: google.maps.places.Autocomplete,
    mode: string
  ) {
    autocomplete.bindTo("bounds", this.map);

    autocomplete.addListener("place_changed", () => {

     /*use for get latitude and longitude  */
      var place = autocomplete.getPlace();
      var lat = place.formatted_address
      console.log(place);
      
      var lng =place.formatted_address

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }

      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      this.route();
    });
  }
  
  getDistance() {
    //Find the distance
    var distanceService = new google.maps.DistanceMatrixService();
    distanceService.getDistanceMatrix({
      origins: [(document.getElementById("origin-input") as HTMLInputElement).value],
      destinations: [(document.getElementById("destination-input")as HTMLInputElement).value],
      travelMode: google.maps.TravelMode.DRIVING,
    },
      function (response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          console.log('Error:', status);
        } else {
          if(response){
            (document.getElementById("distance") as HTMLInputElement).innerText = "Distance: " +(response.rows[0].elements[0].distance.text);
            (document.getElementById("duration") as HTMLInputElement).innerText = "Duration: " + (response.rows[0].elements[0].duration.text)
          }
          
        }
      });
  }

  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    const me = this;
    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
      },
      (response, status) => {
        if (status === "OK") {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
    this.getDistance()
  }
}


@Component({
  selector: 'app-t2',
  templateUrl: './t2.component.html',
  styleUrls: ['./t2.component.css']
})
export class T2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    async function initMap() {
      const uluru = { lat: 20.5937, lng: 78.9629 }
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          mapTypeControl: false,
          center: uluru,
          zoom: 4,
        }
      );

      //set input box on map
      const originInput = document.getElementById("origin-input") as HTMLInputElement;
      const destinationInput = document.getElementById("destination-input") as HTMLInputElement;
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(originInput);
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(destinationInput);

      const marker = new google.maps.Marker({
        position: uluru,
        map: map,
        draggable: true,
      });
      new AutocompleteDirectionsHandler(map);
    }
    
    initMap();
  }

  }


