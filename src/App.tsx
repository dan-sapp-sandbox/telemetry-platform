import SCMap from "./scMap/SCMap";

const App = () => {
  return (
    <div className="h-[calc(100%-2.5rem)] md:h-screen w-screen overflow-hidden flex">
      <SCMap />
    </div>
  );
};

export default App;
