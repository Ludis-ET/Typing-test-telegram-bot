export const welcomeMessageCaption = (name: string): string => `
🎉 *Welcome to the Ultimate Typing Challenge, ${name}\\!* 🎉  

🚀 *Are you ready to prove your typing mastery\\?* 🚀  

> _Compete in various exciting modes:_  
\\- 🎮 *Single Player* — Test your skills against the clock\\.  
\\- 👥 *Multiplayer* — Challenge your friends for the ultimate glory\\.  
\\- 🎲 *Random Match* — Face off with players from around the world\\!  

💡 *How to Play:*  
1️⃣ *Choose your mode using the buttons below\\.  
2️⃣ *Follow the game instructions to complete your challenge\\.  
3️⃣ *Break your records and climb the leaderboard\\!*  

📖 *Let your typing journey begin now\\!*  

✨ _“Type\\, compete\\, and conquer\\!”_ ✨  
`;

export const SinglePlayerMessage = (): string => `
  🎮 *Welcome to Single Player Mode\\!*  

  Are you ready to test your typing skills and push your limits\\? 💪  
  Choose a difficulty level and let's see how fast you can type\\!

  Here are your options:

  \\\- *🟢 Easy*: For beginners to get warmed up\\.  
  \\\- *🟡 Medium*: A balanced challenge for steady progress\\.  
  \\\- *🔴 Hard*: Ready to push your limits and race against the clock\\!  
  \\\- *🔥 Nightmare*: Only for the brave, a real test of skill\\!

  Choose wisely, and prepare for an exciting typing journey\\!

  _Good luck, and have fun\\!_

  ✨ _“Type hard, type fast, and conquer the challenge\\!”_ ✨
`;

export const forwardText = (
  difficulty: string,
  duration: number,
  wpm: number,
  botUsername: string
) => `
🚀 *Challenge Completed\\!*

Hey there, friend\\! 🎉 I just completed a typing challenge with the following details:

> *Difficulty:* ${difficulty}
> *Duration:* ${duration} seconds
> *WPM:* ${wpm}

Want to compete with me and practice too\\? 💪 It's super fun\\!

**Try it out on this bot** and challenge yourself:  
[Click here to start\\!](https://t.me/${botUsername})

**Good luck\\!** 🔥 Let's see if you can beat my score\\! 👾

*Spoiler:* It's going to be tough, but I know you can do it\\! 😜
`;


export const gameOverCaption = (
  raw: number,
  wpm: number,
  accuracy: number,
  missedChars: number,
  newChars: number,
  timeTaken: number,
  difficulty: string,
  duration: string
): string => `
🎉 *Congratulations\\!*
> _You've just completed the challenge\\!_

||\`Game Stats:
- Difficulty: ${difficulty.toUpperCase()}
- Duration: ${duration} seconds
- Time Taken: ${timeTaken.toFixed(0)} seconds
- Missed Characters: ${missedChars}
- Accuracy: ${accuracy}%
- New Characters Typed: ${newChars}
- WPM: ${wpm} WPM
- Raw wpm: ${raw}\`||

🔥 **Your WPM:** ***${wpm} WPM*** 🚀

> _"Success is the sum of small efforts, repeated day in and day out\\."_ Keep it up\\!
`;
