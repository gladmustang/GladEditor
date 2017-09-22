var self = {
    extname: 'html',
    layoutsDir: 'views/layouts',
    //defaultLayout: 'main',
    defaultLayout: process.env.LAYOUT,
    partialsDir: "views/partials/",
    helpers: {
        'ifCond': function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        'toJSON': function (object) {
            return JSON.stringify(object);
        },
        'formatDate': function (date) {
            var date = new Date(date);
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        },
        'formatDateYearFirst': function (date) {
            var date = new Date(date);
            var year = date.getFullYear();
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return year + '-' + month + '-' + day;
        },
        'formatCurrency': function (data) {
            if (data != null) {
                return "$" + data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            } else {
                return data
            }
        }
    }
}
module.exports = self;
