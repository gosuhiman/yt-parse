import {YtParser} from "./yt-parser";

const videoId: string = 'EIyixC9NsLI';
const ytParser = new YtParser({
  container: 'mp4'
});

ytParser.getMp4Url(videoId)
  .subscribe((url: string) => {
    console.log(url);
  });