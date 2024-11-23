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

Hey there\\! I just completed a typing challenge with difficulty ${difficulty} in ${duration} seconds and scored ${wpm} WPM\\!

Want to challenge yourself too\\? Try it out on this bot: @${botUsername}

Good luck\\! 👾
`;

export const gameOverCaption = (
  wpm: number,
  accuracy: number,
  missedChars: number,
  newChars: number,
  status: string,
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
- Status: ${status}\`||

🔥 **Your WPM:** ***${wpm} WPM*** 🚀

> _"Success is the sum of small efforts, repeated day in and day out\\."_ Keep it up\\!
`;
