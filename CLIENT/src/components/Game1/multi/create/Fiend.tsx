import { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";

export const Friend = ({
  diff,
  duration,
  roomtype,
}: {
  diff: string;
  duration: string;
  roomtype: string;
}) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const roomRef = push(ref(db, "rooms"));
    setRoomId(roomRef.key);

    set(roomRef, {
      diff,
      duration,
      roomtype,
      users: {},
      status: "waiting",
    });

    const unsubscribe = onValue(
      ref(db, `rooms/${roomRef.key}/users`),
      (snapshot) => {
        const userList = snapshot.val();
        setUsers(userList ? Object.values(userList) : []);
      }
    );

    return () => unsubscribe();
  }, [diff, duration, roomtype]);

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <p>Share this code with a friend to join.</p>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};
