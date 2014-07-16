window.GeolocationView = window.PagedView.extend({

    render: function() {
        window.GeolocationView.__super__.render.apply(this);
        var myOptions = {
                  center: new google.maps.LatLng(-34.397, 150.644),
                  zoom: 8,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                };
        this.map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
    },

    events: {
        "click .getBtn":            "getPosition",
        "click .watchBtn":          "watchPosition",
        "click .clearBtn":          "clearHandler",
        "click .googleBtn":         "mapPosition",
        "change #watchFrequency":   "changeFrequency"
    },

    getPosition: function() {
        navigator.geolocation.getCurrentPosition(this.successHandler, this.errorHandler,
            {   enableHighAccuracy: $('#slAccuracy1').val(),
//                timeout: Number( $('#slTimeout1').val() ),
                maximumAge: Number( $('#slMaxAge1').val() )
            });
        return false;
    },

    mapPosition: function() {
        navigator.geolocation.getCurrentPosition(this.googleSuccessHandler, this.errorHandler,
            { enableHighAccuracy: true });
        return false;
    },

    watchPosition: function() {
        if (this.watchId) {
            showAlert('You are already watching', 'Geolocation')
        } else {
            this.watchId = navigator.geolocation.watchPosition(this.watchSuccessHandler, this.errorHandler,
                {   enableHighAccuracy: $('#slAccuracy2').val(),
//                    timeout: Number( $('#slTimeout2').val() ),
                    maximumAge: Number( $('#slMaxAge2').val() )
                });
            $('#watchId1').html('"' + this.watchId + '"');
            $('#watchId2').html('"' + this.watchId + '"');
        }
        return false;
    },

    clearHandler: function () {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            delete(this.watchId);
            $('#watchId1').html('undefined');
            $('#watchId2').html('undefined');
        } else {
            showAlert('Nothing to clear', 'Geolocation');
        }
        return false;
    },

    changeFrequency: function () {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            delete(this.watchId);
            this.watchPosition();
        }
        return false;
    },

    successHandler: function(position) {
        $('#latitude1').html(position.coords.latitude);
        $('#longitude1').html(position.coords.longitude);
        $('#altitude1').html(position.coords.altitude);
        $('#accuracy1').html(position.coords.accuracy);
        $('#altitudeAccuracy1').html(position.coords.altitudeAccuracy);
        $('#heading1').html(position.coords.heading);
        $('#speed1').html(position.coords.speed);
        $('#timestamp1').html(position.timestamp);
    },

    googleSuccessHandler: function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(latLng);
        if (this.marker) {
            this.marker.setPosition(latLng)
        } else {
            this.marker = new google.maps.Marker({map: this.map, position: latLng});
        }
    },

    watchSuccessHandler: function(position) {
        $('#latitude2').html(position.coords.latitude);
        $('#longitude2').html(position.coords.longitude);
        $('#altitude2').html(position.coords.altitude);
        $('#accuracy2').html(position.coords.accuracy);
        $('#altitudeAccuracy2').html(position.coords.altitudeAccuracy);
        $('#heading2').html(position.coords.heading);
        $('#speed2').html(position.coords.speed);
        $('#timestamp2').html(position.timestamp);
    },

    errorHandler: function(error) {
        navigator.notification.alert(
            "Can't get your current location. Make sure the geolocation service is enabled for this app.",
            null,
            'Geolocation',
            'OK'
        );
    },

    close: function() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }


});