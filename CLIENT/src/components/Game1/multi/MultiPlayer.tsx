import { Random as CreateRandom } from "./create/Random";
import { JoinRoomRandom } from "./join/Random";

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
  console.log("MultiPlayer", diff, duration, roomtype, selected);
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">MultiPlayer Room</h2>

      {selected === "new" && roomtype === "random" && (
        <CreateRandom diff={diff} duration={duration} roomtype={roomtype} />
      )}
      {/* {selected === "create" && roomtype === "friend" && (
        <CreateRoomFriend diff={diff} duration={duration} roomtype={roomtype} />
      )} */}
      {selected === "join" && roomtype === "random" && (
        <JoinRoomRandom />
      )}
      {/* {selected === "join" && roomtype === "friend" && roomId && (
        <JoinRoomFriend roomId={roomId} />
      )} */}

      <button
        onClick={home}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md"
      >
        Back to Home
      </button>
    </div>
  );
};
