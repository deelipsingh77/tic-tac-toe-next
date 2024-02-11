"use client";
import { useState } from "react";
import clsx from "clsx";

export default function Page() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string>("");
  const [isDraw, setIsDraw] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    if (isXNext && !winner && !isDraw) {
      button.innerText = 'X';
      setIsXNext(false);
    } else {
      button.innerText = 'O';
      setIsXNext(true);
    }
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex justify-center items-center">
      <div className="container">
        {gameBoard.map((cell: number, index: number) => (
          <button className={clsx('cell-primary', {
            'border-right': [0, 1, 3, 4, 6, 7].includes(index),
            'border-top': [3, 4, 5, 6, 7, 8].includes(index),
          })} key={index} id={String(index)} onClick={handleClick}>{" "}</button>
        ))}
      </div>
    </div>
  );
}

