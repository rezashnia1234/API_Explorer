window.CaptureView = window.PagedView.extend({

    events: {
        "click .audioBtn":  "captureAudio",
        "click .imgBtn":    "captureImage",
        "click .videoBtn":  "captureVideo"
    },

    captureAudio: function() {
        var self = this;
        navigator.device.capture.captureAudio(
            function(files) {
                $('#capturedAudio').attr('controls', 'controls');
                self.loadMedia(files, "#capturedAudio");
            },
            this.errorHandler,
            {
                duration: Number($('#duration').val())
            });
        return false;
    },

    captureImage: function() {
        var self = this;
        navigator.device.capture.captureImage(function(files) {
            $('#capturedImage').show();
            self.loadMedia(files, "#capturedImage");
        }, this.errorHandler)
        return false;
    },

    captureVideo: function() {
        var self = this;
        navigator.device.capture.captureVideo(function(files) {
            self.loadMedia(files, "#capturedVideo");
        }, this.errorHandler)
        return false;
    },

    loadMedia: function(files, target) {
        var i, path, len;
        for (i = 0, len = files.length; i < len; i += 1) {
            path = files[i].fullPath;
            $(target).attr('src', path);
        }
    },

    errorHandler: function(error) {
        showAlert(error, "Capture");
    }

});