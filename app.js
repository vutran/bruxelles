var
    creds = require('./creds.json'),
    express = require('express'),
    app = express(),
    jade = require('jade'),
    ig = require('instagram-node'),
    redis = require('redis'),
    url = require("url");

// Load Jade Engine
app.set('view engine', 'jade');

// Set static directory
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

    // Create an Instagram client
    var client = ig.instagram();

    // Create Redis client
    var redisClient = false;
    if (process.env.REDISTOGO_URL) {
        rtg = url.parse(process.env.REDISTOGO_URL);
        redisClient = redis.createClient(rtg.port, rtg.hostname);
        redisClient.auth(rtg.auth.split(":")[1]);
    } else {
        redisClient = redis.createClient();
    }

    // Set client credentials
    client.use({
        client_id : creds.clientId,
        client_secret : creds.clientSecret
    });

    // Retrieve recent media (cached)
    redisClient.get('recently_tagged_media', function(err, cachedResults) {
        if (cachedResults) {
            // Render the app
            renderApp(res, JSON.parse(cachedResults));
        } else {
            client.tag_media_recent('bruxelles', function(error, apiResults, limit) {
                redisClient.set('recently_tagged_media', JSON.stringify(apiResults));
                // Render the app
                renderApp(res, apiResults);
            });
        }
    });

});

/**
 * Renders the application
 *
 * @access public
 * @param object res
 * @param object mediaResults
 */
var renderApp = function(res, mediaResults)
{
    res.render('index', {mediaResults: mediaResults});
};

// Set the listen port
var listenPort = process.env.PORT ? process.env.PORT : 3000;

// Listen for app
app.listen(listenPort);