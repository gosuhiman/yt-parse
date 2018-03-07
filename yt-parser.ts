import {YtParserConfig} from "./yt-parser-config";
import * as _ from "lodash";
import * as request from "request";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {URLSearchParams} from "url";
import {YtVideoFileData} from "./yt-video-file-data";

const YOUTUBE_ID_LENGTH: number = 11;

export class YtParser {

  private _config: YtParserConfig = {};
  private _youtubeIdRegexp: RegExp;
  private _requestAsObservable: any;

  constructor(config: YtParserConfig) {
    _.merge(this._config, config);
    this._youtubeIdRegexp = new RegExp('^[A-Za-z0-9_-]{' + YOUTUBE_ID_LENGTH + '}$');
    this._requestAsObservable = Observable.bindNodeCallback(request, (response, body) => body);
  }

  getMp4Url(videoId: string): Observable<string> {
    if (!this.isYoutubeVideoId(videoId)) return Observable.throw(new Error('Invalid youtubeId'));
    return this.getVideoInfo(videoId)
      .map((videoInfo: URLSearchParams) => {
        const videoFileDatas: YtVideoFileData[] = this._mapAdaptiveFormatsToVideoFileData(videoInfo.get('url_encoded_fmt_stream_map'));
        const videoFileDatasMp4Only: YtVideoFileData[] = _.filter(videoFileDatas, {'mimeType': 'video/mp4'});
        if (videoFileDatasMp4Only.length == 0) throw new Error('There is no mp4 stream for this video');
        return videoFileDatas[0].url;
      });
  }

  getVideoInfo(videoId: string) {
    if (!this.isYoutubeVideoId(videoId)) return Observable.throw(new Error('Invalid youtubeId'));
    const url: string = `http://www.youtube.com/get_video_info?&video_id=${videoId}&asv=3&el=detailpage&hl=en_US`;
    return this._requestAsObservable(url)
      .map((body: string) => {
        return new URLSearchParams(body);
      });
  }

  isYoutubeVideoId(videoId: string): boolean {
    if (!videoId) return false;
    return this._youtubeIdRegexp.test(videoId);
  }

  private _mapAdaptiveFormatsToVideoFileData(adaptiveFormats: string): YtVideoFileData[] {
    const data: YtVideoFileData[] = [];
    const formats: string[] = adaptiveFormats.split(',');
    formats.forEach((formatString: string) => {
      const formatData: URLSearchParams = new URLSearchParams(formatString);
      const videoFileData: YtVideoFileData = new YtVideoFileData();
      videoFileData.type = formatData.get('type');
      videoFileData.itag = +formatData.get('itag');
      videoFileData.quality = formatData.get('quality');
      videoFileData.url = formatData.get('url');
      const parsedType: string[] = videoFileData.type.split('; ');
      if (parsedType.length > 0) {
        videoFileData.mimeType = parsedType[0];
      }
      data.push(videoFileData);
    });
    return data;
  }

}