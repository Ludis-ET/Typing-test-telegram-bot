import { useCallback, useEffect, useState } from "react";
import { realDb } from "../../../../firebaseConfig";
import { ref, set, push, onValue } from "firebase/database";
import { useAuth } from "../../../../context";
import { FaUserCircle } from "react-icons/fa";

export const JoinRoomRandom = () => {
  const [rooms, setRooms] = useState<{ id: string; creatorName: string }[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const { user } = useAuth();

  
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

  
  const joinRoom = useCallback((roomId: string) => {
    const userRef = ref(realDb, `randomrooms/${roomId}/users`);
    const newUserRef = push(userRef);
    set(newUserRef, user?.username);
    setSelectedRoomId(roomId);
    setHasJoinedRoom(true);

    
    onValue(ref(realDb, `randomrooms/${roomId}/users`), (snapshot) => {
      const userList = snapshot.val();
      setUsers(userList ? Object.values(userList) : []);
    });
  }, [user]);
  
  useEffect(() => {
    if (rooms.length > 0 && !hasJoinedRoom && user) {
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
      joinRoom(randomRoom.id);
    }
  }, [rooms, hasJoinedRoom, user, joinRoom]);

  return (
    <div className="p-6 text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Join a Random Room</h2>

      {rooms.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-300">
            No rooms available at the moment.
          </p>
          <p className="text-gray-400 mt-2">
            Please check back later or create a new room.
          </p>
        </div>
      ) : selectedRoomId ? (
        <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">
            Room ID: {selectedRoomId}
          </h3>
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
