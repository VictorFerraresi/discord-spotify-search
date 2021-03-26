export interface SearchResults {
    tracks: Tracks
}

interface Tracks {
    items: Track[]
}

interface Track {
    external_urls: ExternalUrls
}

interface ExternalUrls {
    spotify: string
}