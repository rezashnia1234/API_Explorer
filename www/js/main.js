/* TODO:

    clean iscroll resources (contacts & db)
    clean twis resources (each page)
    Check geoLocation timeout
    Why geolocation fails in compass
    unwatch doesn't remove the location symbol

*/

var AppRouter = Backbone.Router.extend({

    routes: {
        "api/:name":        "api",
        "api/:name/:page":  "page",
        "doc/:name":        "doc"
    },

    initialize: function (options) {

        var self = this;

        this.samples = new SampleCollection([
            {id: 1, name: "Accelerometer", view: "AccelerometerView", description: "Get x, y, z device acceleration",
                methods: [
                    {name: "getCurrentAcceleration", view: "AccelerometerView/0", description: "Get device's current acceleration"},
                    {name: "watchAcceleration", view: "AccelerometerView/1", description: "Watch acceleration at specified interval"},
                    {name: "clearWatch", view: "AccelerometerView/2", description: "Stop watching acceleration"}
                ]},
            {id: 2, name: "Camera", view: "CameraView", description: "Take pictures from your app",
                methods: [
                    {name: "getPicture", view: "CameraView/0", description: "Get a picture from the camera app"},
                    {name: "cleanup", view: "CameraView/1", description: "Cleanup temporary files"}
                ]},
            {id: 3, name: "Capture", view: "CaptureView", description: "Sound, pictures, and videos",
                methods: [
                    {name: "captureAudio", view: "CaptureView/0", description: "Record an audio clip"},
                    {name: "captureImage", view: "CaptureView/1", description: "Take a picture using device's camera app"},
                    {name: "captureVideo", view: "CaptureView/2", description: "Record a video clip"}
                ]},
            {id: 4, name: "Compass", view: "CompassView", description: "Get compass orientation",
                methods: [
                    {name: "getCurrentHeading", view: "CompassView/0", description: "Get current heading"},
                    {name: "watchHeading", view: "CompassView/1", description: "Watch heading at specified interval"},
                    {name: "clearWatch", view: "CompassView/2", description: "Stop watching heading"}
                ]},
            {id: 5, name: "Connection", view: "ConnectionView/0", description: "Get network connection info"},
            {id: 6, name: "Contacts", view: "ContactView", description: "Find and modify contacts",
                methods: [
                    {name: "create", view: "ContactView/0", description: "Create a contact"},
                    {name: "find", view: "ContactView/1", description: "Find contacts"}
                ]},
            {id: 7, name: "Database", view: "DatabaseView", description: "Access a local database",
                methods: [
                    {name: "transaction", view: "DatabaseView/0", description: "Run a database transaction"},
                    {name: "executeSQL", view: "DatabaseView/1", description: "Execute a SQL statement"},
                    {name: "SQLResultSetList", view: "DatabaseView/2", description: "Manipulate result set with multiple rows"}
                ]},
            {id: 8, name: "Device", view: "DeviceView/0", description: "General device information"},
            {id: 9, name: "Events", view: "EventsView", description: "Handle app life cycle events",
                methods: [
                    {name: "pause and resume", view: "EventsView/0", description: "App background/foreground events"},
                    {name: "online and offline", view: "EventsView/1", description: "Listen for network events"},
                    {name: "battery", view: "EventsView/2", description: "Listen for battery events"},
                    {name: "startcall and endcall", view: "EventsView/3", description: "Listen for call events"}
                ]},
            {id: 10, name: "File", view: "FileView", description: "Read and write local files",
                methods: [
                    {name: "read", view: "FileView/0", description: "Read a text file"},
                    {name: "write", view: "FileView/1", description: "Write a file"}
                ]},
            {id: 11, name: "Geolocation", view: "GeolocationView", description: "Track your location",
                methods: [
                    {name: "getCurrentPosition", view: "GeolocationView/0", description: "Get current location"},
                    {name: "watchPosition", view: "GeolocationView/1", description: "Watch location at regular interval"},
                    {name: "clearWatch", view: "GeolocationView/2", description: "Stop watching location"},
                    {name: "Google Maps", view: "GeolocationView/3", description: "Using the Google Maps API"}
                ]},
            {id: 12, name: "Notification", view: "NotificationView", description: "Display native alerts",
                methods: [
                    {name: "alert", view: "NotificationView/0", description: "Display an alert dialog"},
                    {name: "confirm", view: "NotificationView/1", description: "Display a customizable dialog box"},
                    {name: "beep", view: "NotificationView/2", description: "Play a sound"}
                ]}

        ]);

        this.sampleList = new SampleListView({model: this.samples, el: $('#mainList')});

        methods = new MethodCollection();
        this.methodList = new SampleListView({model: methods, el: $('#subList')});

        // Check of browser supports touch events...
        if (document.documentElement.hasOwnProperty('ontouchstart')) {

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            // ... if yes: register touch event listener to change the "selected" state of the item
            $('body').on('touchstart', 'a', function(event) {
                self.selectItem(event);
            });
            $('body').on('touchend', 'a', function(event) {
                self.deselectItem(event);
            });
        } else {
//            ... if not: register mouse events instead
            $('body').on('mousedown', 'a', function(event) {
                self.selectItem(event);
            });
            $('body').on('mouseup', 'a', function(event) {
                self.deselectItem(event);
            });
        }

    },

    page: function(api, page) {

        var klass = window[api];

        if (klass === undefined) {
            showAlert('API does not exist', 'Error');
            return;
        }

        if (this.currentView && this.currentView instanceof klass) {
            this.currentView.showPage(page);
            return;
        }

        if (this.currentView) {
            if (this.currentView.close) {
                this.currentView.close();
            }
            this.currentView.undelegateEvents();
            $(this.currentView.el).empty();
        }
        this.currentView = new klass({el: "#content", page: page});
    },

    doc: function (name) {
        if (this.currentView) {
            if (this.currentView.close) {
                this.currentView.close();
            }
            this.currentView.undelegateEvents();
            $(this.currentView.el).empty();
        }
        this.currentView = new DocView({el: "#content", api: name});
    },

    selectItem: function(event) {
        $(event.target).addClass('tappable-active');
    },

    deselectItem: function(event) {
        $(event.target).removeClass('tappable-active');
    }

});

templateLoader.load([   'HeaderView',
                        'SampleListItemView',
                        'GeolocationView',
                        'GoogleMapsView',
                        'CameraView',
                        'DeviceView',
                        'AccelerometerView',
                        'CaptureView',
                        'CompassView',
                        'ConnectionView',
                        'ContactView',
                        'EventsView',
                        'NotificationView',
                        'FileView',
                        'DatabaseView'],
    function () {
        app = new AppRouter();
        Backbone.history.start();
});

eventDispatcher = {};

_.extend(eventDispatcher, Backbone.Events);

eventDispatcher.on("showMethods", function(model) {
    $('#title').html(model.get('name'));
    methods.reset(model.get('methods'));
    $('#listContainer').css('left', '-300px');
    $('#backButton').show();
});

eventDispatcher.on("navigate", function(route) {
    app.navigate(route, true);
});