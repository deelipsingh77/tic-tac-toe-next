"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
// import { getSocket, initSocket } from "@/app/lib/socket";
import ChoosePiece from "../ui/choose-piece";
// import { Socket } from "socket.io-client";
import io from "socket.io-client";

const socket = io('http://localhost:5000')

export default function Page() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [piece, setPiece] = useState<string>("");
  const [turn, setTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>("");
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [room, setRoom] = useState({ roomId: "" });

  // useEffect(() => {
  //   initSocket();
  //   socket = getSocket(); // Assign the initialized socket

  //   // Clean-up function to disconnect the socket when the component unmounts
  //   return () => {
  //     socket?.disconnect();
  //   };
  // }, []);

  useEffect(() => {
    // if (!socket) return; // Make sure socket is defined before using it

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    socket.on("updateBoard", (newBoard) => {
      console.log(newBoard);
      setGameBoard(newBoard);
      // setTurn((prev) => !prev);
    });

    socket.on("connect_error", (error) => {
      console.log("Connection error:", error);
    });

    // Clean-up function to remove event listeners when the component unmounts
    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("updateBoard");
      socket?.off("connect_error");
    };
  }, [socket]); // Make sure to include socket in the dependency array

  const handleMove = (index: number) => {
    // if (!socket) {
    //   socket = getSocket();
    // } // Make sure socket is defined before using it

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
    <ChoosePiece setRoomFunction={setRoom} setPieceFunction={setPiece} />
  );
}
