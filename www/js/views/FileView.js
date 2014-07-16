window.FileView = window.PagedView.extend({

    initialize: function() {
        window.FileView.__super__.initialize.apply(this);
        var text =
            "This is readme.txt\n" +
            "A file used to demonstrate PhoneGap's File API.\n" +
            "Feel free to modify it, and save it using the write API.\n" +
            "In this app, the file is reinitialized every time this screen is loaded."
        this.writeFile("readme.txt", text);
        $("#writeFileArea").html(text);
    },

    events: {
        "click .readBtn"    : "readHandler",
        "click .writeBtn"   : "writeHandler"
    },

    readFile:function(fileName, selector) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(fileName, {create: false, exclusive: false},
                    function(file) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            $(selector).html(event.target.result);
                        };
                        reader.onerror = function(event) {
                            showAlert('Error loading file');
                        };
                        reader.readAsText(file);
                    },
                    this.getFileError);
            },
            this.fsError);
    },

    writeFile: function(fileName, text, displayMessage) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(fileName, {create: true, exclusive: false},
                    function(file) {
                        file.createWriter(
                            function(writer) {
                                writer.onwrite = function(event) {
                                    if (displayMessage) {
                                        navigator.notification.alert(
                                            fileName + ' was saved successfully',  // message
                                            null,
                                            'File Save',            // title
                                            'OK'                  // button label
                                        );
                                    }
                                };
                                writer.onerror = function(event) {
                                    navigator.notification.alert(
                                        'An error occurred while saving the file',  // message
                                        null,
                                        'File Save',            // title
                                        'OK'                  // button label
                                    );
                                };
                                writer.write(text);
                            },
                            function() {
                                showAlert('An error has occurred', 'createWriter');
                            }
                        );
                    },
                    this.getFileError);
            },
            this.fsError);
    },

    readHandler: function() {
        this.readFile('readme.txt', '#readFileArea');
        return false;
    },

    writeHandler: function() {
        this.writeFile('readme.txt', $('#writeFileArea').val(), true);
        return false;
    }

});