"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveGameSettings = exports.updateRoomAvailability = exports.fetchRoom = exports.addPlayerToRoom = exports.createRoom = void 0;
const Room_1 = __importDefault(require("./models/Room"));
const createRoom = (type, roomId, player) => __awaiter(void 0, void 0, void 0, function* () {
    const newRoom = new Room_1.default({
        _id: roomId,
        type,
        players: [player],
        isAvailable: true,
        createdAt: new Date(),
    });
    yield newRoom.save();
});
exports.createRoom = createRoom;
const addPlayerToRoom = (roomId, player) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findById(roomId);
    if (room && room.players.length < 10) {
        room.players.push(player);
        if (room.players.length >= 2) {
            room.isAvailable = false;
        }
        yield room.save();
    }
    else {
        throw new Error("Room not found or is full");
    }
});
exports.addPlayerToRoom = addPlayerToRoom;
const fetchRoom = (criteria) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Room_1.default.findOne(criteria);
});
exports.fetchRoom = fetchRoom;
const updateRoomAvailability = (roomId, isAvailable) => __awaiter(void 0, void 0, void 0, function* () {
    yield Room_1.default.findByIdAndUpdate(roomId, { isAvailable });
});
exports.updateRoomAvailability = updateRoomAvailability;
const saveGameSettings = (roomId, settings) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield Room_1.default.findById(roomId);
    if (!room) {
        throw new Error("Room not found");
    }
    room.gameSettings = settings;
    yield room.save();
});
exports.saveGameSettings = saveGameSettings;
