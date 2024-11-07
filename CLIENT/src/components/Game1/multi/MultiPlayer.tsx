import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { ref, set, onValue, push } from "firebase/database";

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

  useEffect(() => {
    if (selected === "new") {
        
      const roomRef = push(ref(db, "rooms")); 
      setRoomId(roomRef.key); 

      // Set initial room data
      set(roomRef, {
        diff,
        duration,
        roomtype,
        users: [], // Initial empty users array
      });

      // Listen for changes in the users array
      const unsubscribe = onValue(
        ref(db, `rooms/${roomRef.key}/users`),
        (snapshot) => {
          const userList = snapshot.val();
          setUsers(userList ? Object.values(userList) : []);
        }
      );

      // Clean up listener on component unmount
      return () => unsubscribe();
    }
  }, [selected, diff, duration, roomtype]);

  return (
    <div>
      <h2>MultiPlayer Room</h2>
      {roomId && <p>Room ID: {roomId}</p>}
      <h3>Waiting for players to join...</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <button onClick={home}>Back to Home</button>
    </div>
  );
};
