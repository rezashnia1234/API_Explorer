window.ContactView = window.PagedView.extend({

    events: {
        "click #findBtn":   "findHandler",
        "click #createBtn": "createHandler"
    },

    findHandler: function() {
        var self = this;
        var fields = ["id", "name", "phoneNumbers", 'emails'];
        navigator.contacts.find(
            fields,
            function(contacts) {
                $('#contactList').empty();
                this.contacts = contacts;
                for (var i=0; i < contacts.length; i++) {
                    var contact = contacts[i];
                    $('#contactList').append("<li>" + contact.name.givenName + " " + contact.name.familyName + "</li>");
                }
                if (self.contactScroll) {
                    console.log('Refresh iScroll');
                    self.contactScroll.refresh();
                } else {
                    console.log('New iScroll');
                    self.contactScroll = new iScroll('contactWrapper', {hScrollbar: false, vScrollbar: false });
                }
            },
            this.contactError,
            {filter: $('#contactSearchKey').val(), multiple: true});
        return false;
    },

    createHandler: function() {
        var contact = {};
        contact.name = {givenName: $('#givenName').val(), familyName:  $('#lastName').val()};
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField($('#phoneType1').val(), $('#phone1').val());
        phoneNumbers[1] = new ContactField($('#phoneType2').val(), $('#phone2').val());
        contact.phoneNumbers = phoneNumbers;
        var emails = [];
        emails[0] = new ContactField($('#emailType1').val(), $('#email1').val());
        emails[1] = new ContactField($('#emailType2').val(), $('#email2').val());
        contact.emails = emails;
        var result = navigator.contacts.create(contact);
        result.save();
        $('#givenName').val('');
        $('#lastName').val('');
        $('#phoneType1').val('');
        $('#phoneType2').val('');
        $('#phone1').val('');
        $('#phone2').val('');
        $('#emailType1').val('');
        $('#emailType2').val('');
        $('#email1').val('');
        $('#email2').val('');
        return false;
    },

    contactError: function() {
        showAlert('An error has occurred', 'Contact');
    }

});
