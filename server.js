const express = require("express"),
  bodyParser = require("body-parser"),
  Spotify = require("node-spotify-api"),
  keys = require("./keys.js"),
  spotify = new Spotify(keys.spotify);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sms", function(req, res) {
  searchParams = {
    type: "track",
    query: req.body.Body,
    limit: 2
  };
  const Twilio = require("twilio");
  let twiml = new Twilio.twiml.MessagingResponse();

  spotify.search(searchParams).then(res => {
    let tracks = res.tracks.items;
    tracks.forEach(track => {
      var artists = track.album.artists;
      artists.forEach(artist => {
        twiml.message(artist.name);
        console.log(artist.name);
      });
    });
  });

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(1337, function() {
  console.log("Express server listening on port 1337");
});
