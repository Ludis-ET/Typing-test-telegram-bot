import Room from "./models/Room.js";

interface Player {
  telegramId: string;
  username?: string;
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
    createdAt: new Date(),
  });
  await newRoom.save();
};

export const addPlayerToRoom = async (roomId: "random" | "friend", player: Player) => {
  const room = await Room.findById(roomId);
  if (room && room.players.length < 10) {
    room.players.push(player);
    await room.save();
  } else {
    throw new Error("Room not found or is full");
  }
};

export const fetchRoom = async (criteria: Record<string, any>) => {
  return await Room.findOne(criteria);
};
