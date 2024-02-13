import React, { useRef, useState } from "react";

interface ChoosePieceProps {
  joinRoomFunction: (player: string, roomField: string) => void;
}

const ChoosePiece: React.FC<ChoosePieceProps> = ({
  joinRoomFunction,
}) => {
  const [roomField, setRoomField] = useState<string>("");
  const roomRef: any = useRef();

  return (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center">
      <div className="flex shadow-xl w-60 h-72 flex-col gap-10">
        <h1 className="text-center font-sans text-2xl">Choose Piece</h1>
        <div className="flex flex-col items-center gap-5">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomField}
            onChange={(e) => {
              setRoomField(e.target.value);
            }}
            className="text-center outline-none"
            ref={roomRef}
          />
          <button
            className="border-4 p-4 rounded-2xl shadow-lg hover:bg-slate-500 hover:text-white w-36"
            onClick={() => {
              joinRoomFunction("X", roomRef.current.value);
            }}
          >
            X
          </button>
          <button
            className="border-4 p-4 rounded-2xl shadow-lg hover:bg-slate-500 hover:text-white w-36"
            onClick={() => {
              joinRoomFunction("O", roomRef.current.value);
            }}
          >
            O
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePiece;
