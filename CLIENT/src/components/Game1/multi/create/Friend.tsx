import { useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue } from "firebase/database";
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
  const [users, setUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Create a friend room and generate a unique room key
    if (user && !roomKey) {
      const newRoomKey = uuidv4();
      setRoomKey(newRoomKey);

      // Set the creator in the room
      const roomRef = ref(realDb, `friendrooms/${newRoomKey}`);
      set(roomRef, {
        creatorName: user.username,
        users: {
          [user.username]: true,
        },
      });

      // Listen for users joining the room
      onValue(ref(realDb, `friendrooms/${newRoomKey}/users`), (snapshot) => {
        const userList = snapshot.val();
        setUsers(userList ? Object.keys(userList) : []);
      });
    }
  }, [user, roomKey]);

  // Function to copy the room key to clipboard
  const copyRoomKey = () => {
    if (roomKey) {
      navigator.clipboard.writeText(roomKey);
      alert("Room key copied to clipboard!");
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

          <p className="mt-6 text-lg">Waiting for a friend to join...</p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
