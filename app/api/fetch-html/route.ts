import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ANSWER_KEYS } from "./keys";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    const results = parseAnswerSheet(html, url);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching or parsing:", error);
    return NextResponse.json(
      { error: "Failed to fetch or parse answer sheet" },
      { status: 500 }
    );
  }
}

function parseAnswerSheet(html: string, url: string) {
  const $ = cheerio.load(html);

  // Extract Candidate Name
  let candidateName = "";
  $("table").each((_, table) => {
    $(table)
      .find("tr")
      .each((_, tr) => {
        const tds = $(tr).find("td");
        if (tds.length >= 2) {
          const label = $(tds[0]).text().trim();
          if (label.includes("Candidate Name")) {
            candidateName = $(tds[1]).text().trim();
          }
        }
      });
  });

  const sections: Record<
    string,
    { correct: number; incorrect: number; unattempted: number; score: number }
  > = {};

  const GK_SECTION_NAME = "General Knowledge";

  // Extract paper ID from URL if possible
  // URL: .../2076O258S1D1422/...
  const paperIdMatch = url.match(/(2076O\w+)/);
  // Simplify paper ID extraction to match the key format
  const paperId = paperIdMatch ? paperIdMatch[1].substring(0, 8) : "2076O258";

  const answerKey = ANSWER_KEYS[paperId] || {};

  // Process each question container
  $(".grp-cntnr").each((_, grp) => {
    $(grp)
      .find(".section-cntnr")
      .each((_, sec) => {
        const sectionName = $(sec).find(".section-lbl .bold").text().trim();

        if (!sections[sectionName]) {
          sections[sectionName] = {
            correct: 0,
            incorrect: 0,
            unattempted: 0,
            score: 0,
          };
        }

        $(sec)
          .find(".question-pnl")
          .each((_, qPnl) => {
            const menuTable = $(qPnl).find(".menu-tbl");

            let status = "";
            let chosenOption = "";
            let questionId = "";

            menuTable.find("tr").each((_, tr) => {
              const rowText = $(tr).text();
              if (rowText.includes("Status :")) {
                status = $(tr).find("td").last().text().trim();
              }
              if (rowText.includes("Chosen Option :")) {
                chosenOption = $(tr).find("td").last().text().trim();
              }
              if (rowText.includes("Question ID :")) {
                questionId = $(tr).find("td").last().text().trim();
              }
            });

            let correctOption = "";

            // 1. Try to find correct answer from HTML first (Standard Method)
            const optionsTable = $(qPnl).find(".questionRowTbl");
            optionsTable.find("tr").each((_, tr) => {
              const tds = $(tr).find("td");
              let optionLabel = "";

              tds.each((i, td) => {
                const text = $(td).text().trim();
                const match = text.match(/^([A-E])\./);
                if (match) {
                  optionLabel = match[1];
                }
              });

              if (optionLabel) {
                if ($(tr).find(".rightAns").length > 0) {
                  correctOption = optionLabel;
                }
                if (
                  $(tr).find('img[src*="tick"]').length > 0 ||
                  $(tr).find('img[src*="correct"]').length > 0
                ) {
                  correctOption = optionLabel;
                }
                const greenColorRegex = /color\s*:\s*(#40c64b|green)/i;
                if (
                  greenColorRegex.test($(tr).attr("style") || "") ||
                  $(tr)
                    .find("[style]")
                    .filter((_, el) =>
                      greenColorRegex.test($(el).attr("style") || "")
                    ).length > 0
                ) {
                  correctOption = optionLabel;
                }
              }
            });

            // 2. If not found in HTML, check the external answer key using Question ID
            if (!correctOption && questionId && answerKey[questionId]) {
              correctOption = answerKey[questionId];
            }

            if (correctOption) {
              if (
                status === "Not Answered" ||
                !chosenOption ||
                chosenOption === "--"
              ) {
                sections[sectionName].unattempted++;
              } else if (chosenOption === correctOption) {
                sections[sectionName].correct++;
              } else {
                sections[sectionName].incorrect++;
              }
            } else {
              // Treat as unattempted if key missing
              sections[sectionName].unattempted++;
            }
          });
      });
  });

  // Calculate Section Scores
  let part1Correct = 0;
  let part1Incorrect = 0;
  let part1Unattempted = 0;
  let part1RawScore = 0;

  let gkStats = {
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    score: 0,
  };

  Object.entries(sections).forEach(([name, stats]) => {
    let sectionScore = 0;

    if (name.includes(GK_SECTION_NAME)) {
      // GK Scoring: +1 correct, 0 incorrect (as per user result)
      sectionScore = stats.correct * 1;

      gkStats.correct += stats.correct;
      gkStats.incorrect += stats.incorrect;
      gkStats.unattempted += stats.unattempted;
      gkStats.score += sectionScore;
    } else {
      // Part 1 Scoring: +1 correct, -0.25 incorrect
      sectionScore = stats.correct * 1 - stats.incorrect * 0.25;

      part1Correct += stats.correct;
      part1Incorrect += stats.incorrect;
      part1Unattempted += stats.unattempted;
      part1RawScore += sectionScore;
    }

    // Update section object
    sections[name].score = parseFloat(sectionScore.toFixed(2));
  });

  // Calculate Penalty for Unattempted Questions in Part 1
  // Rule: 0.10 marks deducted per unattempted question beyond 8
  const penaltyCount = Math.max(0, part1Unattempted - 8);
  const penalty = penaltyCount * 0.1;

  const part1TotalScore = part1RawScore - penalty;

  return {
    candidateName,
    part1: {
      correct: part1Correct,
      incorrect: part1Incorrect,
      unattempted: part1Unattempted,
      rawScore: parseFloat(part1RawScore.toFixed(2)),
      penalty: parseFloat(penalty.toFixed(2)),
      totalScore: parseFloat(part1TotalScore.toFixed(2)),
    },
    gk: {
      correct: gkStats.correct,
      incorrect: gkStats.incorrect,
      unattempted: gkStats.unattempted,
      score: parseFloat(gkStats.score.toFixed(2)),
    },
    sections: sections,
  };
}
