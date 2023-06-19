import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GeoService {
  constructor() { }

  getUserCountry(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.successCallback,
        this.errorCallback
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  successCallback(position: GeolocationPosition): void {
    const latitude: number = position.coords.latitude;
    const longitude: number = position.coords.longitude;

    const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
    const latlng: google.maps.LatLngLiteral = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results![0]) {
          const country: google.maps.GeocoderAddressComponent | undefined = results![0].address_components.find(
            (component: google.maps.GeocoderAddressComponent) => component.types.includes("country")
          );
          if (country) {
            console.log("User's country:", country.long_name);
          }
        }
      } else {
        console.log("Geocoder failed due to:", status);
      }
    });
  }

  errorCallback(error: GeolocationPositionError): void {
    console.log("Geolocation error occurred:", error.message);
  }
}
