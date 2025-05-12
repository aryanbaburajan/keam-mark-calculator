import answerKeyList from "@/lib/answerKeys.json" assert { type: "json" };

async function extractAnswers(sessionDate: Date, session: string) {
  // prettier-ignore
  return (answerKeyList as Record<string, (string | null)[]>)[String(sessionDate.getDate()) + session];
}

async function extractResponses(file: File) {
  const text = await file.text();

  const regex = /<tr>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\w)<\/td>\s*<\/tr>/g;

  const result = new Array(150).fill(null);
  let match;

  while ((match = regex.exec(text)) !== null) {
    const index = parseInt(match[1], 10) - 1;
    const char = match[2];
    result[index] = char;
  }

  return result;
}

export interface Result {
  score: number;
  correct: number;
  incorrect: number;
  cancelled: number;
}

export async function processScore(
  sessionDate: Date | undefined,
  candidateResponseFile: File | undefined | null,
  sessionTime: string
) {
  if (sessionDate && candidateResponseFile) {
    const answers = await extractAnswers(sessionDate, sessionTime);
    const responses = await extractResponses(candidateResponseFile);

    const rating: number[] = answers.map((_, questionNumber: number) => {
      if (responses[questionNumber] === "N" || answers[questionNumber] === null)
        return 0;

      if (responses[questionNumber] !== answers[questionNumber]) return -1;
      if (responses[questionNumber] === answers[questionNumber]) return 4;

      return 0;
    });

    const score = rating.reduce((a, b) => a + b);
    const correct = rating.filter((x) => x === 4).length;
    const incorrect = rating.filter((x) => x === -1).length;
    const cancelled = answers.filter((x) => x === null).length;

    return { score, correct, incorrect, cancelled } as Result;
  }
}
