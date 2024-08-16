import { useEffect, useState } from "react"
import { getToken } from "../utils/token"
import { useNavigate } from "react-router-dom";
import { Torrent } from "../defs/Torrent";
import api from "../utils/api";
import { bytes_to_string, eta_to_string, get_progress_colour } from "../utils/bytes";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookie, faDownload, faFilm, faHardDrive, faPause, faPlay, faSeedling, faTape, faTimes, faTv } from "@fortawesome/free-solid-svg-icons";
import { Input } from "../comps/Input";
import { Button } from "../comps/Button";
import { SearchResult } from "../defs/SearchResult";
import { SyncLoader } from "react-spinners";

export const HomePage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [search_loading, setSearchLoading] = useState(false);
    const [search_results, setSearchResults] = useState<SearchResult[]>([]);
    const [torrents, setTorrents] = useState<Torrent[]>([]);

    const load_torrents = async () => {
        try {
            const res = await api.get("/trans/torrent");
            if (res.status !== 200) {
                throw new Error("Failed to load torrents.");
            }

            setTorrents(res.data);

            setTimeout(load_torrents, 10000);
        } catch (err) {
            console.log(err);
        }
    }

    const start_torrent = async (torrent: Torrent) => {
        if (torrent.fields.isStalled) {
            try {
                const res = await api.post(`/trans/torrent/start/${torrent.fields.hashString}`);
                if (res.status !== 200) {
                    throw new Error("Failed to start torrent.");
                }

                load_torrents();
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                const res = await api.post(`trans/torrent/stop/${torrent.fields.hashString}`);
                if (res.status !== 200) {
                    throw new Error("Failed to stop torrent.");
                }

                load_torrents();
            } catch (err) {
                console.log(err);
            }
        }
    }

    const remove_torrent = async (torrent: Torrent) => {
        // Create alert to confirm deletion
        if (!window.confirm("Are you sure you want to remove this torrent?")) {
            return;
        }

        try {
            const res = await api.delete(`trans/torrent/${torrent.fields.hashString}`);
            if (res.status !== 200) {
                throw new Error("Failed to remove torrent.");
            }

            load_torrents();
        } catch (err) {
            console.log(err);
        }
    }

    const run_query = async () => {
        try {
            setSearchLoading(true);
            const res = await api.get("/torrents/search", {
                params: {
                    query: search
                }
            });


            if (res.status !== 200) {
                throw new Error("Failed to search for torrents.");
            }

            setSearchResults(res.data);
        } catch (err) {
            console.log(err);
        }

        setSearchLoading(false);
    }


    const download = async (torrent: SearchResult, type: string) => {
        try {
            const res = await api.get("/torrents/magnet", {
                params: {
                    query: torrent.link
                }
            });

            if (res.status !== 200) {
                throw new Error("Failed to download torrent.");
            }

            const magnet_link = res.data;

            const res2 = await api.post('/trans/torrent', {
                magnet_link,
                type: type
            });

            if (res2.status !== 200) {
                throw new Error("Failed to add torrent.");
            }

            load_torrents();
            // Scroll too top
            window.scrollTo(0, 0);

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        // Check to see if token is in storage
        const token = getToken();
        console.log("Got the token: ", token)

        if (!token) {
            navigate("/login");
            return;
        }

        load_torrents();

    }, []);

    return (
        <div className="home-page">
                <div className="logout">
                    <a onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}>
                        Logout
                    </a>
                </div>
                <h1 style={{textAlign: "center", fontSize: "3rem", marginBottom: "5px"}}>
                    <FontAwesomeIcon icon={faCookie} />
                    {/* {" "}
                    cookie */}
                </h1>
            <div className="torrent-list-wrapper">
                <h3>Queue</h3>
            <div className="torrent-list">
                {torrents
                 .sort((a, b) => {
                    if (a.fields.isStalled && !b.fields.isStalled) return 1;
                    if (!a.fields.isStalled && b.fields.isStalled) return -1;
                    if (!a.fields.isStalled && !b.fields.isStalled) return b.fields.percentDone - a.fields.percentDone;
                    return 0;
                })
                .map((torrent, index) => (
                    <div key={index} className="torrent-item">
                        <div className="top-section">
                            <div className="title">{torrent.fields.name}</div>

                            <div className="top-section-right">
                                <ActionButton icon={faTimes} onClick={() => remove_torrent(torrent)}/>
                                <ActionButton icon={torrent.fields.isStalled ? faPlay : faPause} onClick={() => start_torrent(torrent)}/>
                            </div>
                        </div>
                        <div className="bottom-section">
                            <div>{bytes_to_string(torrent.fields.downloadedEver)} / {bytes_to_string(torrent.fields.totalSize)}</div>
                            <div className="bottom-section-right">
                                <div>ETA: {eta_to_string(torrent.fields.eta)}</div>
                                <div>Peers: {torrent.fields.peersConnected}</div>
                            </div>
                        </div>

                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${torrent.fields.percentDone * 100}%`, backgroundColor: get_progress_colour(torrent)
                        }}>

                        </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>

            <div className="add-torrent">
                <h3>Search</h3>
                <div className="add-torrent-search-bar">
                    <Input label="Query" type="text" value={search} setValue={setSearch} placeholder="Search for torrents" onEnter={run_query}/>
                    <Button onClick={run_query}>
                        Search
                    </Button>
                </div>

                <div className="search-results">
                    <div className="search-results-loader">
                    {search_loading && <SyncLoader color="#fff" size={10}/>}
                    </div>
                    {search_results.map((torrent: SearchResult, index) => (
                        <div key={index} className="search-result">
                            <div className="left">
                                <div className="title">{torrent.title}</div>
                                <div className="bottom">
                                    <div style={{color: "green"}}>
                                        <FontAwesomeIcon icon={faSeedling} />
                                        {" "}
                                        {torrent.seeds}
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faHardDrive} />
                                        {" "}
                                        {torrent.size}
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <ActionButton icon={faFilm} onClick={() => download(torrent, "movie")}/>
                                <ActionButton icon={faTv} onClick={() => download(torrent, "tv_show")}/>
                            </div>
                        </div>
                    ))}
                    </div>
            </div>

            <div className="footer">
                For cookie. From void.
            </div>
        </div>
    )
}

export interface ActionButtonProps {
    icon: IconDefinition;
    onClick: () => void;
}

export const ActionButton = (props: ActionButtonProps) => {
    return (
        <div className="action-button" onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} />
        </div>
    )
} 