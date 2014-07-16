window.AccelerometerView = window.PagedView.extend({

    events: {
        "click .getBtn":            "getHandler",
        "click .watchBtn":          "watchHandler",
        "click .clearBtn":          "clearHandler",
        "change #watchFrequency":   "changeFrequency"
    },

    getHandler: function () {
        navigator.accelerometer.getCurrentAcceleration(this.successHandler, this.errorHandler);
        return false;
    },

    watchHandler: function () {
        if (this.watchId) {
            showAlert("You are already watching", "Accelerometer");
        } else {
            this.watchId = navigator.accelerometer.watchAcceleration(this.watchSuccessHandler, this.errorHandler, { frequency: Number($('#watchFrequency').val()) });
            $('#watchId1').html('"' + this.watchId + '"');
            $('#watchId2').html('"' + this.watchId + '"');
        }
        return false;
    },

    clearHandler: function () {
        if (this.watchId) {
            navigator.accelerometer.clearWatch(this.watchId);
            this.watchId = undefined;
            delete(this.watchId);
            $('#watchId1').html('undefined');
            $('#watchId2').html('undefined');
        } else {
            showAlert("Nothing to clear", "Accelerometer");
        }
        return false;
    },

    changeFrequency: function () {
        if (this.watchId) {
            navigator.accelerometer.clearWatch(this.watchId);
            delete(this.watchId);
            this.watchHandler();
        }
        return false;
    },

    successHandler: function (acceleration) {
        $('#accelerationX1').html(acceleration.x);
        $('#accelerationY1').html(acceleration.y);
        $('#accelerationZ1').html(acceleration.z);
        $('#accelerationTime1').html(acceleration.timestamp);
    },

    watchSuccessHandler: function (acceleration) {
        $('#accelerationX2').html(acceleration.x);
        $('#accelerationY2').html(acceleration.y);
        $('#accelerationZ2').html(acceleration.z);
        $('#accelerationTime2').html(acceleration.timestamp);
    },

    errorHandler: function (error) {
        showAlert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n', 'Error');
    },

    close: function() {
        if (this.watchId) {
            navigator.accelerometer.clearWatch(this.watchId);
        }
    }

});