angular.module("filters", [])
    .filter("toTime", function () {
        return function (value) {
            var md = moment.duration(value);
            var ms = (md.milliseconds() / 10).toFixed(0);
            ms = ms < 10 ? "0" + ms : ms;
            return md.format("mm:ss.", { trim: false}) + ms;
        };

    })
    .filter("toTimeBlinking", function () {
        return function (md) {
            var ms = (md.milliseconds() / 10).toFixed(0);
            var format = ms > 50 ? "mm:ss." : "mm ss ";
            ms = ms < 10 ? "0" + ms : ms;
            return md.format(format, { trim: false}) + ms;
        };
    });
