"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParagraph = void 0;
const easy_1 = require("./words/easy");
const hard_1 = require("./words/hard");
const medium_1 = require("./words/medium");
const nightmare_1 = require("./words/nightmare");
const getWordsBasedOnDifficulty = (difficulty) => {
    switch (difficulty) {
        case "easy":
            return easy_1.easyWords;
        case "medium":
            return medium_1.mediumWords;
        case "hard":
            return hard_1.hardWords;
        case "nightmare":
            return nightmare_1.nightmareWords;
        default:
            return easy_1.easyWords;
    }
};
const generateRandomParagraph = (words, wordCount) => {
    let paragraph = "";
    for (let i = 0; i < wordCount; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        paragraph += randomWord + " ";
    }
    return paragraph.trim();
};
const getWordCountBasedOnDuration = (duration) => {
    switch (duration) {
        case "15sec":
            return 20;
        case "30sec":
            return 40;
        case "1min":
            return 60;
        case "3min":
            return 120;
        default:
            return 20;
    }
};
const generateParagraph = (difficulty, options) => {
    const words = getWordsBasedOnDifficulty(difficulty);
    if (options.textCount) {
        return generateRandomParagraph(words, parseInt(options.textCount));
    }
    else if (options.duration) {
        const wordCount = getWordCountBasedOnDuration(options.duration);
        return generateRandomParagraph(words, wordCount);
    }
    else {
        throw new Error("Either wordCount or duration must be provided.");
    }
};
exports.generateParagraph = generateParagraph;
