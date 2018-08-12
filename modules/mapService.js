// this file performs reverse-geocoding using Google Maps and creates google map.
// Both of the above operations are carried out using geolocation (latitude & longitude)

import { weatherService } from './weatherService.js';

export class GoogleMap {

    constructor() {}

    static showMapAndAddress() {
        var myL3 = window.myL3 || {};

        if(!navigator.onLine) {
            alert('Seems you are offline.');
        } else {
            var myL3 = window.myL3 || {};

            weatherService.getLocation()
            .then((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                let mapKey;
                if(myL3.apiKeys.googleMapKey) {
                    mapKey = myL3.apiKeys.googleMapKey;
                } else {
                    mapKey = prompt("Please enter Google maps key:");
                }
                if(mapKey === null || mapKey === '') {
                    $('#spinner').hide();
                    alert('Please provide API key');
                    return;
                }

                $.getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},
                ${lon}&key=${mapKey}`, (locationData) => {
                    if(locationData.results.length) {
                        let storedLocationData = {};
                        if(localStorage.locationData) {
                            storedLocationData = JSON.parse(localStorage.locationData);
                        }
                        storedLocationData[new Date().toLocaleDateString()] = JSON.stringify(locationData);
                        localStorage.locationData = JSON.stringify(storedLocationData);
    
                        console.log(locationData, locationData.results[0].formatted_address);
                        const address = locationData.results[0].formatted_address;
                        $('#address').html(address);
                        this.addGoogleMap(position, mapKey, address);
                    } else {
                        // Geocoding API calls limit exceeded
                        this.addGoogleMap(position, mapKey, address);
                    }
                })
            })
        }
    }

    static addGoogleMap(position, mapKey, address) {

        // callback function used by google maps.
        myL3.initMap = () => {
            const myLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        
            let map = new google.maps.Map(document.getElementById("map"), {
                center: myLatLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });
        
            let marker = new google.maps.Marker({
                map: map,
                position: myLatLng,
                title: address
            });
        }
        // Adding google map using lat and lon
        let script = document.createElement('script');
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=myL3.initMap`;
        $('body').append(script);
        $('#spinner').hide();
        $('.locationContainer').show();
        // google map added.
    }
}