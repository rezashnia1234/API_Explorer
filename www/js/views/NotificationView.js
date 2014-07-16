window.NotificationView = window.PagedView.extend({

    events: {
        "click .alertBtn"   : "alertHandler",
        "click .confirmBtn" : "confirmHandler",
        "click .beepBtn"    : "beepHandler"
    },

    alertHandler: function() {
        var self = this;
        navigator.notification.alert(
            $('#message1').val(),  // message
            function() {            // callback
                self.log("#log1", "Alert dismissed");
            },
            $('#title1').val(),            // title
            $('#buttonLabel').val()                  // button label
        );
        return false;
    },

    confirmHandler: function() {
        var self = this;
        navigator.notification.confirm(
            $('#message2').val(),  // message
            function(button) {
                self.log("#log2", "Confirm dismissed. You pressed button #: " + button);
            },
            $('#title2').val(),            // title
            $('#buttonLabels').val()                  // button label
        );
        return false;
    },

    beepHandler: function() {
        navigator.notification.beep(1);
        return false;
    },

    log: function(selector, msg) {
        $(selector).val($(selector).val() + msg + "\r\n");
    }

});