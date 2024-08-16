import { Torrent } from "../defs/Torrent";


export const bytes_to_string = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Byte';

    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));

    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export const eta_to_string = (eta: number) => {
    if (eta === -1) return "∞";
    if (eta === 0) return "0s";

    const seconds = eta % 60;
    const minutes = Math.floor(eta / 60) % 60;
    const hours = Math.floor(eta / 3600) % 24;
    const days = Math.floor(eta / 86400);

    let result = "";
    if (days > 0) {
        result += `${days}d `;
    }

    if (hours > 0) {
        result += `${hours}h `;
    }

    if (minutes > 0) {
        result += `${minutes}m `;
    }

    if (seconds > 0) {
        result += `${seconds}s `;
    }

    return result;
}


export const get_progress_colour = (torrent: Torrent) => {
    if (torrent.fields.isStalled) return "#92261a";

    if (torrent.fields.percentDone === 1) {
        return "#1a4092";
    }

    return "#1a9226";
}