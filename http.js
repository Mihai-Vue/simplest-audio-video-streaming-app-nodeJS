const { createServer } = require("http");
const { stat, createReadStream } = require("fs");
const { promisify } = require("util");
const filename = "./audio-files/audio_1.m4a"; // any audio/video file mp4 format
const audioInfo = promisify(stat);

createServer(async (req, res) => {
  //hadle the file size
  const { size } = await audioInfo(filename);

  //handle the range
  const range = req.headers.range;
  // console.log("range: ", range);
  // = range:  bytes=0-1 ;
  // required by Safary/etc ;
  if (range) {
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    // end = can/can't be a number
    end = end ? parseInt(end, 10) : size - 1;

    res.writeHead(206 /* partial content */, {
      "Content-range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Lenght": start - end + 1,
      "Content-Type": "video/mp4",
    });
    createReadStream(filename, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "video/mp4",
    });
    createReadStream(filename).pipe(res);
  }
}).listen(5050, () => console.log("server is running on server 5050...."));
