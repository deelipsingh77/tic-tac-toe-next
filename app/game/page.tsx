"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";
import ChooseOpponent from "@/app/ui/choose-opponent";
import io from "socket.io-client";
import TurnIndicator from "@/app/ui/turn-indicator";
import GameBoard from "@/app/ui/game-board";

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
  const [opponentConnected, setOpponentConnected] = useState<boolean>(false);
  const [roomPass, setRoomPass] = useState({
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
      setOpponentConnected(true);
    });

    socket.on("roomDetails", (newRoom) => {
      setGameBoard(newRoom.gameBoard);
      if (newRoom.turn === roomPass.player) {
        setTurn(true);
      } else {
        setTurn(false);
      }
      console.log(newRoom);
    });

    socket.on(
      "gameResult",
      ({ winner, isDraw }: { winner: string; isDraw: boolean }) => {
        setWinner(winner);
        setIsDraw(isDraw);
      }
    );

    socket.on("joinRoomResponse", (newRoom) => {
      if (newRoom.sender === roomPass.sender) {
        setRoomPass(newRoom);
      }
    });

    socket.on("opponentLeft", () => {
      setOpponentConnected(false);
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
  }, [roomPass]);

  const handleMove = (index: number) => {
    socket.emit("move", {
      index: index,
      player: roomPass.player,
      roomId: roomPass.roomId,
      sender: socket.id,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (turn && !winner && !isDraw) {
      button.innerText = roomPass.player;
      handleMove(parseInt(button.id));
      setTurn(false);
    }
  };

  const joinRoom = (player: string = "", roomField: string = "") => {
    const newRoom = {
      roomId: roomField,
      sender: socket.id,
      player: player,
    };
    setRoomPass(newRoom);
    setGameStart(false);
    socket.emit("join_room", newRoom);
  };

  const leaveRoom = () => {
    socket.emit("leave_room", roomPass);
    setRoomPass((prev) => {
      return { ...prev, roomId: "" };
    });
    setJoinStatus(false);
  };

  return joinStatus ? (
    <div className="h-screen flex justify-center items-center flex-col gap-10">
      {winner || isDraw ? (
        isDraw ? (
          <h1 className="text-blue-500 text-2xl">It's a Tie</h1>
        ) : (
          <h1
            className={clsx("text-2xl", {
              "text-green-500": roomPass.player === winner,
              "text-red-500": roomPass.player !== winner,
            })}
          >
            {roomPass.player === winner ? "You Win" : "You Lose"}
          </h1>
        )
      ) : gameStart ? (
        opponentConnected ? (
          <TurnIndicator turn={turn} />
        ) : (
          <h1 className="text-2xl text-red-500">Opponent Left</h1>
        )
      ) : (
        <h1 className="text-2xl text-blue-500">Waiting For Opponent</h1>
      )}

      <GameBoard gameBoard={gameBoard} handleClick={handleClick} />
      <div>
        {(winner || isDraw) && (
          <button className="border-4 p-4 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white w-36">
            Play Again
          </button>
        )}

        {!opponentConnected && (
          <button
            className="border-4 p-4 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white w-36"
            onClick={() => {
              joinRoom();
            }}
          >
            New Game
          </button>
        )}

        <button
          className="border-4 p-4 rounded-2xl shadow-lg hover:bg-red-500 hover:text-white w-36"
          onClick={leaveRoom}
        >
          Quit
        </button>
      </div>
    </div>
  ) : (
    <ChooseOpponent joinRoom={joinRoom} setJoinStatus={setJoinStatus} />
  );
}
