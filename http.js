const express = require("express");
const app = express();
const fs = require("fs");
const audioDetailsData = require("./data");

const port = 3000;

app.get("/api/v1/audio", (req, res) => {
  res.send(audioDetailsData);
});

app.get("/api/v1/audio/:id", (req, res) => {
  const id = req.params.id;
  const [selectedAudioFile] = audioDetailsData.filter((path) => {
    return path.id === +id;
  });
  // res.send(selectedAudioFile[0].src);
  const audioPath = selectedAudioFile?.src;

  if (!audioPath) {
    return res
      .status(404)
      .send(
        "<h1>Article not found</h1><button><a href='/api/v1/audio/1'>Back to the audio list</a></button>",
      );
  }

  const stat = fs.statSync(audioPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(audioPath).pipe(res);
  }
});

app.listen(port, console.log(`server is listening on port: ${port}`));
