import jan21s1 from "../../jee-main/answers/21st_Jan_Shift_1.json";
import jan21s2 from "../../jee-main/answers/21st_Jan_Shift_2.json";
import jan22s1 from "../../jee-main/answers/22nd_Jan_Shift_1.json";
import jan22s2 from "../../jee-main/answers/22nd_Jan_Shift_2.json";
import jan23s1 from "../../jee-main/answers/23rd_Jan_Shift_1.json";
import jan23s2 from "../../jee-main/answers/23rd_Jan_Shift_2.json";
import jan24s1 from "../../jee-main/answers/24th_Jan_Shift_1.json";
import jan24s2 from "../../jee-main/answers/24th_Jan_Shift_2.json";
import jan28s1 from "../../jee-main/answers/28th_Jan_Shift_1.json";
import jan28s2 from "../../jee-main/answers/28th_Jan_Shift_2.json";

interface AnswerKeyItem {
  QuestionID: string;
  CorrectAnswer: string;
}

const normalize = (data: AnswerKeyItem[]) => {
  const map: Record<string, string> = {};
  data.forEach((item) => {
    map[item.QuestionID] = item.CorrectAnswer;
  });
  return map;
};

// Map day_shift to the normalized key
// Day is just the day part of the date (21, 22, 23, 24, 28)
// Shift is 1 or 2
const KEYS: Record<string, Record<string, string>> = {
  "21_1": normalize(jan21s1 as AnswerKeyItem[]),
  "21_2": normalize(jan21s2 as AnswerKeyItem[]),
  "22_1": normalize(jan22s1 as AnswerKeyItem[]),
  "22_2": normalize(jan22s2 as AnswerKeyItem[]),
  "23_1": normalize(jan23s1 as AnswerKeyItem[]),
  "23_2": normalize(jan23s2 as AnswerKeyItem[]),
  "24_1": normalize(jan24s1 as AnswerKeyItem[]),
  "24_2": normalize(jan24s2 as AnswerKeyItem[]),
  "28_1": normalize(jan28s1 as AnswerKeyItem[]),
  "28_2": normalize(jan28s2 as AnswerKeyItem[]),
};

export function getAnswerKey(
  date: string,
  time: string,
): Record<string, string> | null {
  // Expected Date Format: "21/01/2026" or similar containing the day
  // Expected Time Format: "9:00 AM - 12:00 PM" (Shift 1) or "3:00 PM - 6:00 PM" (Shift 2)

  let day = "";
  if (date.includes("21")) day = "21";
  else if (date.includes("22")) day = "22";
  else if (date.includes("23")) day = "23";
  else if (date.includes("24")) day = "24";
  else if (date.includes("28")) day = "28";

  let shift = "";
  // Check for Shift 1 (Morning)
  // Usually starts at 9:00 AM
  if (time.includes("9:00") || time.toLowerCase().includes("am")) {
    shift = "1";
  }
  // Check for Shift 2 (Evening/Afternoon)
  // Usually starts at 3:00 PM or 15:00
  else if (
    time.includes("3:00") ||
    time.includes("15:00") ||
    time.toLowerCase().includes("pm")
  ) {
    shift = "2";
  }

  if (day && shift) {
    const key = `${day}_${shift}`;
    return KEYS[key] || null;
  }

  return null;
}

// Deprecated: Kept for backward compatibility if needed, but not used in new logic
export const ANSWER_KEYS: Record<string, Record<string, string>> = {};
