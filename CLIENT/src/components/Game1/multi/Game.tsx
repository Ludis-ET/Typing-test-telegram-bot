import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realDb } from "../../../firebaseConfig";

interface GameProps {
  roomId: string;
  roomtype: string;
}

export const Game = ({ roomId, roomtype }: GameProps) => {
  const [roomInfo, setRoomInfo] = useState<{
    creatorName: string;
    diff: string;
    duration: string;
    status: string;
    users: string[];
  } | null>(null);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (roomtype === "random") {
      const roomRef = ref(realDb, `randomrooms/${roomId}`);
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRoomInfo({
            creatorName: data.creatorName,
            diff: data.diff,
            duration: data.duration,
            status: data.status,
            users: Object.values(data.users || {}),
          });
        }
      });
    }
  }, [roomId, roomtype]);

  useEffect(() => {
    // Start countdown if room is "in-progress"
    if (roomInfo?.status === "in-progress" && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [roomInfo, countdown]);

  if (!roomInfo) {
    return <p>Loading room information...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Game Room: {roomId}</h2>
      <p className="text-lg mb-2">Room Type: {roomtype}</p>
      <p className="text-lg mb-2">Creator: {roomInfo.creatorName}</p>
      <p className="text-lg mb-2">Difficulty: {roomInfo.diff}</p>
      <p className="text-lg mb-2">Duration: {roomInfo.duration}</p>
      <p className="text-lg mb-2">Status: {roomInfo.status}</p>
      <p className="text-lg mb-4">Players:</p>

      <div className="flex flex-wrap gap-4">
        {roomInfo.users.map((username, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xl">{username}</span>
          </div>
        ))}
      </div>

      {roomInfo.status === "in-progress" && countdown > 0 ? (
        <div className="mt-6 text-center">
          <p className="text-2xl font-semibold">
            Starting in: {countdown} seconds
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {/* Place your main game UI here */}
          <p>The game has started!</p>
        </div>
      )}
    </div>
  );
};
