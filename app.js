var
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

    // Retrieve env variables
    var
        instagramClientId = process.env.INSTAGRAM_CLIENT_ID || false,
        instagramClientSecret = process.env.INSTAGRAM_CLIENT_SECRET || false,
        redisUrl = process.env.REDISTOGO_URL || false;

    // Load local credentials if necessary
    if (!process.env.NODE_ENV) {
        var creds = require('./creds.json');
        instagramClientId = creds.clientId;
        instagramClientSecret = creds.clientSecret;
    }

    // Check for the instagram client ID
    if (instagramClientId && instagramClientSecret) {
        // Create an Instagram client
        var client = ig.instagram();

        // Create Redis client
        var redisClient = false;
        if (redisUrl) {
            rtg = url.parse(redisUrl);
            redisClient = redis.createClient(rtg.port, rtg.hostname);
            redisClient.auth(rtg.auth.split(":")[1]);
        } else {
            redisClient = redis.createClient();
        }

        // Set client credentials
        client.use({
            client_id : instagramClientId,
            client_secret : instagramClientSecret
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
    } else {
        res.send('Missing Instagram client credentials.');
    }

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

// Listen for app
app.listen(process.env.PORT || 5000);