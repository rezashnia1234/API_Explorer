window.DatabaseView = window.PagedView.extend({

    events: {
        "click .txBtn":     "transaction",
        "click .execBtn":   "execSQL",
        "click .rsBtn":     "select"
    },

    transaction: function() {
        var self = this;
        $('#log1').html('');
        this.db = window.openDatabase("mydb", "1.0", "My Database", 1000000);
        this.db.transaction(this.txHandler,
            function(error) {
                self.log('#log1', 'Transaction failed.\nsqlError.code: ' + error.code + '\nsqlError.message: ' + error.message);
            },
            function() {
                self.log('#log1', 'Transaction succeeded');
            });
    },

    txHandler: function(tx) {
        tx.executeSql("DROP TABLE IF EXISTS state");
        tx.executeSql("CREATE TABLE state (id,name)");
        tx.executeSql("INSERT INTO state (id,name) VALUES ('ME','Maine')");
        tx.executeSql("INSERT INTO state (id,name) VALUES ('OH','OHIO')");
    },

    execSQL: function() {
        var self = this;
        $('#log2').html('');
        this.db = window.openDatabase("mydb", "1.0", "My Database", 1000000);
        this.db.transaction(this.executeStatement,
            function(error) {
                self.log('#log2', 'Transaction failed.\nsqlError.code: ' + error.code + '\nsqlError.message: ' + error.message);
            },
            function() {
                self.log('#log2', 'Transaction succeeded');
            });
    },

    executeStatement: function(tx) {
        var params = $('#params1').val().trim().split(",");
        tx.executeSql($("#stmt1").val(), params, this.stmtSuccess, this.stmtError);
    },

    stmtSuccess: function(tx, results) {
        this.log("#log2", "Statement executed successfully" +
            "<br/>sqlResultSet.insertId: " + results.insertId +
            "<br/>sqlResultSet.rowsAffected: " + results.rowsAffected +
            "<br/>sqlResultSet.rows: " + results.rows +
            "<br/>sqlResultSet.rows.length: " + results.rows.length + ' (rows returned)');
    },

    stmtError: function(error) {
        this.log('#log2', 'Statement error' + error.message);
    },

    select: function() {
        var self = this;
        $('#log3').html('');
        this.db = window.openDatabase("mydb", "1.0", "My Database", 1000000);
        this.db.transaction(this.selectTXHandler,
            function(error) {
                self.log('#log3', 'Transaction failed.\nsqlError.code: ' + error.code + '\nsqlError.message: ' + error.message);
                self.refreshScroll();
            },
            function() {
                self.log('#log3', 'Transaction succeeded');
                self.refreshScroll();
            });
    },

    selectTXHandler: function(tx) {
        tx.executeSql($("#stmt2").val(), null, this.selectStmtSuccess, this.selectStmtError);
    },

    selectStmtSuccess: function(tx, results) {
        var row,
            l = results.rows.length;
        for (var i=0; i < l; i++) {
            var row = results.rows.item(i);
            str = "";
            for (var col in row) {
                str = str + col + ": " + row[col] + " ";
            }
            this.log("#log3", str);
        }
        this.refreshScroll();
    },

    refreshScroll: function() {
        if (this.rowScroll) {
            console.log('refresh rowScroll');
            this.rowScroll.refresh();
        } else {
            console.log('new rowScroll');
            this.rowScroll = new iScroll('rowWrapper', {hScrollbar: false, vScrollbar: false });
        }
    },

    selectStmtError: function(error) {
        this.log('#log3', 'Statement error' + error.message);
    },

    log: function(selector, msg) {
        $(selector).html($(selector).html() + msg + '<br/>');
    }

});