var app = angular.module('app-skilift', []);
var refreshLifts;
var updateLifts;

app.controller('Skilifts', function($scope, $http) {
    $scope.refreshLifts = function() {
        $http.get("http://localhost/ski-status/db.php").then(function(response) {
            angular.forEach(response.data, function(value, key) {
                if(value.status == 1) {
                    value.badgeclass = "success";
                    value.statustext = "works";
                } else if(value.status == 0) {
                    value.badgeclass = "danger";
                    value.statustext = "not working";
                } else {
                    value.badgeclass = "secondary";
                    value.statustext = "unknown";
                }
            });
        $scope.lifts = response.data;});
    }
    refreshLifts = $scope.refreshLifts;
    refreshLifts();

    $scope.updateLifts = function (lifts) {
        $http.put('http://localhost/ski-status/db.php', lifts).then(function(success) {
            // Toggle status
            if($('.update-btn').attr('status') == 1) {
                $(this).removeClass("badge-success");
                $(this).addClass("badge-danger");
                $(this).text("not working");
            } else if($('.update-btn').attr('status') == 0) {
                $(this).removeClass("badge-danger");
                $(this).addClass("badge-secondary");
                $(this).text("unknown");
            } else if($('.update-btn').attr('status') == 2) {
                $(this).removeClass("badge-secondary");
                $(this).addClass("badge-success");
                $(this).text("works");
            }
            refreshLifts();
        }, function(error) {
            if(error.status == 403) {
                alert('Wrong magic word!');
            }
        });
    };
    updateLifts = $scope.updateLifts;
});

// Get the magic word from query string
if($('.main').hasClass('update')) {
    var magicword = CryptoJS.MD5(getParameterByName('secret')).toString();
}

// Update status on click
$(document).on("click", ".update-btn", function() {
    // Toggle status
    if($(this).attr('status') == 1) {
        $(this).attr('status', 0);
    } else if($(this).attr('status') == 0) {
        $(this).attr('status', 2);
    } else {
        $(this).attr('status', 1);
    }
    var data = { id: $(this).attr('id'), status: $(this).attr('status'), secret: magicword};
    // Update db status
    updateLifts(data);
});

// Auto refresh status on homepage
if($('.main').hasClass('home')) {
    setInterval(function() {
        refreshLifts();
    }, 1000);
}

// Query string parameter JS
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}