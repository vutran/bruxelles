I developed this little app for a friend.

Just a simple NodeJS pulling in Instagram photos that are tagged as *bruxelles*.

**Demo:** [http://bruxelles.herokuapp.com/](http://bruxelles.herokuapp.com/)

# Requirements

- Node
- Express
- Jade
- RedisToGo

# Local Environment

For local development, create a `creds.json` in the project root.

## Sample `creds.json`

    {
        "clientId" : "YOUR_INSTAGRAM_CLIENT_ID",
        "clientSecret" : "YOUR_INSTAGRAM_CLIENT_SECRET"
    }

# Environmental Variables

`process.env.INSTAGRAM_CLIENT_ID`

Your Instagram API client ID.

`process.env.INSTAGRAM_CLIENT_SECRET`

Your Instagram API client secret.

`process.env.REDISTOGO_URL`

Your RedisToGo url (this is available by default when setting up RedisToGo via Heroku).