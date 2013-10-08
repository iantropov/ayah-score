var https = require('https');
var querystring = require('querystring');

var requestOptions = {
  host: 'ws.areyouahuman.com',
  path: '/ws/scoreGame',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

module.exports = function (scoringKey, sessionSecret, callback) {
    var data = querystring.stringify({session_secret: encodeURI(sessionSecret), scoring_key: scoringKey});
    https.request(requestOptions, function (response) {
        if (response.statusCode !== 200) {
            return callback(new Error("the server returned status code " + response.statusCode), null);
        }
        var dataBuffer = '';
        response.on('data', function (data) {
            dataBuffer += data;
        });
        response.on('error', function (error) {
            callback(error, null);
        });
        response.on('end', function () {
            dataBuffer = JSON.parse(dataBuffer);
            if (dataBuffer.status_code !== 1) {
                return callback(new Error("the server sent an error response: " + dataBuffer.status_code), null);
            }
            callback(null, dataBuffer);
        });
    }).on('error', function (error) {
        return callback(error, null);
    }).end(data);
};