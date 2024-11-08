import { useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";
import { useAuth } from "../../../../context";

interface RandomProps {
  diff: string;
  duration: string;
  roomtype: string;
}

export const Random = ({ diff, duration, roomtype }: RandomProps) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
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
          setUsers(userList ? Object.values(userList) : []);
        }
      );

      return () => unsubscribe();
    }
  }, [diff, duration, roomtype, user]);

  const joinRoom = () => {
    if (roomId && user) {
      const userRef = ref(realDb, `randomrooms/${roomId}/users/${user.id}`);
      set(userRef, user.username);
    }
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <p>Waiting for players to join...</p>
      <ul>
        {users.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
      <button
        onClick={joinRoom}
        disabled={!user || users.includes(user.username)}
      >
        Join Room
      </button>
    </div>
  );
};
