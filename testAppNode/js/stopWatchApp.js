angular.module("stopwatchApp", ["main.controller", "filters"])
    .config(["localStorageServiceProvider", function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix("stopwatchApp")
            .setStorageType("localStorage");

    }]);
    
   