import React from 'react';
import { AlertTriangle, AlertCircle, ShieldCheck, XCircle } from "lucide-react";
import { Link } from 'react-router-dom';

const SkeletonBanner = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white animate-pulse">
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gray-200 p-2 w-9 h-9" />
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="w-28 h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

export default function ApiStatusBanner({ status, isLoading }) {
  if (isLoading) return <SkeletonBanner />;
  if (!status) return null;

  const configs = {
    available: {
      classes: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
      icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
      iconBg: 'bg-green-100',
      title: 'Ready to use',
      description: 'Your browser supports all required features',
      titleColor: 'text-green-900',
      textColor: 'text-green-700',
      button: {
        text: 'View Status',
        classes: 'bg-green-100 text-green-700 hover:bg-green-200'
      }
    },
    partial: {
      classes: 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200',
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      iconBg: 'bg-orange-100',
      title: 'Limited Access',
      description: 'Some features require additional setup',
      titleColor: 'text-orange-900',
      textColor: 'text-orange-700',
      button: {
        text: 'Enable Features',
        classes: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
      }
    },
    unavailable: {
      classes: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-100',
      title: 'Setup Required',
      description: 'Core features need to be enabled',
      titleColor: 'text-red-900',
      textColor: 'text-red-700',
      button: {
        text: 'Setup Instructions',
        classes: 'bg-white/50 text-red-700 hover:bg-white/75 border border-red-200'
      },
      warning: {
        show: true,
        message: 'Please enable required features before proceeding'
      }
    }
  };

  const config = configs[status];

  return (
    <div className={`mb-6 overflow-hidden rounded-xl border ${config.classes}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-full ${config.iconBg} p-2`}>
              {config.icon}
            </div>
            <div>
              <h3 className={`font-medium ${config.titleColor}`}>
                {config.title}
              </h3>
              <p className={`text-sm ${config.textColor}`}>
                {config.description}
              </p>
            </div>
          </div>
          <Link
            to="/api-status"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${config.button.classes}`}
          >
            {config.button.text}
          </Link>
        </div>
      </div>
      {config.warning?.show && (
        <div className="px-4 py-2 bg-gradient-to-r from-orange-100/50 to-red-100/50 border-t border-red-200">
          <p className="text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {config.warning.message}
          </p>
        </div>
      )}
    </div>
  );
}