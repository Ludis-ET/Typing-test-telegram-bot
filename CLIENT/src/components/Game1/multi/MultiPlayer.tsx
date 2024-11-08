import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue, push, update } from "firebase/database";

export const MultiPlayer = ({
  diff,
  duration,
  home,
  roomtype,
  selected,
}: {
  diff: string;
  duration: string;
  home: () => void;
  roomtype: string;
  selected: string;
}) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [canStart, setCanStart] = useState<boolean>(false);
  const {} = useauth

  useEffect(() => {
    if (selected === "friend" || selected === "people") {
      const roomRef = push(ref(db, "rooms"));
      const newRoomId = roomRef.key;
      setRoomId(newRoomId);
      setIsCreator(true);

      set(roomRef, {
        diff,
        duration,
        roomtype,
        users: {},
        status: "waiting",
      });

      const unsubscribe = onValue(
        ref(db, `rooms/${newRoomId}/users`),
        (snapshot) => {
          const userList = snapshot.val();
          setUsers(userList ? Object.values(userList) : []);
        }
      );

      return () => unsubscribe();
    }
  }, [selected, diff, duration, roomtype]);

  const joinRoom = (roomId: string) => {
    const userRef = ref(db, `rooms/${roomId}/users`);
    const newUserRef = push(userRef);
    set(newUserRef, `User${Math.floor(Math.random() * 1000)}`);
  };

  const startGame = () => {
    if (isCreator && roomId) {
      update(ref(db, `rooms/${roomId}`), { status: "started" });
      setCanStart(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">MultiPlayer Room</h2>

      {roomId && (
        <div>
          <p className="mb-2">Room ID: {roomId}</p>
          {selected === "friend" && (
            <p>Share this code with a friend to join.</p>
          )}
        </div>
      )}

      <h3 className="text-lg font-semibold mt-4">
        Waiting for players to join...
      </h3>

      <ul className="mt-4">
        {users.map((user, index) => (
          <li key={index} className="text-gray-700">
            {user}
          </li>
        ))}
      </ul>

      {isCreator && (
        <button
          onClick={startGame}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          disabled={users.length < 2 || canStart}
        >
          Start Game
        </button>
      )}

      <button
        onClick={home}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md"
      >
        Back to Home
      </button>
    </div>
  );
};
