"use client";

import React, { useState } from "react";
import {
  FileText,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
  AlertCircle,
  Target,
} from "lucide-react";

interface CalculatorFormProps {
  onSubmit: (data: { url: string; name: string; mobile: string; email: string }) => void;
  loading: boolean;
  error: string;
  theme?: 'blue' | 'orange';
}

export default function CalculatorForm({ onSubmit, loading, error, theme = 'blue' }: CalculatorFormProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!url.trim() || !name.trim() || !mobile.trim() || !email.trim()) {
      // Error will be set by parent
      return;
    }
    onSubmit({ url, name, mobile, email });
  };

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className={`w-5 h-5 text-${theme}-500`} />
            Enter Details
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-${theme}-500 transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Mobile
            </label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-${theme}-500 transition-colors" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) {
                    setMobile(value);
                  }
                }}
                placeholder="Mobile No."
                className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:ring-2 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 ${
                  error.toLowerCase().includes("mobile") ||
                  error.includes("valid")
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                    : `border-gray-200 focus:ring-${theme}-500/20 focus:border-${theme}-500`
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Response Sheet URL
            </label>
            <div className="relative group">
              <LinkIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-${theme}-500 transition-colors" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your URL here..."
                className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-${theme}-500/20 focus:border-${theme}-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 ml-1">
              Paste the URL from your browser address bar after logging
              into the response sheet portal.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm font-medium">
                {error}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-${theme}-600 hover:bg-${theme}-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Response...
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Calculate Score
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
