"use client";

import { useState } from "react";
import styles from "./home.module.css";

export function ReelVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const [playing, setPlaying] = useState(false);

  return <video
    className={playing ? styles.reelPlaying : undefined}
    controls
    playsInline
    preload="none"
    poster={poster}
    aria-label={label}
    onPlay={(event) => {
      const current = event.currentTarget;
      current.closest(`.${styles.reelsGrid}`)?.querySelectorAll("video").forEach((video) => {
        if (video !== current) video.pause();
      });
      setPlaying(true);
    }}
    onPause={() => setPlaying(false)}
    onEnded={() => setPlaying(false)}
  >
    <source src={src} type="video/mp4" />
    Your browser does not support video playback.
  </video>;
}
