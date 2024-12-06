import Room from "./models/Room";

interface Player {
  telegramId: number;
  username?: string;
  isCreator?: boolean;
}

export const createRoom = async (
  type: "random" | "friend",
  roomId: string,
  player: Player
) => {
  const newRoom = new Room({
    _id: roomId,
    type,
    players: [player],
    isAvailable: true,
    createdAt: new Date(),
  });
  await newRoom.save();
};

export const addPlayerToRoom = async (roomId: string, player: Player) => {
  const room = await Room.findById(roomId);
  if (room && room.players.length < 10) {
    room.players.push(player);
    if (room.players.length >= 2) {
      room.isAvailable = false;
    }
    await room.save();
  } else {
    throw new Error("Room not found or is full");
  }
};

export const fetchRoom = async (criteria: Record<string, any>) => {
  return await Room.findOne(criteria);
};

export const updateRoomAvailability = async (
  roomId: string,
  isAvailable: boolean
) => {
  await Room.findByIdAndUpdate(roomId, { isAvailable });
};
