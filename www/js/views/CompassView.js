window.CompassView = window.PagedView.extend({

    events: {
        "click .getBtn"             : "getHandler",
        "click .watchBtn"           : "watchHandler",
        "click .clearBtn"           : "clearHandler",
        "change #watchFrequency"    : "changeFrequency"
    },

    getHandler: function () {
        navigator.compass.getCurrentHeading(this.successHandler, this.errorHandler);
        return false;
    },

    watchHandler: function () {
        if (this.watchId) {
            showAlert('You are already watching', 'Compass')
        } else {
//            this.geoWatchId = navigator.geolocation.watchPosition();
            this.watchId = navigator.compass.watchHeading(this.watchSuccessHandler, this.errorHandler, { frequency: Number($('#watchFrequency').val()) });
            $('#watchId1').html('"' + this.watchId + '"');
            $('#watchId2').html('"' + this.watchId + '"');
        }
        return false;
    },

    clearHandler: function () {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.geoWatchId);
            navigator.compass.clearWatch(this.watchId);
            delete(this.geoWatchId);
            this.watchId = undefined;
            delete(this.watchId);
            $('#watchId1').html('undefined');
            $('#watchId2').html('undefined');
        } else {
            showAlert('Nothing to clear', 'Compass');
        }
        return false;
    },

    changeFrequency: function () {
        if (this.watchId) {
            navigator.compass.clearWatch(this.watchId);
            delete(this.watchId);
            this.watchHandler();
        }
        return false;
    },

    successHandler: function (compassHeading) {
        $('#magneticHeading').html(compassHeading.magneticHeading);
        $('#trueHeading').html(compassHeading.trueHeading);
        $('#headingAccuracy').html(compassHeading.headingAccuracy);
        $('#headingTimestamp').html(compassHeading.timestamp);

//        $("#compass").css({
//            'transform': 'rotate(' + Math.round(compassHeading.magneticHeading) + 'deg)',
//            '-moz-transform': 'rotate(42deg)',
//            '-o-transform': 'rotate(42deg)',
//            '-webkit-transform': 'rotate(' + Math.round(compassHeading.magneticHeading) + 'deg)'
//        });
    },

    watchSuccessHandler: function (compassHeading) {
        $('#magneticHeading2').html(compassHeading.magneticHeading);
        $('#trueHeading2').html(compassHeading.trueHeading);
        $('#headingAccuracy2').html(compassHeading.headingAccuracy);
        $('#headingTimestamp2').html(compassHeading.timestamp);

//        $("#compass2").css({
//            'transform': 'rotate(' + Math.round(compassHeading.magneticHeading) + 'deg)',
//            '-moz-transform': 'rotate(42deg)',
//            '-o-transform': 'rotate(42deg)',
//            '-webkit-transform': 'rotate(' + Math.round(compassHeading.magneticHeading) + 'deg)'
//        });
    },

    errorHandler: function (error) {
        showAlert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n', 'Error');
    },

    close: function() {
        if (this.watchId) {
            navigator.compass.clearWatch(this.watchId);
        }
        if (this.geoWatchId) {
            navigator.geolocation.clearWatch(this.geoWatchId);
        }
    }

});