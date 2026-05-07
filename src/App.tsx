import { useTheme } from "@/components/themeToggle/useTheme";
import NavBar from "./navBar/NavBar";
import MapApp from "./map/MapApp";
// TODO: chatbot

const App = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="h-screen w-full flex">
      <NavBar theme={theme} setTheme={setTheme} />
      <MapApp />
      {/* <div className="w-full bg-(--background)">
        <ProfileSection />
        <MapSection />
        <ReportBuilderSection />
        <ChartsSection theme={theme} />
        <UserMgmtSection />
        <ComponentLibrarySection />
      </div> */}
    </div>
  );
};

export default App;
