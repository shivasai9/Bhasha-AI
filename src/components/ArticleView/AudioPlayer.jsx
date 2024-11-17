import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  Volume,
  VolumeX,
  SkipBack,
  RotateCcw,
  Gauge,
} from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import CustomTooltip from "./CustomTooltip.jsx";

export default function AudioPlayer({ text }) {
  const {
    isPlaying,
    speed,
    volume,
    togglePlay,
    resetPlayback,
    resetToStart,
    updateSpeed,
    updateVolume,
  } = useAudioPlayer(text);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const volumeSliderRef = useRef(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const volumeOptions = [
    { value: 1, label: "100%" },
    { value: 0.75, label: "75%" },
    { value: 0.5, label: "50%" },
    { value: 0.25, label: "25%" },
    { value: 0, label: "Mute" },
  ];

  const tooltips = {
    reset: "Start from beginning",
    skipBack: "Go back 5 words",
    playPause: isPlaying ? "Pause reading" : "Start reading",
    volume: "Adjust volume",
    speed: "Change reading speed",
  };

  const handleVolumeClick = () => {
    if (isPlaying) {
      togglePlay(); // Pause the playback
    }
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleSpeedClick = () => {
    if (isPlaying) {
      togglePlay(); // Pause the playback
    }
    setShowSpeedMenu(!showSpeedMenu);
  };

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeSliderRef.current &&
        !volumeSliderRef.current.contains(event.target)
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.3) return <Volume className="w-5 h-5" />;
    if (volume < 0.7) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg p-4 mb-8 text-white relative overflow-visible">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={resetToStart}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onMouseEnter={() => setActiveTooltip("reset")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label="Reset to start"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <CustomTooltip
                  text={tooltips.reset}
                  visible={activeTooltip === "reset"}
                />
              </div>

              <div className="relative">
                <button
                  onClick={resetPlayback}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onMouseEnter={() => setActiveTooltip("skipBack")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label="Skip back"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <CustomTooltip
                  text={tooltips.skipBack}
                  visible={activeTooltip === "skipBack"}
                />
              </div>

              <div className="relative">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white text-indigo-600 hover:bg-white/90 transition-colors"
                  onMouseEnter={() => setActiveTooltip("playPause")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <CustomTooltip
                  text={tooltips.playPause}
                  visible={activeTooltip === "playPause"}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={volumeSliderRef}>
                <button
                  onClick={handleVolumeClick}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  onMouseEnter={() => setActiveTooltip("volume")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  title="Adjust volume"
                >
                  {getVolumeIcon()}
                </button>
                <CustomTooltip
                  text={tooltips.volume}
                  visible={activeTooltip === "volume" && !showVolumeSlider}
                />
                {showVolumeSlider && (
                  <div className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-xl divide-y divide-gray-100">
                    {volumeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateVolume(option.value);
                          setShowVolumeSlider(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          volume === option.value
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleSpeedClick}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2"
                  onMouseEnter={() => setActiveTooltip("speed")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  title="Playback speed"
                >
                  <Gauge className="w-5 h-5" />
                  <span className="text-sm font-medium">{speed}x</span>
                </button>
                <CustomTooltip
                  text={tooltips.speed}
                  visible={activeTooltip === "speed" && !showSpeedMenu}
                />
                {showSpeedMenu && (
                  <div className="absolute right-0 bottom-full mb-2 bg-white rounded-lg shadow-xl divide-y divide-gray-100 min-w-[120px]">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          updateSpeed(s);
                          setShowSpeedMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm ${
                          speed === s
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {s}x Speed
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm font-medium mt-2">
            {isPlaying ? "Now reading..." : "Click play to start"}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-around">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-white/40 rounded-full transform transition-all duration-150 ${
                  isPlaying ? "animate-wave" : "h-1"
                }`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: isPlaying ? "60%" : "4px",
                  transform: `scaleY(${
                    Math.sin((i * Math.PI) / 4) * 0.5 + 0.5
                  })`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
