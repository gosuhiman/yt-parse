import {YtParserConfig} from "./yt-parser-config";
import * as _ from "lodash";
import * as request from "request";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {URLSearchParams} from "url";

export class YtParser {

  private _config: YtParserConfig = {};

  private _requestAsObservable: any;

  constructor(config: YtParserConfig) {
    _.merge(this._config, config);
    this._requestAsObservable = Observable.bindNodeCallback(request, (response, body) => body);
  }

  getMp4Url(videoId: string): Observable<string> {
    return this.getVideoInfo(videoId)
      .map((videoInfo: URLSearchParams) => {
        const adaptiveFormats: URLSearchParams = new URLSearchParams(videoInfo.get('url_encoded_fmt_stream_map'));
        return adaptiveFormats.get('url');
      });
  }

  getVideoInfo(videoId: string) {
    const url: string = `http://www.youtube.com/get_video_info?&video_id=${videoId}&asv=3&el=detailpage&hl=en_US`;
    return this._requestAsObservable(url)
      .map((body: string) => {
        return new URLSearchParams(body);
      });
  }

}