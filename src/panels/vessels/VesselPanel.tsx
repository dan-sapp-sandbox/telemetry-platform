const VesselPanel = () => {
  //TODO: timeseries data
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Vessels</div>
      <div>List of Vessels in BBox</div>
      <div>Go to Vessel</div>
      <div>Show/Hide Vessels</div>
      <div>Show/Hide Vessel Paths</div>
    </div>
  );
};

export default VesselPanel;
