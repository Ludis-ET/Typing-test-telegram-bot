interface GameProps {
  roomId: string;
  diff: string;
  duration: string;
  roomtype: string;
  users: { [key: string]: string };
}

export const Game = ({ roomId, diff, duration, roomtype, users }: GameProps) => {
  return (
    <div>
      <h2>Game Room: {roomId}</h2>
      <p>Difficulty: {diff}</p>
      <p>Duration: {duration}</p>
      <p>Room Type: {roomtype}</p>
      <p>Players:</p>
      <ul>
        {Object.entries(users).map(([userId, username]) => (
          <li key={userId}>{username}</li>
        ))}
      </ul>
      {/* Game logic and UI go here */}
    </div>
  );
};
