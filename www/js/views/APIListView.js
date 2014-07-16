SideBarView = Backbone.View.extend({

    events: {
        "click li": "selectItem"
    },

    selectItem: function(event) {
        $('li', $(this.el)).removeClass('active');
        $(event.currentTarget).addClass('active');
    }

});


SampleListView = Backbone.View.extend({

    initialize: function() {
        _.bindAll(this);
        this.render();
        this.model.on('reset', this.render);
    },

    events: {
        "click li": "selectItem"
    },

    render: function(eventName) {
        var ul = $('ul', this.el);
        ul.empty();
        _.each(this.model.models, function(api) {
            ul.append(new SampleListItemView({model: api}).render().el);
        }, this);
        if (this.iscroll) {
            console.log('Refresh iScroll');
            this.iscroll.refresh();
        } else {
            console.log('New iScroll');
            this.iscroll = new iScroll(this.el, {hScrollbar: false, vScrollbar: false });
        }
        return this;
    },

    selectItem: function(event) {
        $('li', $(this.el)).removeClass('active');
        $(event.currentTarget).addClass('active');
    }

});

SampleListItemView = Backbone.View.extend({

    tagName: "li",

    events: {
        "click": "selectItem"
    },

    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    selectItem: function(event) {
        var methods = this.model.get('methods');
        if (methods) {
            eventDispatcher.trigger('showMethods', this.model);
        } else if (this.model.get('view')) {
            eventDispatcher.trigger('navigate', 'api/' + this.model.get('view'));
        }
        return false;
    }
});