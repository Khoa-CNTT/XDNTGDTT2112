/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import cloudinary, { Cloudinary } from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";
import { updateProgressLesson } from "@/services/lessonService";
import { useSearchParams } from "react-router-dom";

interface IProps {
  publicId: string;
  playerConfig?: Record<string, any>;
  sourceConfig?: Record<string, any>;
  // lastWatchPosition: number;
  handleClickNextLesson: () => void;
  refetch: () => void;
  progressId: string;
  ref: React.RefObject<cloudinary.VideoPlayer | null>;
}

const VideoPlayer = ({
  publicId,
  playerConfig,
  sourceConfig,
  // lastWatchPosition,
  handleClickNextLesson,
  progressId,
  refetch,
  ref,
  ...props
}: IProps) => {
  const cloudinaryRef = useRef<Cloudinary | null>(null);
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const idIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(playerRef.current as any, {
      ...playerConfig,
    });

    ref.current = player;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (!playerRef.current) return;
      switch (event.key.toLowerCase()) {
        // Volume controls
        case "arrowup": {
          event.preventDefault();
          player.volume(Math.min(playerRef.current.volume + 0.1, 1));
          break;
        }
        case "arrowdown": {
          event.preventDefault();
          player.volume(Math.max(playerRef.current.volume - 0.1, 0));
          break;
        }
        // Seeking controls
        case "arrowleft": {
          event.preventDefault();
          player.currentTime(Math.max(playerRef.current.currentTime - 10, 0));
          break;
        }
        case "arrowright": {
          event.preventDefault();
          player.currentTime(
            Math.min(playerRef.current.currentTime + 10, player.duration())
          );
          break;
        }
        // Play/Pause with Space
        case " ": {
          event.preventDefault();
          if (playerRef.current.paused) {
            player.play();
          } else {
            player.pause();
          }
          break;
        }
        // Fullscreen with F
        case "f": {
          event.preventDefault();
          if (player.isMaximized()) {
            player.exitMaximize();
          } else {
            player.maximize();
          }
          break;
        }
        // Mute/Unmute with M
        case "m": {
          event.preventDefault();
          if (player.isMuted()) {
            player.unmute();
          } else {
            player.mute();
          }
          break;
        }
      }
    };

    (player as any).on("keydown", handleKeyPress);

    player.source(publicId, sourceConfig);
  }, []);

  useEffect(() => {
    const position = searchParams.get("position");
    const videoPlayer = playerRef.current;
    // if (!videoPlayer || !lastWatchPosition) return;
    if (!videoPlayer) return;

    if (position) {
      const positionNumber = parseInt(position, 10);
      if (positionNumber > 0) {
        videoPlayer.currentTime = positionNumber;
      } else {
        // videoPlayer.currentTime = lastWatchPosition;
      }
    } else {
      // videoPlayer.currentTime = lastWatchPosition;
    }
  }, [searchParams, ref]);

  useEffect(() => {
    const videoPlayer = playerRef.current;

    if (videoPlayer) {
      videoPlayer.addEventListener("play", () => {
        clearInterval(idIntervalRef.current as NodeJS.Timeout);
        idIntervalRef.current = setInterval(async () => {
          const currentTime = videoPlayer.currentTime;
          const duration = videoPlayer.duration;
          const progress = Math.floor((currentTime / duration) * 100);
          const lastWatchPosition = Math.floor(currentTime);
          if (progressId) {
            await updateProgressLesson(progressId, {
              progress,
              lastWatchPosition,
            });
          }
        }, 1000);
      });

      videoPlayer.addEventListener("pause", () => {
        clearInterval(idIntervalRef.current as NodeJS.Timeout);
      });

      videoPlayer.addEventListener("ended", async () => {
        clearInterval(idIntervalRef.current as NodeJS.Timeout);

        if (progressId) {
          await updateProgressLesson(progressId, {
            progress: 100,
            lastWatchPosition: Math.floor(videoPlayer.duration) - 5,
          });
          handleClickNextLesson();
          refetch();
        }
      });
    }

    return () => {
      if (videoPlayer) {
        clearInterval(idIntervalRef.current as NodeJS.Timeout);
        videoPlayer.removeEventListener("play", () => {});
        videoPlayer.removeEventListener("pause", () => {});
        videoPlayer.removeEventListener("ended", () => {});
      }
    };
  }, []);

  return (
    <video ref={playerRef} className="cld-video-player cld-fluid" {...props} />
  );
};

export default VideoPlayer;
