window.PagedView = Backbone.View.extend({

    wrapperWidth: 0,

    initialize: function () {
        _.bindAll(this);
        this.render();
        $('select, input, .noscroll').on('touchstart', function(event){
            event.stopPropagation();
        });
    },

    render: function () {
        $(this.el).html(this.template());
        this.iscroll = new TWIS('#pageWrapper');
        this.updateLayout();
        this.iscroll.scrollToPage(this.options.page);
        prettyPrint();
        return this;
    },

    showPage: function(page) {
        this.iscroll.scrollToPage(page);
        return false;
    },

    updateLayout: function() {
        var currentPage = 0;
        if (this.wrapperWidth > 0) {
            currentPage = - Math.ceil( $('.slider').position().left / this.wrapperWidth);
        }
        this.wrapperWidth = $('.page-wrapper').width();
        console.log('wrapperWidth: ' + this.wrapperWidth);
        $('.slider').css('width', this.wrapperWidth * 4);
        $('.page').css('width', this.wrapperWidth - 40);
        this.iscroll.refresh();
        this.iscroll.scrollToPage(currentPage, 0, 0);
    }

});