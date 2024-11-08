import React from 'react';
import { Play, Pause, Volume2, SkipBack, RotateCcw } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

export default function AudioPlayer({ text }) {
  const {
    isPlaying,
    speed,
    togglePlay,
    resetPlayback,
    resetToStart,
    updateSpeed
  } = useAudioPlayer(text);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg p-4 mb-8 text-white relative overflow-hidden">
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Controls */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={resetToStart}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Reset to start"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={resetPlayback}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Skip back"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-white text-indigo-600 hover:bg-white/90 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              <select 
                value={speed}
                onChange={(e) => updateSpeed(parseFloat(e.target.value))}
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:border-white"
                aria-label="Playback speed"
              >
                {speeds.map((s) => (
                  <option key={s} value={s} className="text-gray-900">
                    {s}x
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-sm font-medium ml-2">
            {isPlaying ? 'Now reading...' : 'Click play to start'}
          </div>
        </div>

        {/* Right Column - Waves */}
        <div className="relative">
          {/* Animated Waves */}
          <div className="absolute inset-0 flex items-center justify-around">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-white/40 rounded-full transform transition-all duration-150 ${
                  isPlaying ? 'animate-wave' : 'h-1'
                }`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: isPlaying ? '60%' : '4px',
                  transform: `scaleY(${Math.sin((i * Math.PI) / 4) * 0.5 + 0.5})`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}