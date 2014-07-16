window.CameraView = window.PagedView.extend({

    events: {
        "click .getBtn":    "getPicture",
        "click .cleanBtn":  "cleanup"
    },

    getPicture: function() {
        navigator.camera.getPicture(this.successHandler, this.errorHandler,
            {   quality: parseInt($('#quality').val(), 10),
                destinationType: parseInt($('#destinationType').val(), 10),
                sourceType: parseInt($('#sourceType').val(), 10),
                encodingType: parseInt($('#encodingType').val(), 10)
            });
        return false;
    },

    cleanup: function() {
        navigator.camera.cleanup(
            function() {
                showAlert('Success', 'cleanup');
            },
            function() {
                showAlert('Error', 'cleanup');
            });
        return false;
    },

    successHandler: function(imageData) {
        $('#image').attr('src', "data:image/jpeg;base64," + imageData);
    },

    errorHandler: function(error) {
        showAlert(error, "Camera");
    },

    close: function() {
        navigator.camera.cleanup();
    }

});
