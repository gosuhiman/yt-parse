import {YtParser} from "./yt-parser";

const testVideos = {
  badger: 'EIyixC9NsLI',
  ngSharks360: 'rG4jSz_2HDY',
  ngLions360: 'sPyAQQklc1s',
  coaster360: '-xNN-bJQ4vI',
  fortMinor360: 'REAwGmv0Fuk',
  waymo360: 'B8R148hFxPw'
};

const ytParser = new YtParser({
  container: 'mp4'
});

ytParser.getMp4Url(testVideos.ngSharks360)
  .subscribe((url: string) => {
    console.log(url);
  });