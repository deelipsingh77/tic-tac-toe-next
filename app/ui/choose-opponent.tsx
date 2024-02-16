interface ChooseOpponentProps {
  joinRoom: () => void;
  setJoinStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseOpponent: React.FC<ChooseOpponentProps> = ({ joinRoom, setJoinStatus }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex shadow-xl w-60 flex-col gap-10">
        <h1 className="text-center font-sans text-2xl">Select Opponent</h1>
        <div className="flex flex-col items-center gap-5 mb-10">
          <button
            className="border-4 p-4 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white w-36"
            onClick={() => {
              joinRoom();
              setJoinStatus((prev)=>!prev)
            }}
          >
            Play Online
          </button>
          <button
            className="border-4 p-4 rounded-2xl shadow-lg hover:bg-green-500 hover:text-white w-36"
            onClick={() => {
              joinRoom();
            }}
          >
            Play with Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseOpponent;
