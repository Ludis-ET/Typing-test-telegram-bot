import { useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, push, onValue } from "firebase/database";
import { useAuth } from "../../../../context";

export const JoinRoomRandom = () => {
  const [rooms, setRooms] = useState<{ id: string; creatorName: string }[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const { user } = useAuth();

  // Fetch available random rooms
  useEffect(() => {
    const roomsRef = ref(realDb, "randomrooms");
    onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      const roomsList = roomsData
        ? Object.entries(roomsData).map(([id, room]) => ({
            id,
            creatorName: (room as { creatorName: string }).creatorName,
          }))
        : [];
      setRooms(roomsList);
    });
  }, []);

  // Join the selected room
  const joinRoom = (roomId: string) => {
    if (user) {
      const userRef = ref(realDb, `randomrooms/${roomId}/users`);
      const newUserRef = push(userRef);
      set(newUserRef, user.username);
      setSelectedRoomId(roomId);

      // Listen for users in the selected room
      onValue(ref(realDb, `randomrooms/${roomId}/users`), (snapshot) => {
        const userList = snapshot.val();
        setUsers(userList ? Object.values(userList) : []);
      });
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Join a Random Room</h2>

      {/* Display list of available rooms */}
      <ul className="mb-6">
        {rooms.map((room) => (
          <li key={room.id} className="mb-2">
            <span className="mr-4">Room by: {room.creatorName}</span>
            <button
              onClick={() => joinRoom(room.id)}
              className="bg-purple-500 px-4 py-2 rounded-md"
            >
              Join Room
            </button>
          </li>
        ))}
      </ul>

      {/* Display users in the selected room */}
      {selectedRoomId && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Room ID: {selectedRoomId} - Users
          </h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
