import { Injectable } from '@angular/core';
import { GeocoderResponse } from '../models/geocode-responce.model';
import { HolidaysService } from './holidays.service';

@Injectable({
  providedIn: 'root',
})
export class GeoService {
  userCountry: string | undefined; // TODO: you have declared setter & getter but haven't made the property private
  private geolocationWorking = false;
  private geocoderWorking = false;
  constructor(private holidayService: HolidaysService) {}

  set setCountry(country: string) {
    this.userCountry = country;
  }

  get getCountry() {
    return this.userCountry;
  }

  getCurrentLocation() {
    this.geolocationWorking = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.geolocationWorking = false;
        const latitude: number = position.coords.latitude;
        const longitude: number = position.coords.longitude;
        const point: google.maps.LatLngLiteral = {
          lat: latitude,
          lng: longitude,
        };
        this.geocoderWorking = true;
        this.geocodeLatLng(point)
          .then((response: GeocoderResponse) => {
            // TODO: this whole code is just unreadable, eliminate nesting. For ex: this.userCountry = value.address_components[value.address_components.length - 1].short_name;
            if (response.status === 'OK' && response.results?.length) {
              const value = response.results[0];
              this.userCountry = value.address_components[value.address_components.length - 1].short_name;

                console.log(this.userCountry);

              this.holidayService.fetchAllHolidays(this.userCountry);
            } else {
              console.error(response.error_message, response.status);
            }
          })
          .finally(() => {
            this.geocoderWorking = false;
          });
      },
      (error) => {
        this.geolocationWorking = false;
        if (error.PERMISSION_DENIED) {
          console.log("Couldn't get your location", 'Permission denied');
        } else if (error.POSITION_UNAVAILABLE) {
          console.log("Couldn't get your location", 'Position unavailable');
        } else if (error.TIMEOUT) {
          console.log("Couldn't get your location", 'Timed out');
        } else {
          console.log(error.message, `Error: ${error.code}`);
        }
      },
      { enableHighAccuracy: true }
    );
  }

  geocodeLatLng(latlng: google.maps.LatLngLiteral): Promise<GeocoderResponse> {
    let geocoder: google.maps.Geocoder = new google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK') {
            if (results![0]) {
              const country: google.maps.GeocoderAddressComponent | undefined =
                results![0].address_components.find(
                  (component: google.maps.GeocoderAddressComponent) =>
                    component.types.includes('country')
                );
              if (country) {
                const response = new GeocoderResponse(status, results!);
                resolve(response);
              }
            }
          } else {
            console.log('Geocoder failed due to:', status);
            reject(status);
          }
        });
      });
    });
  }
}
