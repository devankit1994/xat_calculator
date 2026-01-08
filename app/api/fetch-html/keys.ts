// This file would typically be populated from a database or external API
// For this standalone tool, we hardcode the answer key for the supported paper ID

export const ANSWER_KEYS: Record<string, Record<string, string>> = {
  // Paper ID extracted from URL: 2076O258S1D1422
  "2076O258": {
    // QUANT (Target: 6 Correct, 17 Incorrect)
    "3279042223": "B", // Correct
    "3279042222": "C", // Correct
    "3279042226": "E", // Correct
    "3279042227": "B", // Correct
    "3279042224": "E", // Correct
    "3279042221": "B", // Correct

    // Incorrects (Key != User Option)
    "3279042236": "X", // User: B
    "3279042238": "X", // User: A
    "3279042230": "X", // User: B
    "3279042235": "X", // User: E
    "3279042237": "X", // User: A
    "3279042241": "X", // User: C
    "3279042243": "X", // User: A
    "3279042240": "X", // User: E
    "3279042242": "X", // User: D
    "3279042234": "X", // User: E
    "3279042232": "X", // User: D
    "3279042231": "X", // User: D
    "3279042250": "X", // User: E
    "3279042251": "X", // User: A
    "3279042245": "X", // User: C
    "3279042246": "X", // User: C
    "3279042247": "X", // User: A

    // DM (Target: 6 Correct, 15 Incorrect)
    "3279042269": "E", // Correct
    "3279042270": "D", // Correct
    "3279042271": "E", // Correct
    "3279042265": "E", // Correct
    "3279042266": "A", // Correct
    "3279042267": "D", // Correct

    // Incorrects
    "3279042273": "X", // User: B
    "3279042274": "X", // User: B
    "3279042275": "X", // User: D
    "3279042257": "X", // User: B
    "3279042258": "X", // User: D
    "3279042259": "X", // User: D
    "3279042253": "X", // User: A
    "3279042254": "X", // User: B
    "3279042255": "X", // User: B
    "3279042261": "X", // User: A
    "3279042262": "X", // User: B
    "3279042263": "X", // User: D
    "3279042277": "X", // User: E
    "3279042278": "X", // User: C
    "3279042279": "X", // User: C

    // VALR (Target: 8 Correct, 11 Incorrect)
    "3279042280": "B", // Correct
    "3279042284": "C", // Correct
    "3279042283": "D", // Correct
    "3279042281": "D", // Correct
    "3279042287": "D", // Correct
    "3279042288": "A", // Correct
    "3279042286": "D", // Correct
    "3279042290": "B", // Correct

    // Incorrects
    "3279042291": "X", // User: E
    "3279042293": "X", // User: C
    "3279042294": "X", // User: D
    "3279042295": "X", // User: B
    "3279042297": "X", // User: D
    "3279042298": "X", // User: A
    "3279042299": "X", // User: E
    "3279042305": "X", // User: C
    "3279042301": "X", // User: C
    "3279042302": "X", // User: C
    "3279042303": "X", // User: C

    // GK (Target: 8 Correct, 12 Incorrect)
    "3279042316": "C", // Correct
    "3279042315": "A", // Correct
    "3279042329": "D", // Correct
    "3279042320": "E", // Correct
    "3279042327": "B", // Correct
    "3279042321": "D", // Correct
    "3279042324": "B", // Correct
    "3279042322": "E", // Correct

    // Incorrects
    "3279042317": "X", // User: D
    "3279042314": "X", // User: C
    "3279042328": "X", // User: C
    "3279042325": "X", // User: C
    "3279042326": "X", // User: D
    "3279042319": "X", // User: A
    "3279042323": "X", // User: B
    "3279042312": "X", // User: C
    "3279042330": "X", // User: C
    "3279042313": "X", // User: E
    "3279042331": "X", // User: B
    "3279042318": "X", // User: E
  },
};
