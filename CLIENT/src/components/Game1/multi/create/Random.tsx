import { useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue, push, update, remove } from "firebase/database";
import { useAuth } from "../../../../context";
import { FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface RandomProps {
  diff: string;
  duration: string;
  roomtype: string;
}

export const Random = ({ diff, duration, roomtype }: RandomProps) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const roomRef = push(ref(realDb, "randomrooms"));
      const newRoomId = roomRef.key;
      setRoomId(newRoomId);

      // Create a new room with initial data
      set(roomRef, {
        creatorId: user.id,
        creatorName: user.username,
        diff,
        duration,
        roomtype,
        users: { [user.id]: user.username },
        status: "waiting",
      });

      // Listen for users joining the room
      const unsubscribe = onValue(
        ref(realDb, `randomrooms/${newRoomId}/users`),
        (snapshot) => {
          const userList = snapshot.val();
          setUsers(userList || {});
        }
      );

      // Cleanup function to delete room on unmount
      return () => {
        unsubscribe();
        if (newRoomId) {
          remove(ref(realDb, `randomrooms/${newRoomId}`));
        }
      };
    }
  }, [diff, duration, roomtype, user]);

  // Function to start the game (only accessible by the creator)
  const handleStartGame = () => {
    if (roomId && user?.id) {
      update(ref(realDb, `randomrooms/${roomId}`), {
        status: "in-progress",
      });
    }
  };

  // Function to delete the room and navigate back
  const handleBackToHome = () => {
    if (roomId) {
      remove(ref(realDb, `randomrooms/${roomId}`));
    }
    window.history.back();
  };

  const isCreator = user?.id === Object.keys(users)[0];
  const totalUsers = Object.keys(users).length;

  return (
    <div className="flex flex-col items-center p-8 text-white rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Room ID: {roomId}</h2>
      <p className="text-lg mb-4">Waiting for players to join...</p>

      {/* Display users with icons */}
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

      {/* Start game button for creator */}
      {isCreator && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStartGame}
          className="bg-purple-500 text-white px-6 py-2 rounded-md mt-4"
        >
          Start Game
        </motion.button>
      )}

      {/* Back to home button */}
      <button
        onClick={handleBackToHome}
        className="mt-4 text-purple-300 underline"
      >
        Back to Home
      </button>
    </div>
  );
};
