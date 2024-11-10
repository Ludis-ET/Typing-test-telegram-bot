import { useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";
import { useAuth } from "../../../../context";
import { FaUserCircle } from "react-icons/fa";

export const FriendJoiner = () => {
  const [roomKey, setRoomKey] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const { user } = useAuth();

  const joinRoom = (key: string) => {
    if (user) {
      const roomRef = ref(realDb, `friendrooms/${key}`);

      onValue(
        roomRef,
        (snapshot) => {
          if (snapshot.exists()) {
            // Room exists, add user to the room
            const userRef = push(ref(realDb, `friendrooms/${key}/users`));
            set(userRef, user.username);
            setHasJoined(true);
            setError(null);

            // Listen for users in the joined room
            onValue(ref(realDb, `friendrooms/${key}/users`), (snapshot) => {
              const userList = snapshot.val();
              setUsers(userList ? Object.values(userList) : []);
            });
          } else {
            // Room doesn't exist
            setError("Room not found. Please check the key and try again.");
          }
        },
        { onlyOnce: true }
      );
    }
  };

  const handleJoin = () => {
    if (roomKey) {
      joinRoom(roomKey);
    } else {
      setError("Please enter a room key.");
    }
  };

  return (
    <div className="p-6 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Join a Friend Room</h2>

      {!hasJoined ? (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <input
            type="text"
            value={roomKey}
            onChange={(e) => setRoomKey(e.target.value)}
            placeholder="Enter Room Key"
            className="w-full px-4 py-2 mb-4 rounded text-black"
          />
          <button
            onClick={handleJoin}
            className="bg-purple-500 px-4 py-2 rounded text-white font-medium hover:bg-purple-700"
          >
            Join Room
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-4">Room ID: {roomKey}</h3>
          <p className="text-lg mb-4">Players in the room:</p>

          <div className="flex flex-wrap gap-4 justify-center">
            {users.map((username, index) => (
              <div key={index} className="flex flex-col items-center">
                <FaUserCircle className="text-4xl text-purple-400" />
                <span className="text-sm">{username}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Total Players: {users.length}
          </p>
        </div>
      )}
    </div>
  );
};
