export interface Torrent {
    fields: {
        hashString: string;
        name: string;
        addedDate: number;
        downloadDir: string;
        eta: number;
        isFinished: boolean;
        isStalled: boolean;
        leftUntilDone: number;
        peersConnected: number;
        percentDone: number;
        totalSize: number;
        downloadedEver: number;
    }
}3