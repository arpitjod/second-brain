import { useEffect, useRef } from "react";
import {ShareIcon} from "../icons/ShareIcon"

interface CardProps{
    title:string;
    link:string;
    type:"twitter"|"youtube";
}

export function Card({title,link,type}: CardProps){
    const containerRef = useRef<HTMLDivElement>(null);
    const tweetMountRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef<boolean>(false);
    const extractTweetId = (url: string): string | undefined => {
        if (!url) return undefined;
        try {
            const u = new URL(url);
            // Accept twitter.com or x.com
            if (!/(^|\.)twitter\.com$/.test(u.hostname) && !/(^|\.)x\.com$/.test(u.hostname)) {
                return undefined;
            }
            const m = u.pathname.match(/\/status\/(\d+)/);
            return m?.[1];
        } catch {
            return undefined;
        }
    };
    const toYouTubeEmbed = (url: string): string => {
        try {
            const u = new URL(url);
            if (u.hostname.includes("youtu.be")) {
                const id = u.pathname.replace(/^\//, "");
                return `https://www.youtube.com/embed/${id}`;
            }
            if (u.hostname.includes("youtube.com")) {
                const id = u.searchParams.get("v");
                if (id) return `https://www.youtube.com/embed/${id}`;
                const m = u.pathname.match(/\/embed\/([\w-]+)/);
                if (m?.[1]) return `https://www.youtube.com/embed/${m[1]}`;
            }
        } catch {}
        return url;
    };
    useEffect(() => {
        const w = window as any;
        // reset for new type/link to avoid duplicate renders
        if (tweetMountRef.current) tweetMountRef.current.innerHTML = "";
        initializedRef.current = false;
        const load = () => {
            if (type !== "twitter") return;
            if (w.twttr && w.twttr.widgets && tweetMountRef.current) {
              if (initializedRef.current) return; // guard against duplicate calls (e.g., StrictMode)
              const id = extractTweetId(link || "");
              if (!id) {
                  console.warn("Card/twitter: Could not extract tweet id from link", link);
                  return;
              }
              tweetMountRef.current.innerHTML = "";
              initializedRef.current = true;
              const res = w.twttr.widgets.createTweet(id, tweetMountRef.current, { align: "center" });
              if (res && typeof res.then === "function") {
                  res.catch((err: any) => console.error("Card/twitter: createTweet failed", err));
              }
            }
        };
        if (!w.twttr) {
            const s = document.createElement("script");
            s.async = true;
            s.src = "https://platform.twitter.com/widgets.js";
            s.onload = load;
            document.body.appendChild(s);
        } else {
            load();
        }
    }, [type, link]);
    return <div ref={containerRef} className="p-3 bg-white rounded-md shadow-lg outline-slate-100 max-w-72">
        <div className="flex justify-between ">
            <div className="flex items-center justify-between gap-x-2">
                <div className="flex items-center">
                    <ShareIcon/>
                </div>
                    PROJECT IDEAS
            </div>
            <div className="flex gap-x-1">
                <div className="pr-2 text-gray-500">
                    <a href={link}target="_blank">
                        <ShareIcon/>
                    </a>
                </div>
                <div className="pr-2 text-gray-500">
                    <ShareIcon/>
                </div>
            </div>
        </div>
        <div className="pt-8 ">
            {type==="youtube" && (
                <div className="w-full aspect-video overflow-hidden rounded-md">
                    <iframe className="w-full h-full"
                        src={toYouTubeEmbed(link)}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
        {type==="twitter" && (
            <div ref={tweetMountRef} />
        )}
    </div>
}