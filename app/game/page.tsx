"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import ChoosePiece from "../ui/choose-piece";
import io from "socket.io-client";
import TurnIndicator from "../ui/turn-indicator";
import GameBoard from "../ui/game-board";

const SERVER_URL: string =
  process.env.NEXT_PUBLIC_URL || "wss://tic-tac-toe-server-ykw6.onrender.com";

const socket = io(SERVER_URL);

export default function Page() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [joinStatus, setJoinStatus] = useState<boolean>(false);
  const [room, setRoom] = useState({
    roomId: "",
    sender: socket.id,
    player: "",
  });

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

    socket.on(
      "gameResult",
      ({ winner, isDraw }: { winner: string; isDraw: boolean }) => {
        setWinner(winner);
        setIsDraw(isDraw);
      }
    );

    socket.on("joinRoomResponse", (newRoom) => {
      if (newRoom.sender === room.sender) {
        setRoom(newRoom);
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
      socket.off("gameStart");
      socket.off("handleTurns");
    };
  }, [room]);

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

  const joinRoom = (player: string = "", roomField: string = "") => {
    const newRoom = {
      roomId: roomField,
      sender: socket.id,
      player: player,
    };
    socket.emit("join_room", newRoom);
  };

  const leaveRoom = (roomField: string) => {
    socket.emit("leave_room", room);
    // setRoom((prev) => {
    //   return { ...prev, roomId: "" };
    // }); // Clear the room ID
  };

  return joinStatus ? (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center flex-col gap-10">
      {winner || isDraw ? (
        isDraw ? (
          <h1 className="text-blue-500 text-2xl">The game is Draw</h1>
        ) : (
          <h1
            className={clsx("text-2xl", {
              "text-green-500": room.player === winner,
              "text-red-500": room.player !== winner,
            })}
          >
            {room.player === winner ? "You Win" : "You Lose"}
          </h1>
        )
      ) : gameStart ? (
        <TurnIndicator turn={turn} />
      ) : (
        <h1 className="text-2xl text-blue-500">Waiting For Opponent</h1>
      )}

      <GameBoard gameBoard={gameBoard} handleClick={handleClick} />
    </div>
  ) : (
    <ChoosePiece joinRoom={joinRoom} setJoinStatus={setJoinStatus} />
  );
}
