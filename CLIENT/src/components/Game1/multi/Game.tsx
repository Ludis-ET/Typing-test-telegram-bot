interface GameProps {
  roomId: string;
  roomtype: string;
}

export const Game = ({ roomId, roomtype }: GameProps) => {
  return (
    <div>
      <h2>Game Room: {roomId}</h2>
      <p>Room Type: {roomtype}</p>
      <p>Players:</p>
      {/* Game logic and UI go here */}
    </div>
  );
};
