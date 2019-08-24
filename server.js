const express = require("express"),
  bodyParser = require("body-parser"),
  Spotify = require("node-spotify-api"),
  keys = require("./keys.js"),
  spotify = new Spotify(keys.spotify),
  Twilio = require("twilio"),
  twiml = new Twilio.twiml.MessagingResponse(),
  request = require("request"),
  rp = require("request-promise");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sms", function(req, res) {
  searchParams = {
    type: "track",
    query: req.body.Body,
    limit: 2
  };
  let spotifyURL = spotify.search(searchParams);

  rp(spotifyURL)
    .then(function(res) {
      let tracks = res.tracks.items;
      tracks.forEach(track => {
        var artists = track.album.artists;
        artists.forEach(artist => {
          twiml.message(artist.name);
          console.log(artist.name);
        });
      });
    })
    .catch(function(err) {
      console.log(err);
    });

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(1337, function() {
  console.log("Express server listening on port 1337");
});

// BQByPI1MiE1kH6KexdqthaRpoooiWeSQSEbiav6ie8N0RPEemzujcevSfBvABNGSduKZ2oMmc1-pgDfUwpgePAhZ9NsAAqy3RkpKnjiiwTkSAx7hPJ6fkWW-LSY4suLz3ueNY6sKJwGygngZByOAQhLXieNhBh7joK3DnwPon0PFncr9ruNvYm8VZA
