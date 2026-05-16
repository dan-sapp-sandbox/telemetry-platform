import useCommandBar from "./useCommandBar";

const CommandBar = () => {
  const {} = useCommandBar();
  return (
    <div className="w-full h-10 md:h-32 bg-blue-400/20 p-4 text-(--text)">
      <div>AI Command Bar</div>
    </div>
  );
};

export default CommandBar;
