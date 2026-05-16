// import MapApp from "./map/MapApp";
import SCMap from "./scMap/SCMap";
// TODO: chatbot

const App = () => {
  return (
    <div className="h-screen w-screen overflow-hidden flex">
      {/* <MapApp /> */}
      <SCMap />
    </div>
  );
};

export default App;
