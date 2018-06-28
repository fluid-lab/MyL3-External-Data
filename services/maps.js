function addGoogleMap() {
    // callback function used by google maps.
    myL3 = myL3 || {};
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
            title: 'Location provided by your device'
        });
    }

    // Adding google maps using lat and lon
    let script = document.createElement('script');
    script.async = true;
    script.defer = true;
    var mapKey = prompt("Please enter Google maps key:");
    if(mapKey === null || mapKey === '') {
        $('#spinner').hide();
        alert('Please provide API key');
        return;
    }
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=myMap`;
    $('body').append(script);
    $('#map').show();
    myL3.mapAvailable = true;
    // google maps added.
}