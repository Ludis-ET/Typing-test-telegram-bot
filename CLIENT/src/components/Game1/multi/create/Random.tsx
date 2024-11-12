import { useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue, push, update, remove } from "firebase/database";
import { useAuth } from "../../../../context";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { Game } from "../Game";

interface RandomProps {
  diff: string;
  duration: string;
  roomtype: string;
}

export const Random = ({ diff, duration, roomtype }: RandomProps) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const [gameStarted, setGameStarted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const roomRef = push(ref(realDb, "randomrooms"));
      const newRoomId = roomRef.key;
      setRoomId(newRoomId);

      set(roomRef, {
        creatorId: user.id,
        creatorName: user.username,
        diff,
        duration,
        roomtype,
        users: { [user.id]: user.username },
        status: "waiting",
      });

      const unsubscribe = onValue(
        ref(realDb, `randomrooms/${newRoomId}/users`),
        (snapshot) => {
          const userList = snapshot.val();
          setUsers(userList || {});
        }
      );

      return () => {
        unsubscribe();
        if (newRoomId) {
          remove(ref(realDb, `randomrooms/${newRoomId}`));
        }
      };
    }
  }, [diff, duration, roomtype, user]);

  const handleStartGame = () => {
    if (roomId && user?.id) {
      update(ref(realDb, `randomrooms/${roomId}`), {
        status: "in-progress",
      });
      setGameStarted(true);
    }
  };

  const handleBackToHome = () => {
    if (roomId) {
      remove(ref(realDb, `randomrooms/${roomId}`));
    }
    window.history.back();
  };

  const totalUsers = Object.keys(users).length;

  if (gameStarted && roomId) {
    return (
      <Game
        roomId={roomId}
        roomtype="random"
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-8 text-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Room ID: {roomId}</h2>
      <p className="text-lg mb-4">Waiting for players to join...</p>
      <div className="flex flex-col items-center mb-4">
        <div className="flex flex-wrap justify-center gap-4">
          {Object.entries(users).map(([userId, username]) => (
            <div key={userId} className="flex flex-col items-center">
              <FaUserCircle className="text-4xl text-purple-400" />
              <span className="text-sm">{username}</span>
            </div>
          ))}
        </div>
        <p className="text-sm mt-2">Players joined: {totalUsers}</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStartGame}
        className="bg-purple-500 text-white px-6 py-2 rounded-md mt-4"
      >
        Start Game
      </motion.button>
      <button
        onClick={handleBackToHome}
        className="mt-4 text-purple-300 underline"
      >
        Back to Home
      </button>
    </div>
  );
};
