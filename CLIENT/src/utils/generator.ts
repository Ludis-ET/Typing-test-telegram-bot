const commonWords = ["the", "and", "of", "to", "in", "it", "is", "that"];

export function generateParagraph(level: number): string {
  let words: string[] = [];
  switch (level) {
    case 1:
      words = commonWords.slice(0, 50 + Math.floor(Math.random() * 50));
      break;
    case 2:
      words = [
        ...commonWords.slice(0, 25),
        "require",
        "balance",
        "complicated",
      ];
      break;
    case 3:
      words = ["necessary", "complexity", "parameterization"]; 
      break;
    case 4:
      words = ["juxtaposition", "onomatopoeia"];
      break;
    default:
      words = commonWords.slice(0, 50);
  }
  return words.join(" ");
}
