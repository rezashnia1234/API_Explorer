window.EventsView = window.PagedView.extend({

    events: {
        "click #pauseBtn":   "addPauseResume",
        "click #onlineBtn":  "addOnlineOffline",
        "click #batteryBtn": "addBattery",
        "click #callBtn":    "addCall"
    },

    addPauseResume: function () {
        if (this.pauseResumeRegistered) {
            showAlert("The pause and resume events have already been registered", "Error");
            return;
        }
        this.logListener("#pauseLog", "pause");
        document.addEventListener("pause", this.pauseHandler, false);
        this.logListener("#pauseLog", "resume");
        document.addEventListener("resume", this.resumeHandler, false);
        this.pauseResumeRegistered = true;
    },

    addOnlineOffline: function () {
        if (this.onlineOfflineRegistered) {
            showAlert("The online and offline events have already been registered", "Error");
            return;
        }
        this.logListener("#onlineLog", "online");
        document.addEventListener("online", this.onlineHandler, false);
        this.logListener("#onlineLog", "offline");
        document.addEventListener("resume", this.offlineHandler, false);
        this.onlineOfflineRegistered = true;
    },

    addBattery: function () {
        if (this.batteryRegistered) {
            showAlert("The battery events have already been registered", "Error");
            return;
        }
        this.logListener("#batteryLog", "batterystatus");
        document.addEventListener("batterystatus", this.batterystatusHandler, false);
        this.logListener("#batteryLog", "batterylow");
        document.addEventListener("batterylow", this.batterylowHandler, false);
        this.logListener("#batteryLog", "batterycritical");
        document.addEventListener("batterycritical", this.batterycriticalHandler, false);
        this.batteryRegistered = true;
    },

    addCall: function () {
        if (this.callRegistered) {
            showAlert("The startcall and endcall events have already been registered", "Error");
            return;
        }
        this.logListener("#callLog", "online");
        document.addEventListener("startcall", this.startcallHandler, false);
        this.logListener("#callLog", "endcall");
        document.addEventListener("resume", this.endcallHandler, false);
        this.callRegistered = true;
    },

    log: function(selector, msg) {
        $(selector).val($(selector).val() + msg + "\r\n");
    },

    logListener: function(selector, name) {
        this.log(selector, 'Adding event listener "' + name + '"');
    },

    pauseHandler: function() {
        this.log('#pauseLog', 'Event: pause');
    },

    resumeHandler: function() {
        this.log('#pauseLog', 'Event: resume');
    },

    onlineHandler: function() {
        this.log('#onlineLog', 'Event: online');
    },

    offlineHandler: function() {
        this.log('#onlineLog', 'Event: offline');
    },

    batterystatusHandler: function() {
        this.log('#batteryLog', 'Event: batterystatus');
    },

    batterylowHandler: function() {
        this.log('#batteryLog', 'Event: batterylow');
    },

    batterycriticalHandler: function() {
        this.log('#batteryLog', 'Event: batterycritical');
    },

    startcallHandler: function() {
        this.log('#callLog', 'Event: startcall');
    },

    endcallHandler: function() {
        this.log('#callLog', 'Event: endcall');
    },

    close: function() {
        document.removeEventListener('pause', this.pauseHandler);
        document.removeEventListener('resume', this.resumeHandler);
        document.removeEventListener('online', this.onlineHandler);
        document.removeEventListener('offline', this.offlineHandler);
        document.removeEventListener('batterystatus', this.batterystatusHandler);
        document.removeEventListener('batterylow', this.batterylowHandler());
        document.removeEventListener('batterycritical', this.batterycritical);
        document.removeEventListener('startcall', this.startcall);
        document.removeEventListener('endcall', this.endcall);
    }

});
