import React from 'react';
import { Mic, Volume2, VolumeX, ArrowLeft, Volume1, Volume, Mic2 } from 'lucide-react';
import Header from '../common/Header';
import CustomTooltip from '../ArticleView/CustomTooltip';
import MessagesContainer from './MessagesContainer';
import { useConversation } from '../../hooks/useConversation';

export default function ConversationView({ topic, onClose }) {
  const {
    messages,
    isListening,
    volume,
    availableVoices,
    selectedVoice,
    currentlyPlayingId,
    showVolumeMenu,
    showVoiceMenu,
    activeTooltip,
    volumeRef,
    voiceRef,
    micRef,
    messagesEndRef,
    volumeOptions,
    getVolumeIcon,
    updateVolume,
    selectVoice,
    toggleListening,
    togglePlay,
    toggleVolumeMenu,
    toggleVoiceMenu,
    handleTooltip,
    clearTooltip,
    streamingText,
    isStreaming,
    tokenInfo,
    isSessionExpired,
    createNewSession,
    isLoading,
  } = useConversation();

  const getVolumeTooltip = () => {
    return "Adjust volume";
  };

  const getMicTooltip = () => {
    return isListening ? "Stop listening" : "Start listening";
  };

  const VolumeIcon = {
    VolumeX: <VolumeX className="w-5 h-5" />,
    Volume: <Volume className="w-5 h-5" />,
    Volume1: <Volume1 className="w-5 h-5" />,
    Volume2: <Volume2 className="w-5 h-5" />
  }[getVolumeIcon()];

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative bg-gray-50">
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col">
          <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
            <div className="flex justify-between items-center my-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Topics</span>
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Tokens remaining: {tokenInfo.left}/{tokenInfo.total}
                </span>
                {isSessionExpired && (
                  <button
                    onClick={createNewSession}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "New Session"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col min-h-0">
              <div className="flex-none border-b">
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{topic}</h2>
                </div>
              </div>

              <MessagesContainer 
                messages={messages}
                messagesEndRef={messagesEndRef}
                currentlyPlayingId={currentlyPlayingId}
                togglePlay={togglePlay}
                streamingText={streamingText}
                isStreaming={isStreaming}
              />

              <div className="flex-none border-t border-gray-200 p-4 pb-8 bg-indigo-600 mb-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-8">
                    <div className="relative">
                      <button
                        ref={volumeRef}
                        onClick={toggleVolumeMenu}
                        onMouseEnter={() => handleTooltip("volume")}
                        onMouseLeave={clearTooltip}
                        className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white relative"
                      >
                        {VolumeIcon}
                        {volume === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-6 bg-white/80 rotate-45 transform translate-y-0.5" />
                          </div>
                        )}
                      </button>
                      <CustomTooltip
                        text={getVolumeTooltip()}
                        visible={activeTooltip === "volume" && !showVolumeMenu}
                        containerRef={volumeRef}
                      />
                      {showVolumeMenu && (
                        <div className="absolute bottom-full mb-2 bg-white rounded-lg shadow-xl divide-y divide-gray-100">
                          {volumeOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                updateVolume(option.value);
                                toggleVolumeMenu();
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                volume === option.value ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"
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
                        ref={micRef}
                        onClick={toggleListening}
                        onMouseEnter={() => handleTooltip("mic")}
                        onMouseLeave={clearTooltip}
                        className={`p-4 rounded-full transition-colors relative ${
                          isListening
                            ? "bg-indigo-500 hover:bg-indigo-600"
                            : "bg-white hover:bg-white/90"
                        } ${isListening ? "text-white" : "text-indigo-600"}`}
                      >
                        <Mic className="w-6 h-6" />
                        {!isListening && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-0.5 h-8 bg-indigo-600 rotate-45 transform translate-y-0.5" />
                          </div>
                        )}
                        {isListening && (
                          <>
                            <div className="absolute -inset-1 rounded-full animate-[ping_1.5s_infinite] bg-indigo-500/40" />
                            <div className="absolute -inset-2 rounded-full animate-[ping_2s_infinite] bg-indigo-500/20" />
                          </>
                        )}
                      </button>
                      {isListening && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm bg-indigo-500/90 px-3 py-1 rounded-full text-white">
                          Listening...
                        </div>
                      )}
                      <CustomTooltip
                        text={getMicTooltip()}
                        visible={activeTooltip === "mic"}
                        containerRef={micRef}
                      />
                    </div>

                    <div className="relative">
                      <button
                        ref={voiceRef}
                        onClick={toggleVoiceMenu}
                        className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-2"
                        onMouseEnter={() => handleTooltip("voice")}
                        onMouseLeave={clearTooltip}
                      >
                        <Mic2 className="w-5 h-5" />
                        <span className="text-sm">
                          {selectedVoice?.name?.split(' ')[0] || 'Default'}
                        </span>
                      </button>
                      <CustomTooltip
                        text="Change voice"
                        visible={activeTooltip === "voice" && !showVoiceMenu}
                        containerRef={voiceRef}
                      />
                      {showVoiceMenu && (
                        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-xl divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                          {availableVoices.map((voice) => (
                            <button
                              key={voice.name}
                              onClick={() => {
                                selectVoice(voice);
                                toggleVoiceMenu();
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                selectedVoice?.name === voice.name ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"
                              }`}
                            >
                              {voice.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
