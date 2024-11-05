import { useState } from "react";
import "react-circular-progressbar/dist/styles.css";

export const MultiPlayer = ({ load }: { load: (bool: boolean) => void }) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="m-8 w-full p-4 border border-white">
      <h1 className="text-xl font-bold">MultiPlayer Setup</h1>
      <main className="flex flex-col gap-4 w-full mt-2">
        <div className="flex justify-center items-center max-w-[350px] select-none space-x-2">
          <label className="relative cursor-pointer">
            <input
              type="radio"
              name="engine"
              value="join"
              checked={selectedOption === "join"}
              onChange={() => handleOptionChange("join")}
              className="absolute opacity-0 inset-0"
            />
            <span
              className={`flex flex-col items-center justify-center w-20 min-h-[80px] rounded-md border-2 shadow-md transition ease-linear group ${
                selectedOption === "join"
                  ? "border-[#b922ff] text-[#b922ff]"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border-2 absolute top-1 left-1 transition duration-200 ${
                  selectedOption === "join"
                    ? "bg-[#b922ff] border-[#b922ff] opacity-100 transform scale-100"
                    : "bg-white border-gray-300 opacity-0 transform scale-0"
                }`}
              ></span>
              <span className="radio-icon flex justify-center items-center w-full">
                <i
                  className={`fa-solid fa-users ${
                    selectedOption === "join"
                      ? "fill-[#5c0549]"
                      : "fill-gray-600"
                  }`}
                ></i>
              </span>
              <span className="radio-label text-lg text-center my-2">Join</span>
            </span>
          </label>

          <label className="relative cursor-pointer">
            <input
              type="radio"
              name="engine"
              value="new"
              checked={selectedOption === "new"}
              onChange={() => handleOptionChange("new")}
              className="absolute opacity-0 inset-0"
            />
            <span
              className={`flex flex-col items-center justify-center w-20 min-h-[80px] rounded-md border-2 shadow-md transition ease-linear group ${
                selectedOption === "new"
                  ? "border-[#b922ff] text-[#b922ff]"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border-2 absolute top-1 left-1 transition duration-200 ${
                  selectedOption === "new"
                    ? "bg-[#b922ff] border-[#b922ff] opacity-100 transform scale-100"
                    : "bg-white border-gray-300 opacity-0 transform scale-0"
                }`}
              ></span>
              <span className="radio-icon flex justify-center items-center w-full">
                <i
                  className={`fa-regular fa-square-plus ${
                    selectedOption === "new"
                      ? "fill-[#5c0549]"
                      : "fill-gray-600"
                  }`}
                ></i>
              </span>
              <span className="radio-label text-lg text-center my-2">New</span>
            </span>
          </label>
        </div>
        {selectedOption.length !== 0 && (
          <div className="flex justify-center items-center max-w-[350px] select-none space-x-2">
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="engine"
                value="random"
                checked={roomType === "random"}
                onChange={() => setRoomType("random")}
                className="absolute opacity-0 inset-0"
              />
              <span
                className={`flex flex-col items-center justify-center w-20 min-h-[80px] rounded-md border-2 shadow-md transition ease-linear group ${
                  roomType === "random"
                    ? "border-[#b922ff] text-[#b922ff]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border-2 absolute top-1 left-1 transition duration-200 ${
                    roomType === "random"
                      ? "bg-[#b922ff] border-[#b922ff] opacity-100 transform scale-100"
                      : "bg-white border-gray-300 opacity-0 transform scale-0"
                  }`}
                ></span>
                <span className="radio-icon flex justify-center items-center w-full">
                  <i
                    className={`fa-solid fa-globe ${
                      roomType === "random" ? "fill-[#5c0549]" : "fill-gray-600"
                    }`}
                  ></i>
                </span>
                <span className="radio-label text-lg text-center my-2">
                  Random
                </span>
              </span>
            </label>

            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="engine"
                value="friend"
                checked={roomType === "friend"}
                onChange={() => setRoomType("friend")}
                className="absolute opacity-0 inset-0"
              />
              <span
                className={`flex flex-col items-center justify-center w-20 min-h-[80px] rounded-md border-2 shadow-md transition ease-linear group ${
                  roomType === "friend"
                    ? "border-[#b922ff] text-[#b922ff]"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                <span
                  className={`w-3 h-3 rounded-full border-2 absolute top-1 left-1 transition duration-200 ${
                    roomType === "friend"
                      ? "bg-[#b922ff] border-[#b922ff] opacity-100 transform scale-100"
                      : "bg-white border-gray-300 opacity-0 transform scale-0"
                  }`}
                ></span>
                <span className="radio-icon flex justify-center items-center w-full">
                  <i
                    className={`fa-solid fa-link ${
                      roomType === "friend" ? "fill-[#5c0549]" : "fill-gray-600"
                    }`}
                  ></i>
                </span>
                <span className="radio-label text-lg text-center my-2">
                  Friend
                </span>
              </span>
            </label>
          </div>
        )}
        {roomType.length !== 0 && (
          <div className="w-full flex justify-center">
            {roomType === "random" ? (
              selectedOption === "new" ? (
                <button className="button" onClick={() => load(true)}>Create</button>
              ) : (
                <button className="button">Join Room</button>
              )
            ) : (
              <button className="button">something</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
