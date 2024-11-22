
import React from 'react';
import { AlertTriangle, AlertCircle, ShieldCheck, XCircle } from "lucide-react";
import { Link } from 'react-router-dom';

export default function ApiStatusBanner({ isApisAvailable }) {
  if (isApisAvailable === undefined) return null;

  return (
    <div className={`mb-6 overflow-hidden rounded-xl border ${
      isApisAvailable 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
        : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isApisAvailable ? (
              <div className="rounded-full bg-green-100 p-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-2">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div>
              <h3 className={`font-medium ${
                isApisAvailable ? 'text-green-900' : 'text-red-900'
              }`}>
                {isApisAvailable 
                  ? "Ready to use"
                  : "Setup Required"
                }
              </h3>
              <p className={`text-sm ${
                isApisAvailable ? 'text-green-700' : 'text-red-700'
              }`}>
                {isApisAvailable 
                  ? "Your browser supports all required features"
                  : "Some required features need to be enabled"
                }
              </p>
            </div>
          </div>
          <Link
            to="/api-status"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isApisAvailable
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-white/50 text-red-700 hover:bg-white/75 border border-red-200'
              }`}
          >
            {isApisAvailable ? 'View Status' : 'Setup Instructions'}
          </Link>
        </div>
      </div>
      {!isApisAvailable && (
        <div className="px-4 py-2 bg-gradient-to-r from-orange-100/50 to-red-100/50 border-t border-red-200">
          <p className="text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Please enable required features before proceeding
          </p>
        </div>
      )}
    </div>
  );
}