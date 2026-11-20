import type WebSocket from 'ws';

export const debugTypeArray = ['error', 'warn', 'info', 'debug', 'trace'] as const;

export type debugType = typeof debugTypeArray[number];

export const DATABASE_NAME = "ktv_room" as const;
export const REQUEST_ID_NAMESPACE = "ktv_rid" as const;
export const SEARCH_CACHE_NAMESPACE = "bilibili_search_cache" as const;
export const SEARCH_CLICK_NAMESPACE = "bilibili_search_click" as const;
export const SEARCH_CATALOG_NAMESPACE = "bilibili_search_catalog" as const;

export type IdentifiedWebSocket = WebSocket & {
    clientId: string;
};

export const enum WsReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}



export interface SongLists {
    queued: Song[],
    singing: Song | null,
    sung: Song[],
    createdAt?: number,
    updatedAt?: number,
    /** 房间存档身份（持久维度）；live 维度仍以 roomId 为指针 */
    uuid?: string
}

export interface Song {
    id: string
    title: string
    url: string
    addedBy?: string
}

export interface AddSongBody {
    song: Song;
}

export interface SongOperationBody {
    idArrayHash: string;
    song: Song;
    toIndex: number;
}

export type SongPatch = Partial<Pick<Song, 'title' | 'url'>>;

interface OpLogBase {
    baseIdArray: string[]   // 操作前服务端待唱队列 ID
    baseHash: string        // 操作前服务端歌单 hash
    timestamp: number
}

export interface QueueOpLog extends OpLogBase {
    type: 'queue'
    song: Song
    toIndex: number
}

// 歌曲编辑日志：让旧 hash 请求仍能匹配到编辑前的歌单，重放时只更新队列内对应歌曲的标题或链接，不改顺序
export interface SongEditLog extends OpLogBase {
    type: 'editSong'
    songId: string
    patch: SongPatch
}

export type OpLog = QueueOpLog | SongEditLog;

export interface BilibiliVideoPart {
    page: number
    part: string
}

export interface BilibiliSearchVideo {
    bvid: string
    title: string
    pic: string
    picProxy?: string
    author?: string
    tags: string[]
    rawTags?: string[]
    instrumentalWarning?: boolean
    parts: BilibiliVideoPart[]
}
