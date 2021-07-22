import fetch from 'node-fetch';
import { JSDOM } from 'jsdom'
import { RequestReturn } from '../types/request-return';

export default class GogoHttp {
  private baseUrl: string;

  constructor(baseUrl = 'https://gogoanime.pe') {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  fetchPage(url: string): Promise<RequestReturn> {
    return fetch(url)
      .then(res => res.text())
      .then(html => ({
        document: new JSDOM(html).window.document,
        url: url
      } as RequestReturn))
  }

  getAnimeInfoPage(name: string): Promise<RequestReturn> {
    return this.fetchPage(`${this.baseUrl}/category/${name.toLowerCase().replace(/\s/g, '-')}`)
  }

  getEpisodeList(start: number, end: number, id: number): Promise<RequestReturn> {
    return this.fetchPage(`https://ajax.gogo-load.com/ajax/load-list-episode?ep_start=${start}&ep_end=${end}&id=${id}`)
  }

  getSearchPage(filter: string): Promise<RequestReturn> {
    return this.fetchPage(`${this.baseUrl}/search.html?keyword=${filter}`)
  }

}