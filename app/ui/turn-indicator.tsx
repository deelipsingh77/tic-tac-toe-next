import clsx from "clsx";

function TurnIndicator({ turn }:{ turn: boolean }) {
  return (
        <h1
          className={clsx("text-2xl", {
            "text-green-500": turn,
            "text-red-500": !turn,
          })}
        >
          {turn ? "Your Turn" : "Opponents Turn"}
        </h1>
  )
}
export default TurnIndicator