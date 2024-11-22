import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { useApiStatus } from "../hooks/useApiStatus";

const ApiStatus = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);
  const { translationStatus, promptsStatus, summarizationStatus } =
    useApiStatus();

  const essentialLinks = [
    {
      title: "Early Preview Program Sign-up Form",
      description: "Get access to Chrome's Built-in AI APIs",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfZXeiwj9KO9jMctffHPym88ln12xNWCrVkMY_u06WfSTulQg/viewform",
    },
    {
      title: "Official Documentation",
      description: "Learn more about Chrome's Built-in AI APIs",
      url: "https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04/edit?tab=t.0",
    },
  ];

  const requirements = {
    translation: {
      system: [
        "Chrome Canary version 131.0.6778.2 or newer required",
        "Supported platforms: Windows, Mac, or Linux",
        "Windows 10/11 or MacOS 13+ or Linux",
        "22 GB storage space minimum",
        "4 GB Video RAM minimum",
        "Integrated or discrete GPU",
        "Non-metered network connection",
      ],
      steps: [
        "Enable translation API flag in chrome://flags/#translation-api",
        "Select 'Enabled' and restart Chrome",
        "Navigate to translation demo page",
        "Wait for language models to download",
        "Run `await translation.canTranslate({sourceLanguage: 'en', targetLanguage: 'es'});` in console until it shows 'readily'",
        "Check components status in chrome://components",
        "Refresh this page to see updated status",
      ],
      links: {
        documentation: "https://docs.google.com/document/d/1bzpeKk4k26KfjtR-_d9OuXLMpJdRMiLZAOVNMuFIejk/edit?tab=t.0#heading=h.f94l44u7xfg9",
        demo: "https://translation-demo.glitch.me/"
      }
    },
    prompts: {
      system: [
        "Chrome Canary version 131.0.6778.2 or newer required",
        "Supported platforms: Windows, Mac, or Linux",
        "Windows 10/11 or MacOS 13+ (Ventura) or Linux",
        "22 GB storage space on Chrome profile volume",
        "4 GB Video RAM minimum",
        "Integrated or discrete GPU required",
        "Non-metered network connection",
        "Chrome version 128.0.6545.0 or above",
      ],
      steps: [
        "Acknowledge Google's Generative AI Prohibited Uses Policy",
        "Enable Gemini Nano flag in chrome://flags/#optimization-guide-on-device-model",
        "Select 'Enabled BypassPerfRequirement' option",
        "Enable Prompt API flag in chrome://flags/#prompt-api-for-gemini-nano",
        "Select 'Enabled' and restart Chrome",
        "Run `await ai.languageModel.create();` in console to trigger model download",
        "Run `(await ai.languageModel.capabilities()).available;` in console until it shows 'readily'",
        "Check chrome://components for model status",
        "Refresh page to see updated status",
      ],
      links: {
        documentation: "https://docs.google.com/document/d/18otm-D9xhn_XyObbQrc1v7SI-7lBX3ynZkjEpiS1V04",
        playground: "https://chrome.dev/web-ai-demos/prompt-api-playground/",
      }
    },
    summarization: {
      system: [
        "Chrome Canary version 131.0.6778.2 or newer required",
        "Supported platforms: Windows, Mac, or Linux",
        "Windows 10/11 or MacOS 13+ or Linux",
        "22 GB storage space minimum",
        "4 GB Video RAM minimum",
        "GPU required",
        "Non-metered network connection",
      ],
      steps: [
        "Enable Summarization API flag in chrome://flags/#summarization-api",
        "Select 'Enabled' and restart Chrome",
        "Run `await ai.summarizer.create();` in console to trigger model download",
        "Run `(await ai.summarizer.capabilities()).available;` in console until it shows 'readily'",
        "Check chrome://components for status",
        "Refresh this page to see updated status",
      ],
      links: {
        documentation: "https://docs.google.com/document/d/1Bvd6cU9VIEb7kHTAOCtmmHNAYlIZdeNmV7Oy-2CtimA/edit?tab=t.0",
        demo: "https://chrome.dev/web-ai-demos/summarization-api-playground/",
      }
    },
  };

  const formatChromeUrl = (step) => {
    const chromeUrlPattern = /(chrome:\/\/[^\s]+)/g;
    return step.split(chromeUrlPattern).map((part, index) => {
      if (part.match(chromeUrlPattern)) {
        return (
          <span
            key={index}
            className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);
    
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    return (
      <div className="relative">
        <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    );
  };

  const StatusCard = ({ title, status, description, type }) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
      <div
        className="flex items-center justify-between mb-4 cursor-pointer group"
        onClick={() => setExpandedCard(expandedCard === type ? null : type)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              status === "Checking..."
                ? "bg-blue-50 text-blue-500"
                : status === "Available"
                ? "bg-emerald-50 text-emerald-500"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            {status === "Checking..." ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : status === "Available" ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <div
              className={`text-sm font-medium ${
                status === "Checking..."
                  ? "text-blue-600"
                  : status === "Available"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {status}
            </div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          {expandedCard === type ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed ml-11">
        {description}
      </p>

      {expandedCard === type && (
        <div className="mt-6 space-y-6 animate-in slide-in-from-top duration-200">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              System Requirements
            </h3>
            <ul className="grid gap-2 text-gray-600 text-sm">
              {requirements[type].system.map((req, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-gray-900 font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Setup Steps
            </h3>
            <ol className="grid gap-3 text-gray-600 text-sm">
              {requirements[type].steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-medium text-indigo-600">{i + 1}.</span>
                  <span>{formatChromeUrl(step)}</span>
                </li>
              ))}
            </ol>
          </div>

          {requirements[type].links && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-gray-900 font-medium mb-3">Useful Links</h3>
              <div className="grid gap-2">
                {Object.entries(requirements[type].links).map(([key, url]) => (
                  <a 
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)} →
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            API Status Dashboard
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Check if your browser supports Chrome's Built-in AI features and
            learn how to enable them
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
              Built-in Browser Features
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>
              No External Dependencies
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12">
          <StatusCard
            title="Translation API"
            status={translationStatus}
            description="Enables text translation between different languages"
            type="translation"
          />
          <StatusCard
            title="Prompts API"
            status={promptsStatus}
            description="Provides AI-powered text generation capabilities"
            type="prompts"
          />
          <StatusCard
            title="Summarization API"
            status={summarizationStatus}
            description="Generates concise summaries of longer texts"
            type="summarization"
          />
        </div>

        {/* Essential Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Important References
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {essentialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 
                             hover:bg-white/20 transition-all duration-300 h-full"
                >
                  <h3
                    className="text-lg font-semibold text-white group-hover:text-emerald-300 
                               flex items-center justify-between"
                  >
                    {link.title}
                    <span className="text-white/30 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </h3>
                  <p className="text-white/70 text-sm mt-2">
                    {link.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatus;
