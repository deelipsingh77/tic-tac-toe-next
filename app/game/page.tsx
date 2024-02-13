"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import ChoosePiece from "../ui/choose-piece";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Page() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [room, setRoom] = useState({
    roomId: "",
    sender: socket.id,
    player: "",
  });
  const [gameStart, setGameStart] = useState<boolean>(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("gameStart", (status) => {
      setGameStart(status);
    });

    socket.on("updateBoard", (newBoard) => {
      setGameBoard(newBoard);
      setTurn((prev) => !prev);
    });

    socket.on("handleTurns", (piece) => {
      if (piece == room.player) {
        setTurn((prev) => !prev);
      }
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("updateBoard");
      socket.off("connect_error");
    };
  }, [socket, room.player]);

  const handleMove = (index: number) => {
    socket.emit("move", {
      index: index,
      player: room.player,
      roomId: room.roomId,
      sender: socket.id,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (turn && !winner && !isDraw) {
      button.innerText = room.player;
      handleMove(parseInt(button.id));
    }
  };

  const joinRoom = (player: string, roomField: string) => {
    const newRoom = {
      roomId: roomField,
      sender: socket.id,
      player: player,
    };
    socket.emit("join_room", newRoom);
    setRoom(newRoom);
  };

  const leaveRoom = (roomField: string) => {
    socket.emit("leave_room", room);
    // setRoom((prev) => {
    //   return { ...prev, roomId: "" };
    // }); // Clear the room ID
  };

  return room.player ? (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center flex-col gap-10">
      {gameStart ? (
        turn ? (
          <h1 className="text-2xl text-green-500">Your Turn</h1>
        ) : (
          <h1 className="text-2xl text-red-500">Opponents Turn</h1>
        )
      ) : (
        <h1 className="text-2xl text-blue-500">Waiting For Opponent</h1>
      )}
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
    <ChoosePiece joinRoomFunction={joinRoom} />
  );
}
