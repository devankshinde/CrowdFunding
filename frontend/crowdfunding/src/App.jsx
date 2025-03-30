import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import CreateCampaign from "./pages/CreateCampaign";
import ViewCampaigns from "./pages/ViewCampaigns";
import Donations from "./pages/Donations";
import MyCampaigns from "./pages/MyCampaigns"; // <-- Make sure this file exists

const App = () => {
  const [activePage, setActivePage] = useState("create");

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#111", color: "#fff" }}>
      <Sidebar setActivePage={setActivePage} />
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {activePage === "create" && <CreateCampaign />}
        {activePage === "view" && <ViewCampaigns />}
        {activePage === "donate" && <Donations />}
        {activePage === "my" && <MyCampaigns />}
      </div>
    </div>
  );
};

export default App;
