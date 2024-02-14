import clsx from "clsx";

function GameBoard({ gameBoard, handleClick }: { gameBoard: string[], handleClick:(event: React.MouseEvent<HTMLButtonElement>) => void}) {
  return (
    <div className="container">
      {gameBoard.map((cell: string, index: number) => (
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
  );
}
export default GameBoard;
