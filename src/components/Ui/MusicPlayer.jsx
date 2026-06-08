         import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_MUSIC_BG = "#0B2B40";
const DEFAULT_SOUND_BG = "#00B4D8";
const DEFAULT_MUSIC_ICON_COLOR = "#47C0FC";   // blue for music note (paused)
const PLAYING_ICON_COLOR = "#FFFFFF";         // white for sound icon (playing)

const MusicSoundToggle = ({
  audioUrl,
  size = "w-12 h-12",
  musicBgColor: customMusicBg,
  soundBgColor: customSoundBg,
  iconColor: customIconColor,   // optional override for music icon only
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const musicBg = customMusicBg || DEFAULT_MUSIC_BG;
  const soundBg = customSoundBg || DEFAULT_SOUND_BG;
  const musicIconColor = customIconColor || DEFAULT_MUSIC_ICON_COLOR;

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.warn("Playback error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // Auto‑play logic (unchanged)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;
    audio.src = audioUrl;
    audio.load();
    const autoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Auto‑play blocked by browser:", err);
        setIsPlaying(false);
      }
    };
    if (audio.readyState >= 2) {
      autoPlay();
    } else {
      audio.addEventListener('canplaythrough', autoPlay, { once: true });
    }
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        audio.load();
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  const currentBackground = isPlaying ? soundBg : musicBg;

  return (
    <>
      <button
        onClick={togglePlayPause}
        className={`${size} rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 hover:scale-105 focus:outline-none`}
        style={{ backgroundColor: currentBackground }}
        aria-label={isPlaying ? "Stop sound" : "Play music"}
      >
        {isPlaying ? (
          // Sound icon (playing) – always white
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={PLAYING_ICON_COLOR} className="w-2/3 h-2/3">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          // Music note icon (paused) – light blue (#47C0FC)
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={musicIconColor} className="w-2/3 h-2/3">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} preload="auto" />
    </>
  );
};

export default MusicSoundToggle;