import { AnimeInfo } from "../types/anime-info";
import { EpisodeInfo } from "../types/episode-info";
import { PlayerInfo } from "../types/player-info";
import { SearchResult } from "../types/search-result";

export default class GogoParser {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    getAnimeInfo(animeInfoPageDocument: HTMLDocument): AnimeInfo {
        let infoElement = animeInfoPageDocument.querySelector(".anime_info_body_bg") as HTMLDivElement;
        let epRange = animeInfoPageDocument
            .getElementById("episode_page")
            ?.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>;

        const url = animeInfoPageDocument.querySelector('[rel="canonical"]')?.getAttribute("href");

        return {
            id: +(animeInfoPageDocument.querySelector("#movie_id")?.getAttribute("value") as any),
            url: url,
            linkName: url?.split("/")[url?.split("/").length - 1],
            coverImg: (infoElement.children[0] as HTMLImageElement)?.src,
            name: (infoElement.children[1] as HTMLHeadElement)?.innerHTML?.replace(" (Dub)", ""),
            summary: (infoElement.children[4] as HTMLParagraphElement)?.childNodes[1]?.textContent,
            genres: Array.from(infoElement.children[5].querySelectorAll("a"))?.map((x) => x?.title),
            released: (infoElement.children[6] as any)?.childNodes[1]?.textContent,
            start: +epRange[0].innerHTML?.split("-")[0] ?? 0,
            end: +epRange[epRange.length - 1]?.innerHTML?.split("-")[1] ?? 0,
            type: (infoElement.children[1] as HTMLHeadElement)?.innerHTML?.includes(" (Dub)") ? "dub" : "sub",
        } as AnimeInfo;
    }

    getEpisodeListing(animeInfoPageDocument: HTMLDocument): Array<EpisodeInfo> {
        return Array.from(animeInfoPageDocument.querySelectorAll("li"))
            .map((ep) => ({
                number: +(ep.children[0].children[0] as any)?.childNodes[1]?.textContent?.split(" ")[1],
                url: (this.baseUrl + ep.children[0]?.getAttribute("href")?.trim()) as string,
            }))
            .reverse();
    }

    getEpisodePlayers(playerPageDocument: HTMLDocument): Array<PlayerInfo> {
        return Array.from(playerPageDocument.getElementsByClassName("anime_muti_link")[0].children[0].children).map(
            (li) => ({
                url: li.children[0].getAttribute("data-video") as string,
                name: li.children[0].childNodes[li.children[0].childNodes[1].nodeType == 3 ? 1 : 2]
                    ?.textContent as string,
            })
        );
    }

    getSearchResults(searchPageDocument: HTMLDocument): Array<SearchResult> {
        if (!searchPageDocument.querySelector(".items li")) return [];

        return Array.from(searchPageDocument.getElementsByClassName("items")[0].children).map((li) => ({
            url: (this.baseUrl + li.children[1].children[0]?.getAttribute("href")) as string,
            name: li.children[1].children[0]?.innerHTML?.replace(" (Dub)", "") as string,
            img: li.children[0].children[0].children[0]?.getAttribute("src") as string,
            released: +li.children[2]?.innerHTML?.replace(/\s/g, "").split(":")[1],
            type: li.children[1].children[0]?.innerHTML?.includes(" (Dub)") ? "dub" : "sub",
            linkName: li.children[1].children[0]?.getAttribute("href")?.split("/")[
                (li.children[1].children[0]?.getAttribute("href")?.split("/").length as number) - 1
            ] as string,
        }));
    }

    getAnimesList(animeListPageDocument: HTMLDocument): Array<string> {
        return Array.from(animeListPageDocument.getElementsByClassName("anime_list_body")[0].children[0].children).map(
            (li) => li.children[0]?.getAttribute("href") as string
        );
    }

    getAnimesPagesCount(animeListPageDocument: HTMLDocument): number {
        return +animeListPageDocument.getElementsByClassName("pagination-list")[0]?.children.length ?? 1;
    }
}
