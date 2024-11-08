import { useState } from "react";
import { db } from "../../../firebaseConfig";
import { ref, push } from "firebase/database";

export const Friend = ({ roomId }: { roomId: string }) => {
  const [users, setUsers] = useState<string[]>([]);

  const joinRoom = () => {
    const userRef = ref(db, `rooms/${roomId}/users`);
    const newUserRef = push(userRef);
    set(newUserRef, `User${Math.floor(Math.random() * 1000)}`);
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <p>Joining friend’s room...</p>
      <button onClick={joinRoom}>Join Friend Room</button>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};
