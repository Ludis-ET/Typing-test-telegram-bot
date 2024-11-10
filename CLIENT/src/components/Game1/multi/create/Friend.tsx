import { useCallback, useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue, update } from "firebase/database";
import { useAuth } from "../../../../context";
import { FaUserCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineCopy } from "react-icons/ai";

export const Friend = ({
  diff,
  duration,
  roomtype,
}: {
  diff: string;
  duration: string;
  roomtype: string;
}) => {
    console.log(diff, duration, roomtype);
  const [roomKey, setRoomKey] = useState<string | null>(null);
  const [users, setUsers] = useState<{ [id: string]: string }>({});
  const [status, setStatus] = useState<string>("waiting");
  const { user } = useAuth();

  useEffect(() => {
    if (user && !roomKey) {
      // Generate a unique room key
      const newRoomKey = uuidv4();
      setRoomKey(newRoomKey);

      // Create a new room and add the creator's details
      const roomRef = ref(realDb, `friendrooms/${newRoomKey}`);
      set(roomRef, {
        creatorName: user.username,
        creatorId: user.id,
        status: "waiting",
        users: {
          [user.id]: user.username, // Store the creator's ID-to-username mapping
        },
      });

      // Listen for updates to users in the room
      onValue(ref(realDb, `friendrooms/${newRoomKey}/users`), (snapshot) => {
        const userList = snapshot.val();
        setUsers(userList || {});
      });

      // Listen for status updates
      onValue(ref(realDb, `friendrooms/${newRoomKey}/status`), (snapshot) => {
        const currentStatus = snapshot.val();
        setStatus(currentStatus || "waiting");
      });
    }
  }, [user, roomKey]);

  const copyRoomKey = () => {
    if (roomKey) {
      navigator.clipboard.writeText(roomKey);
      alert("Room key copied to clipboard!");
    }
  };

  const addUserToRoom = useCallback(() => {
    if (roomKey && user) {
      // Update the 'users' object in Firebase with the new user's ID-to-username mapping
      const userRef = ref(realDb, `friendrooms/${roomKey}/users`);
      update(userRef, {
        [user.id]: user.username,
      });
    }
  }, [roomKey, user]);

  useEffect(() => {
    // Automatically add user when the room key is available and the user has joined
    if (roomKey) {
      addUserToRoom();
    }
  }, [roomKey, addUserToRoom]);

  const startGame = () => {
    if (roomKey && user) {
      const roomRef = ref(realDb, `friendrooms/${roomKey}`);
      update(roomRef, {
        status: "started",
      });
    }
  };

  return (
    <div className="p-6 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Create a Friend Room</h2>

      {roomKey ? (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold mb-4">Room Key</h3>
          <p className="text-xl mb-4">{roomKey}</p>
          <button
            onClick={copyRoomKey}
            className="flex items-center justify-center bg-purple-500 px-4 py-2 rounded text-white font-medium hover:bg-purple-700"
          >
            <AiOutlineCopy className="mr-2" />
            Copy Key
          </button>

          <p className="mt-6 text-lg">Status: {status}</p>

          {status === "waiting" &&
            user?.id === users[Object.keys(users)[0]] && (
              <button
                onClick={startGame}
                className="mt-4 bg-green-500 px-4 py-2 rounded text-white font-medium hover:bg-green-700"
              >
                Start Game
              </button>
            )}

          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {Object.values(users).map((username, index) => (
              <div key={index} className="flex flex-col items-center">
                <FaUserCircle className="text-4xl text-purple-400" />
                <span className="text-sm">{username}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Total Players: {Object.keys(users).length}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
