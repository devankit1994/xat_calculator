import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getAnswerKey } from "./keys";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { url, name, mobile, email, city } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    const results = parseAnswerSheet(html, url);

    // Store in Supabase
    const { error: dbError } = await supabase.from("jee_main_scores").insert([
      {
        name,
        mobile,
        email,
        city,
        url,
        candidate_name_from_sheet: results.candidateName,
        paper_id: results.paperId,
        total_score: results.part1.totalScore,
        correct: results.part1.correct,
        incorrect: results.part1.incorrect,
        unattempted: results.part1.unattempted,
        physics_score: results.sections["Physics"]?.score || 0,
        chemistry_score: results.sections["Chemistry"]?.score || 0,
        mathematics_score: results.sections["Mathematics"]?.score || 0,
        details: results,
      },
    ]);

    if (dbError) {
      console.error("Error saving to Supabase:", dbError);
      // We don't fail the request if saving fails, but we log it.
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching or parsing:", error);
    return NextResponse.json(
      { error: "Failed to fetch or parse answer sheet" },
      { status: 500 },
    );
  }
}

function parseAnswerSheet(html: string, url: string) {
  const $ = cheerio.load(html);

  // Extract Candidate Name, Date, Time, and Application Number
  let candidateName = "";
  let testDate = "";
  let testTime = "";
  let applicationNo = "";

  $(".main-info-pnl table tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length >= 2) {
      const label = $(tds[0]).text().trim();
      const value = $(tds[1]).text().trim();

      if (label.includes("Candidate Name")) {
        candidateName = value;
      } else if (label.includes("Test Date")) {
        testDate = value;
      } else if (label.includes("Test Time")) {
        testTime = value;
      } else if (
        label.includes("Application No") ||
        label.includes("Application Number")
      ) {
        applicationNo = value;
      }
    }
  });

  // Extract Paper ID from URL (optional, for reference)
  // Example: .../2083O25249S5D9392/...
  const paperIdMatch = url.match(/\/(\d+O\w+)\//);
  const paperId = paperIdMatch ? paperIdMatch[1] : "UNKNOWN";

  const answerKey = getAnswerKey(testDate, testTime) || {};
  const keyFound = Object.keys(answerKey).length > 0;

  const sections: Record<
    string,
    { correct: number; incorrect: number; unattempted: number; score: number }
  > = {};

  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;
  let totalScore = 0;

  $(".section-cntnr").each((_, sec) => {
    const rawSectionName = $(sec).find(".section-lbl .bold").text().trim();

    let sectionName = rawSectionName;
    if (rawSectionName.toLowerCase().includes("mathematics"))
      sectionName = "Mathematics";
    else if (rawSectionName.toLowerCase().includes("physics"))
      sectionName = "Physics";
    else if (rawSectionName.toLowerCase().includes("chemistry"))
      sectionName = "Chemistry";

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

        let questionId = "";
        let chosenOptionStr = "";
        let givenAnswerStr = "";
        let optionIds: string[] = [];
        let status = "";

        // Extract Question ID and Options from the right-side table
        $(menuTable)
          .find("tr")
          .each((_, tr) => {
            const tds = $(tr).find("td");
            if (tds.length >= 2) {
              const label = $(tds[0]).text().trim();
              const value = $(tds[1]).text().trim();

              if (label.includes("Question ID")) {
                questionId = value;
              } else if (label.includes("Chosen Option")) {
                chosenOptionStr = value;
              } else if (label.includes("Given Answer")) {
                givenAnswerStr = value;
              } else if (label.includes("Status")) {
                status = value;
              } else if (label.includes("Option") && label.includes("ID")) {
                optionIds.push(value);
              } else if (
                label.includes("Correct Option") ||
                label.includes("Correct Answer")
              ) {
                // If the response sheet itself contains the key, use it
                answerKey[questionId] = value;
              }
            }
          });

        // Determine candidate's answer ID or Value
        let candidateAnswerId = null;
        let isNumerical = false;

        if (givenAnswerStr && givenAnswerStr !== "--") {
          candidateAnswerId = givenAnswerStr;
          isNumerical = true;
        } else if (
          chosenOptionStr &&
          chosenOptionStr !== "--" &&
          !isNaN(parseInt(chosenOptionStr))
        ) {
          const chosenIndex = parseInt(chosenOptionStr) - 1; // 1-based to 0-based
          if (chosenIndex >= 0 && chosenIndex < optionIds.length) {
            candidateAnswerId = optionIds[chosenIndex];
          }
        }

        // Try to find correct answer in the answer key map
        // If not found, check if it's "Dropped"
        const correctAnsId = answerKey[questionId];

        let isCorrect = false;
        let isIncorrect = false;
        let isUnattempted = true;

        if (correctAnsId === "Dropped") {
          isCorrect = true;
          isUnattempted = false;
        } else if (candidateAnswerId) {
          isUnattempted = false;
          if (correctAnsId) {
            if (candidateAnswerId === correctAnsId) {
              isCorrect = true;
            } else if (isNumerical) {
              // Try numeric comparison for numerical questions
              // (e.g. candidate wrote "2.0" but key is "2")
              const numCand = parseFloat(candidateAnswerId);
              const numCorrect = parseFloat(correctAnsId);
              if (
                !isNaN(numCand) &&
                !isNaN(numCorrect) &&
                Math.abs(numCand - numCorrect) < 0.0001
              ) {
                isCorrect = true;
              } else {
                isIncorrect = true;
              }
            } else {
              isIncorrect = true;
            }
          } else {
            isUnattempted = true;
          }
        }

        if (isCorrect) {
          sections[sectionName].correct++;
          sections[sectionName].score += 4;
          totalCorrect++;
          totalScore += 4;
        } else if (isIncorrect) {
          sections[sectionName].incorrect++;
          sections[sectionName].score -= 1;
          totalIncorrect++;
          totalScore -= 1;
        } else {
          sections[sectionName].unattempted++;
          totalUnattempted++;
        }
      });
  });

  return {
    candidateName,
    applicationNo,
    part1: {
      correct: totalCorrect,
      incorrect: totalIncorrect,
      unattempted: totalUnattempted,
      totalScore,
      rawScore: totalScore,
      penalty: totalIncorrect,
    },
    gk: { correct: 0, incorrect: 0, unattempted: 0, score: 0 },
    sections,
    paperId,
    keyFound,
  };
}
