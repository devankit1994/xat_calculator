"use client";
import CalculatorForm from "../components/CalculatorForm";

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
  FlaskConical,
  Atom,
  Sigma,
  Download,
  FileText as FileIcon,
} from "lucide-react";

interface SectionData {
  correct: number;
  incorrect: number;
  unattempted: number;
  score: number;
}

interface Results {
  candidateName: string;
  applicationNo?: string;
  part1: {
    correct: number;
    incorrect: number;
    unattempted: number;
    rawScore: number;
    penalty: number;
    totalScore: number;
  };
  // gk is present in XAT structure but not used here, keep optional or ignore
  sections: Record<string, SectionData>;
  keyFound?: boolean;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const calculateScore = async (formData: {
    url: string;
    name: string;
    mobile: string;
    email: string;
    city?: string;
  }) => {
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/jee-main-score-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch answer sheet");
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const getSectionStats = (namePart: string) => {
    if (!results) return null;
    // Match "Mathematics", "Physics", "Chemistry" regardless of "Section A" suffix
    // But sum them up? Or show separately?
    // The parser returns distinct keys like "Mathematics Section A"
    // Let's aggregate if needed, or just list all keys.
    // For simplicity, let's filter keys that start with the name.

    // Actually, let's just use the keys returned by the API for the table rows.
    return null; // not used directly
  };

  const formatAnswerSheetName = (filename: string): string => {
    // Extract shift and date from filename
    // "JEE_2026_answer_key - 1st Shift - 23rd Jan.pdf" -> "23rd Jan - Shift 1"
    // "JEE_2026_answer_key -21st Jan (1st Shift).pdf" -> "21st Jan - Shift 1"

    let shiftNum = "1";
    let date = "";

    // Try pattern: "JEE_2026_answer_key - Xth Shift - XXth Jan"
    const pattern1 =
      /(\d+)(?:st|nd|rd|th)\s+Shift\s+-\s+(\d+(?:st|nd|rd|th)\s+Jan)/i;
    const match1 = filename.match(pattern1);
    if (match1) {
      shiftNum = match1[1];
      date = match1[2];
    } else {
      // Try pattern: "JEE_2026_answer_key -XXth Jan (Xth Shift)"
      const pattern2 =
        /(\d+(?:st|nd|rd|th)\s+Jan)\s*\((\d+)(?:st|nd|rd|th)\s+Shift\)/i;
      const match2 = filename.match(pattern2);
      if (match2) {
        date = match2[1];
        shiftNum = match2[2];
      }
    }

    return date ? `${date} - Shift ${shiftNum}` : filename;
  };

  const renderRow = (
    label: string,
    stats: SectionData | null,
    icon?: React.ReactNode,
  ) => {
    if (!stats) return null;
    const accuracy =
      stats.correct + stats.incorrect > 0
        ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
        : 0;

    return (
      <tr
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
        key={label}
      >
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 justify-between w-full">
              <img
                src="https://www.mycampusreview.com/assest/front/images/my-campus-review-logo.webp"
                alt="My Campus Review Logo"
                className="h-12 w-auto"
              />
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-gray-900 leading-none">
                    JEE Main Score Calculator
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Check your JEE Main 2026 performance instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <CalculatorForm
            loading={loading}
            error={error}
            theme="orange"
            showCityField={true}
            onSubmit={(data) => {
              calculateScore({
                url: data.url,
                name: data.name,
                mobile: data.mobile,
                email: data.email,
                city: data.city,
              });
            }}
          />
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
                {!results.keyFound && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 flex items-start gap-3 text-yellow-800">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-semibold">Answer Keys Not Found</h3>
                      <p className="text-sm mt-1 text-yellow-700">
                        We haven't uploaded the answer keys for this specific
                        exam shift yet. Your score is calculated as 0. Please
                        check back later.
                      </p>
                    </div>
                  </div>
                )}
                {/* Score Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
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
                          100,
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
                        <div className="text-sm text-gray-500 mt-1 space-y-1">
                          <p>
                            Candidate:{" "}
                            <span className="font-medium text-gray-900">
                              {results.candidateName}
                            </span>
                          </p>
                          {results.applicationNo && (
                            <p>
                              Application No:{" "}
                              <span className="font-medium text-gray-900">
                                {results.applicationNo}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      JEE Main
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
                        {Object.entries(results.sections).map(
                          ([name, stats]) => {
                            let icon = <FileText className="w-4 h-4" />;
                            if (name.includes("Mathematics"))
                              icon = <Sigma className="w-4 h-4" />;
                            if (name.includes("Physics"))
                              icon = <Atom className="w-4 h-4" />;
                            if (name.includes("Chemistry"))
                              icon = <FlaskConical className="w-4 h-4" />;

                            return renderRow(name, stats, icon);
                          },
                        )}

                        {/* Overall Row */}
                        <tr className="bg-orange-50/50 border-t-2 border-orange-100">
                          <td className="p-4 text-orange-800 font-bold">
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
                          <td className="p-4 text-center font-bold text-orange-700">
                            {Math.round(
                              (results.part1.correct /
                                (results.part1.correct +
                                  results.part1.incorrect)) *
                                100,
                            ) || 0}
                            %
                          </td>
                          <td className="p-4 text-center font-bold text-orange-700 text-xl">
                            {results.part1.totalScore}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Answer Sheets Download Section */}
        {/* <div className="mt-12 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-50/50">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Download Answer Sheets & Keys
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Download official answer sheets and answer keys for JEE Main
                    2026
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {[
                  "JEE_2026_answer_key -21st Jan (1st Shift).pdf",
                  "JEE_2026_answer_key - 2nd Shift - 21st Jan.pdf",
                  "JEE_2026_answer_key -22nd Jan (1st Shift).pdf",
                  "JEE_2026_answer_key -22nd Jan (2nd Shift).pdf",
                  "JEE_2026_answer_key - 1st Shift - 23rd Jan.pdf",
                  "JEE_2026_answer_key - 2nd Shift - 23rd Jan.pdf",
                  "JEE_2026_answer_key - 1st Shift - 24th Jan.pdf",
                  "JEE_2026_answer_key - 2nd Shift - 24th Jan.pdf",
                  "JEE_2026_answer_key - 1st Shift - 28th Jan.pdf",
                  "JEE_2026_answer_key - 2nd Shift - 28th Jan.pdf",
                ].map((file) => (
                  <a
                    key={file}
                    href={`/answer-sheets/${encodeURIComponent(file)}`}
                    download
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors group border border-gray-200 hover:border-orange-200"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 break-all">
                      {formatAnswerSheetName(file)}
                    </span>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-orange-600 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
