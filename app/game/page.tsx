"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import ChoosePiece from "../ui/choose-piece";
import io from "socket.io-client";

// Create a socket instance outside the component to ensure it's shared across renders
const socket = io("http://localhost:5000");

export default function Page() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [piece, setPiece] = useState<string>("");
  const [turn, setTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>("");
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [room, setRoom] = useState({ roomId: "" });
  const [ joined, setJoined ] = useState<boolean>(false);

  useEffect(() => {
    // Set up event listeners when the component mounts
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("updateBoard", (newBoard) => {
      console.log(newBoard);
      setGameBoard(newBoard);
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateBoard");
      socket.off("connect_error");
    };
  }, []);

  const handleMove = (index: number) => {
    socket.emit("move", {
      index: index,
      player: piece,
      roomId: room.roomId,
      sender: socket.id,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (turn && !winner && !isDraw) {
      button.innerText = piece;
      handleMove(parseInt(button.id));
    }
  };

  const joinRoom = (roomField: string) => {
    setJoined((prev) => !prev);
    const newRoom = {
      roomId: roomField,
      sender: socket.id
    }
    socket.emit("join_room", newRoom);
    setRoom(newRoom);
  };

  const leaveRoom = (roomField: string) => {
    socket.emit("leave_room", room);
    // setRoom((prev) => {
    //   return { ...prev, roomId: "" };
    // }); // Clear the room ID
    setJoined(false);
  };

  return piece ? (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center">
      <div className="container">
        {gameBoard.map((cell: number, index: number) => (
          <button
            className={clsx("cell-primary", {
              "border-right": [0, 1, 3, 4, 6, 7].includes(index),
              "border-top": [3, 4, 5, 6, 7, 8].includes(index),
            })}
            key={index}
            id={String(index)}
            onClick={handleClick}
          >
            {gameBoard[index]}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <ChoosePiece joinRoomFunction={joinRoom} setPieceFunction={setPiece} />
  );
}