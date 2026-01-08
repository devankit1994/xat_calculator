"use client";

import React, { useState } from "react";
import {
  Calculator,
  Target,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  BarChart3,
  Percent,
  FileText,
  ChevronRight,
  User,
  Phone,
  Mail,
  Link as LinkIcon,
} from "lucide-react";

interface SectionData {
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
}

interface Results {
  candidateName: string;
  part1: {
    correct: number;
    incorrect: number;
    unattempted: number;
    rawScore: number;
    penalty: number;
    totalScore: number;
  };
  gk: {
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
  };
  sections: Record<string, SectionData>;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const calculateScore = async () => {
    if (!url.trim() || !name.trim() || !mobile.trim() || !email.trim()) {
      setError("All fields (Name, Mobile, Email, and URL) are required");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/fetch-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name, mobile, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch answer sheet");
      }

      setResults(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSectionStats = (namePart: string) => {
    if (!results) return null;
    const key = Object.keys(results.sections).find((k) => k.includes(namePart));
    return key ? results.sections[key] : null;
  };

  const renderRow = (
    label: string,
    stats: SectionData | null,
    icon?: React.ReactNode
  ) => {
    if (!stats) return null;
    const accuracy =
      stats.correct + stats.incorrect > 0
        ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
        : 0;

    return (
      <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
        <td className="p-4 text-gray-900 font-semibold flex items-center gap-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </td>
        <td className="p-4 text-center">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-green-100 text-green-700 font-medium">
            {stats.correct}
          </span>
        </td>
        <td className="p-4 text-center">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-red-100 text-red-700 font-medium">
            {stats.incorrect}
          </span>
        </td>
        <td className="p-4 text-center">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-gray-100 text-gray-600 font-medium">
            {stats.unattempted}
          </span>
        </td>
        <td className="p-4 text-center text-gray-600 font-medium">
          {accuracy}%
        </td>
        <td className="p-4 text-center text-gray-900 font-bold text-lg">
          {Number(stats.score) % 1 !== 0 ? stats.score.toFixed(2) : stats.score}
        </td>
      </tr>
    );
  };

  const quantStats = getSectionStats("Quantitative");
  const dmStats = getSectionStats("Decision");
  const valrStats = getSectionStats("Verbal");
  const gkStats = results ? results.gk : null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none mb-1">
                  XAT Score Calculator
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  Check your XAT 2026 performance instantly
                </p>
              </div>
            </div>
            {/* Optional: Add a link to official site or help */}
            {/* <a
              href="#"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 hidden sm:block"
            >
              Need Help?
            </a> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Enter Details
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* <div className="grid grid-cols-2 gap-4"> */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Mobile
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Mobile No."
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
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
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
                    />
                  </div>
                </div>
                {/* </div> */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    Response Sheet URL
                  </label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste your URL here..."
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 font-medium text-gray-900"
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
                  onClick={calculateScore}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Response...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      Check My Score
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {!results ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-gray-200 border-dashed text-gray-400 min-h-[400px]">
                <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-gray-500 mb-1">
                  No Results Yet
                </h3>
                <p className="text-sm max-w-xs mx-auto">
                  Enter your details and response sheet URL on the left to
                  generate your scorecard.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {results.part1.totalScore}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Total Score
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {results.part1.correct}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Correct
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {results.part1.incorrect}
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Incorrect
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {Math.round(
                        (results.part1.correct /
                          (results.part1.correct + results.part1.incorrect)) *
                          100
                      ) || 0}
                      %
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Accuracy
                    </div>
                  </div>
                </div>

                {/* Main Scorecard */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Detailed Scorecard
                      </h2>
                      {results.candidateName && (
                        <p className="text-sm text-gray-500">
                          Candidate:{" "}
                          <span className="font-medium text-gray-900">
                            {results.candidateName}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      XAT 2026
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 border-b border-gray-200">
                          <th className="px-4 py-3 text-left font-semibold w-1/4">
                            Section
                          </th>
                          <th className="px-4 py-3 text-center font-semibold">
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span>Correct</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center font-semibold">
                            <div className="flex flex-col items-center gap-1">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Wrong</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center font-semibold">
                            <div className="flex flex-col items-center gap-1">
                              <HelpCircle className="w-4 h-4 text-gray-500" />
                              <span>Unattempted</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center font-semibold">
                            <div className="flex flex-col items-center gap-1">
                              <Percent className="w-4 h-4 text-blue-500" />
                              <span>Acc.</span>
                            </div>
                          </th>
                          <th className="px-4 py-3 text-center font-semibold">
                            <div className="flex flex-col items-center gap-1">
                              <Trophy className="w-4 h-4 text-yellow-500" />
                              <span>Score</span>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderRow(
                          "Quantitative Ability",
                          quantStats,
                          <BarChart3 className="w-4 h-4" />
                        )}
                        {renderRow(
                          "Decision Making",
                          dmStats,
                          <Target className="w-4 h-4" />
                        )}
                        {renderRow(
                          "Verbal Ability",
                          valrStats,
                          <FileText className="w-4 h-4" />
                        )}

                        {/* Overall Row */}
                        <tr className="bg-blue-50/50 border-t-2 border-blue-100">
                          <td className="p-4 text-blue-800 font-bold">
                            Overall
                          </td>
                          <td className="p-4 text-center font-bold text-gray-800">
                            {results.part1.correct}
                          </td>
                          <td className="p-4 text-center font-bold text-gray-800">
                            {results.part1.incorrect}
                          </td>
                          <td className="p-4 text-center font-bold text-gray-800">
                            {results.part1.unattempted}
                          </td>
                          <td className="p-4 text-center font-bold text-blue-700">
                            {Math.round(
                              (results.part1.correct /
                                (results.part1.correct +
                                  results.part1.incorrect)) *
                                100
                            ) || 0}
                            %
                          </td>
                          <td className="p-4 text-center font-bold text-blue-700 text-xl">
                            {results.part1.totalScore}
                          </td>
                        </tr>

                        {/* GK Row */}
                        {gkStats && (
                          <tr className="border-t border-gray-200">
                            <td className="p-4 text-gray-600 font-semibold flex items-center gap-2">
                              <span className="text-gray-400">
                                <ArrowUpRight className="w-4 h-4" />
                              </span>
                              General Knowledge
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {gkStats.correct}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {gkStats.incorrect}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {gkStats.unattempted}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {gkStats.correct + gkStats.incorrect > 0
                                ? Math.round(
                                    (gkStats.correct /
                                      (gkStats.correct + gkStats.incorrect)) *
                                      100
                                  )
                                : 0}
                              %
                            </td>
                            <td className="p-4 text-center font-medium text-gray-700">
                              {gkStats.score}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500">
                    * General Knowledge marks are not included in the total XAT
                    score calculation.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
