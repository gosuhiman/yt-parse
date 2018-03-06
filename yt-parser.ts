import {YtParserConfig} from "./yt-parser-config";
import * as _ from "lodash";
import * as request from "request";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {URL, URLSearchParams} from "url";

export class YtParser {

  private _config: YtParserConfig = {};

  private _requestAsObservable: any;

  constructor(config: YtParserConfig) {
    _.merge(this._config, config);

    this._requestAsObservable = Observable.bindNodeCallback(request, (response, body) => body);
  }

  getMp4Url(videoId: string): Observable<string> {
    return this.getVideoInfo(videoId)
      .do((videoInfo: URLSearchParams) => {
        const adaptiveFormats: URLSearchParams = new URLSearchParams(videoInfo.get('adaptive_fmts'));
        console.log(adaptiveFormats);
        const url: URL = new URL(adaptiveFormats.get('url'));
        console.log(url.searchParams);

        let test: string = 'https://redirector.googlevideo.com/videoplayback?pl=50&id=o-AIkn2g-Qq_DD_8NmN0owjhNfuUC1NitpXe6meCUEGDaR&mime=video%2Fmp4&fvip=2&ms=au%2Conr&mm=31%2C26&mv=m&mt=1520354640&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mn=sn-ab5szn7r%2Csn-p5qlsndz&ip=2001%3A19f0%3A5%3A1de%3A5400%3Aff%3Afe4f%3A2207&key=yt6&gir=yes&ipbits=0&ratebypass=yes&lmt=1417062923998890&c=WEB&dur=73.305&clen=4320851&initcwndbps=398750&source=youtube&expire=1520376348&itag=18&requiressl=yes&signature=910AD6837D0189922758B2877AF1010F98F39AAD.E1C45FDB73797051796380719338C7841D3FCE32&ei=vMWeWofvAdODhgar8bDIAQ';

        const testUrl: URL = new URL(test);
        console.log(testUrl.searchParams);

      })
      .map(() => {
        return 'ok';
      });
  }

  getVideoInfo(videoId: string) {
    const url: string = `http://www.youtube.com/get_video_info?&video_id=${videoId}&asv=3&el=detailpage&hl=en_US`;
    return this._requestAsObservable(url)
      .map((body: string) => {
        return new URLSearchParams(body);
      });
  }

  //https://r2---sn-f5f7lne7.googlevideo.com/videoplayback?pl=22&id=o-AIkn2g-Qq_DD_8NmN0owjhNfuUC1NitpXe6meCUEGDaR&mime=video%2Fmp4&fvip=2&sparams=clen,dur,ei,expire,gir,id,initcwndbps,ip,ipbits,itag,lmt,mime,mip,mm,mn,ms,mv,pl,ratebypass,requiressl,source&ip=2001%3A19f0%3A5%3A1de%3A5400%3Aff%3Afe4f%3A2207&key=cms1&gir=yes&ipbits=0&ratebypass=yes&lmt=1417062923998890&c=WEB&dur=73.305&clen=4320851&source=youtube&expire=1520376348&itag=18&requiressl=yes&signature=2FBF5BE69274B8EC37963652120794301531812F.503AD34C92020E30DF6A23D3C95EA06C826FE019&ei=vMWeWofvAdODhgar8bDIAQ&cms_redirect=yes&mip=185.53.124.254&mm=31&mn=sn-f5f7lne7&ms=au&mt=1520357038&mv=m

}