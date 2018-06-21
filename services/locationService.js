fluid.registerNamespace("myL3");

fluid.defaults("myL3.locationService", {
    gradeNames: "fluid.component",
    invokers: {
        locationImport: {
            funcName: "myL3.locationService.locationImport",
        },
        addGoogleMap: {
            funcName: "myL3.locationService.addGoogleMap"
        }
    }
});

myL3.locationService.importLocation = function () {
    $('#weatherTable').hide();
    $('#buttons').hide();
    $('#spinner').show();
    $('#goBack').show();

    if(myL3.isLocationAvailable) {
        $('#city').html(`Country: ${myL3.countryNames[myL3.oneTimeWeatherData.sys.country]}, City: ${myL3.oneTimeWeatherData.name} <br><br>`);
        $('#city').show();
        if(myL3.mapAvailable) {
            $('#map').show();
        } else {
            myL3.locationService.addGoogleMap();
        }
    } else {
        const fakeArray = [];
        myL3.commonService.getData(fakeArray);
    }
}

myL3.locationService.addGoogleMap = function () {
    // callback function used by google maps.
    myMap = () => {
        const myLatLng = { 
            lat: myL3.oneTimePosition.coords.latitude,
            lng: myL3.oneTimePosition.coords.longitude
        };

        let map = new google.maps.Map(document.getElementById("map"), {
            center: myLatLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.HYBRID
        });

        let marker = new google.maps.Marker({
            map: map,
            position: myLatLng,
            title: 'Location provided by you device'
        });
    }

    // Adding google maps using lat and lon
    let script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${myL3.apiKeys.googleMapKey}&callback=myMap`;
    $('body').append(script);
    $('#map').show();
    myL3.mapAvailable = true;
    // google maps added.
}