angular.module("main.controller", ["LocalStorageModule", "Constants"])
    .controller("mainCtrl",
    ["$scope", "$interval", "$timeout",
        "LocalStorageFields", "AppStatusValues",
        "localStorageService", 
        function ($scope, $interval, $timeout,
            LocalStorageFields, AppStatusValues,
            localStorageService) {

            var interval;
            var intervalValue = 41;

            $scope.momentDuration = moment.duration();

            $scope.$watchCollection(function () {
                return localStorageService.get(LocalStorageFields.SIMPLE_ITEMS);
            }, function (newVal) {
                $scope.items = _.map(newVal, function (val) {
                    return { value: val };
                });
            });

            $scope.$watch(function () {
                return localStorageService.get(LocalStorageFields.STATUS);
            }, function (newValue) {
                switch (newValue) {
                    case AppStatusValues.STARTED:
                        if (interval) {
                            return;
                        }
                        var current = moment();
                        var startDate = moment(localStorageService.get(LocalStorageFields.START_DATE));

                        var offset = localStorageService.get(LocalStorageFields.INTERVAL_OFFSET);

                        $scope.momentDuration = moment.duration(offset + current.diff(startDate));

                        interval = $interval(function () {
                            var current = moment();
                            $scope.momentDuration = moment.duration(offset + current.diff(startDate));
                            if ($scope.momentDuration.asMinutes() > 99.999) {
                                $scope.momentDuration.subtract(99 + 99 * 60, "seconds");
                            }
                        }, intervalValue);

                        $scope.isCounting = true;
                        break;
                    case AppStatusValues.STOPPED:
                        var offset = localStorageService.get(LocalStorageFields.INTERVAL_OFFSET);
                        $scope.momentDuration = moment.duration(offset);
                        $interval.cancel(interval);
                        interval = null;
                        $scope.isCounting = false;
                        break;
                    default:
                }
            });

            $scope.start = function () {
                localStorageService.set(LocalStorageFields.START_DATE, new Date());
                localStorageService.set(LocalStorageFields.STATUS, AppStatusValues.STARTED)
            };

            $scope.stop = function () {
                var startDate = moment(localStorageService.get(LocalStorageFields.START_DATE));
                var current = moment();
                var offset = localStorageService.get(LocalStorageFields.INTERVAL_OFFSET);

                var data = offset + current.diff(startDate);
                localStorageService.set(LocalStorageFields.INTERVAL_OFFSET, data);
                localStorageService.set(LocalStorageFields.STATUS, AppStatusValues.STOPPED);
            };

            $scope.addRecord = function () {
                var duration = $scope.momentDuration.asMilliseconds()
                var simpleItems = localStorageService.get(LocalStorageFields.SIMPLE_ITEMS) || [];

                var lastItem = _.last(simpleItems);
                if (lastItem && lastItem === duration) {
                    return;
                }

                simpleItems.push(duration);
                localStorageService.set(LocalStorageFields.SIMPLE_ITEMS, simpleItems);
            };

            $scope.removeRecord = function (record) {
                var simpleItems = localStorageService.get(LocalStorageFields.SIMPLE_ITEMS) || [];

                var index = simpleItems.indexOf(record.value);
                if (index != -1) {
                    simpleItems.splice(index, 1);
                    localStorageService.set(LocalStorageFields.SIMPLE_ITEMS, simpleItems);
                }
                else {
                    console.log("No item to remove.");
                }
            };

            $scope.clear = function () {
                $scope.momentDuration = moment.duration();
                localStorageService.set(LocalStorageFields.SIMPLE_ITEMS, []);
                localStorageService.set(LocalStorageFields.INTERVAL_OFFSET, 0);
                localStorageService.set(LocalStorageFields.STATUS, AppStatusValues.STOPPED);
            };

            $timeout(function () {
                $scope.isLoaded = true;
            },0)
        }]);