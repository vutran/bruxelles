var
    creds = require('./creds.json'),
    express = require('express'),
    app = express(),
    jade = require('jade'),
    ig = require('instagram-node'),
    redis = require('redis'),
    redisClient = redis.createClient();

// Load Jade Engine
app.set('view engine', 'jade');

// Set static directory
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

    var client = ig.instagram();

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

app.listen(3000);