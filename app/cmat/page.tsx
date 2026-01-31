"use client";

import "../globals.css";
import React, { useState } from "react";
import CalculatorForm from "../components/CalculatorForm";
import {
  Calculator,
  Target,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  BarChart3,
  Percent,
  FileText,
  AlertTriangle,
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
  gk?: SectionData;
  sections: Record<string, SectionData>;
}

export default function CMATPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState("");

  const calculateScore = async (data: {
    url: string;
    name: string;
    mobile: string;
    email: string;
    city: string;
  }) => {
    if (!data.url || !data.name || !data.mobile || !data.email || !data.city) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch("/api/fetch-cmat-html", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to fetch response sheet");
      }

      setResults(resData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const getSectionStats = (namePart: string) => {
    if (!results) return null;
    const key = Object.keys(results.sections).find((k) =>
      k.toLowerCase().includes(namePart.toLowerCase()),
    );
    return key ? results.sections[key] : null;
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

  const quant = getSectionStats("quant");
  const lr = getSectionStats("logic");
  const lang = getSectionStats("language");
  const ga = getSectionStats("general");
  const innov = getSectionStats("innovation");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-3">
          <div className="bg-orange-600 p-2.5 rounded-xl shadow-sm">
            <Calculator className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CMAT Score Calculator</h1>
            <p className="text-sm text-gray-500">
              Check your CMAT 2026 performance instantly
            </p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Disclaimer */}
        {results && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm">
                Disclaimer
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                The score calculated here is an estimate based on the response
                sheet. The actual score provided by the official exam authority
                may vary due to normalization, objection management, or final
                answer key updates.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <CalculatorForm
            loading={loading}
            error={error}
            onSubmit={calculateScore}
            theme="orange"
            showCityField={true}
          />

          {/* RIGHT */}
          <div className="lg:col-span-7">
            {!results ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-2xl text-gray-400 text-center">
                <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No Results Yet</h3>
                <p className="text-sm">
                  Enter your details to generate scorecard
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                        <p className="text-sm text-gray-500">
                          Candidate:{" "}
                          <span className="font-medium text-gray-900">
                            {results.candidateName}
                          </span>
                        </p>
                      )}
                    </div>
                    <div className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      CMAT 2026
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
                              <Percent className="w-4 h-4 text-orange-500" />
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
                          "Quantitative Techniques",
                          quant,
                          <BarChart3 className="w-4 h-4" />,
                        )}
                        {renderRow(
                          "Logical Reasoning",
                          lr,
                          <Target className="w-4 h-4" />,
                        )}
                        {renderRow(
                          "Language Comprehension",
                          lang,
                          <FileText className="w-4 h-4" />,
                        )}
                        {renderRow(
                          "Innovation & Entrepreneurship",
                          innov,
                          <Trophy className="w-4 h-4" />,
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

                        {/* GK Row */}
                        {ga && (
                          <tr className="border-t border-gray-200">
                            <td className="p-4 text-gray-600 font-semibold flex items-center gap-2">
                              <span className="text-gray-400">
                                <ArrowUpRight className="w-4 h-4" />
                              </span>
                              General Awareness
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {ga.correct}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {ga.incorrect}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {ga.unattempted}
                            </td>
                            <td className="p-4 text-center text-gray-600">
                              {ga.correct + ga.incorrect > 0
                                ? Math.round(
                                    (ga.correct / (ga.correct + ga.incorrect)) *
                                      100,
                                  )
                                : 0}
                              %
                            </td>
                            <td className="p-4 text-center font-medium text-gray-700">
                              {ga.score}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500">
                    * General Awareness marks are included in the total CMAT
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
