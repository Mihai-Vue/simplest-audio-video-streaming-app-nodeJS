const express = require("express");
const app = express();
const audio = require("./routes/audio");

const port = 3000;

app.use("/api/v1/audio", audio);

app.listen(port, console.log(`server is listening on port: ${port}`));
