import GogoHttp from "../http/gogo-http";
import GogoParser from "../parsers/gogo-parser";
import SearchResult from "../classes/search-result";

export default class Gogo {
  baseUrl: string;
  http: GogoHttp;
  parser: GogoParser;

  constructor(baseUrl: string, useCors = false) {
    this.baseUrl = baseUrl;
    this.http = new GogoHttp(baseUrl, useCors);
    this.parser = new GogoParser(baseUrl);
  }

  public async searchAnime(query: string): Promise<SearchResult[]> {
    const searchPage = await this.http.getSearchPage(query);
    return searchPage.document && this.parser.getSearchResults(searchPage.document).map(result => new SearchResult(this, result));
  }
}