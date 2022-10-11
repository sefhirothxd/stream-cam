const express = require("express");
const app = express();
// const cors = require("cors");
//.env
require("dotenv").config();
const port = process.env.PORT || 3000;
const user = process.env.CAM_USER;
const pass = process.env.CAM_PASSWORD;
const ip = process.env.CAM_IP;

const { proxy, scriptUrl } = require("rtsp-relay")(app);
// app.use(cors);
const handler = proxy({
  url: `rtsp://${user}:${pass}@${ip}:554/Streaming/Channels/1`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws("/api/stream", handler);

// this is an example html page to view the stream
app.get("/", (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`)
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
