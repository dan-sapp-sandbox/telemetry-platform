import SCMap from "./scMap/SCMap";

const App = () => {
  return (
    <div className="pt-[env(safe-area-inset-top)] h-dvh md:h-screen w-screen overflow-hidden flex">
      <SCMap />
    </div>
  );
};

export default App;

// h-[95vh]
