// src/pages/ViewCampaigns.jsx
import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x14a8269174248742eb8370b4bebafffc60f3491b";

const ViewCampaigns = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const [campaigns, setCampaigns] = useState([]);
  const [donationsMap, setDonationsMap] = useState({});
  const [selected, setSelected] = useState(null);

  const loadCampaigns = async () => {
    if (!contract) return;
    try {
      const data = await contract.call("getCampaigns");

      // Filter out completed campaigns
      const activeCampaigns = data.filter((c) =>
        ethers.BigNumber.from(c.amountCollected).lt(c.target)
      );
      setCampaigns(activeCampaigns);

      // Load donations per campaign
      const donationData = {};
      for (let i = 0; i < activeCampaigns.length; i++) {
        const [donators, amounts] = await contract.call("getDonators", [i]);
        const donationsWithTime = donators.map((addr, idx) => ({
          address: addr,
          amount: ethers.utils.formatEther(amounts[idx]),
          time: new Date().toLocaleString(), // Ideally you should use block.timestamp
        }));
        donationData[i] = donationsWithTime;
      }
      setDonationsMap(donationData);
    } catch (err) {
      console.error(" Failed to fetch campaigns", err);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [contract]);

  // =================== Detail View ===================
  if (selected !== null) {
    const campaign = campaigns[selected];
    const donations = donationsMap[selected] || [];
    const progress = Math.min(
      (ethers.BigNumber.from(campaign.amountCollected)
        .mul(100)
        .div(campaign.target)
      ).toNumber(),
      100
    );

    return (
      <div style={{ padding: "2rem" }}>
        <button onClick={() => setSelected(null)} style={btnBackStyle}>🔙 Back</button>
        <h2 style={titleStyle}>{campaign.title}</h2>
        <img src={campaign.image} alt={campaign.title} style={imgStyle} />
        <p><strong>Description:</strong> {campaign.description}</p>
        <p><strong>Owner:</strong> {campaign.owner}</p>
        <p><strong>Target:</strong> {ethers.utils.formatEther(campaign.target)} ETH</p>
        <p><strong>Collected:</strong> {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>

        <div style={progressContainer}>
          <div style={{ ...progressBar, width: `${progress}%` }} />
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ color: "#ccc" }}>Donors</h3>
          {donations.length === 0 ? (
            <p>No donations yet.</p>
          ) : (
            <ul>
              {donations.map((donor, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  <code>{donor.address}</code> donated <strong>{donor.amount} ETH</strong> at <em>{donor.time}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // =================== Campaign List ===================
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={titleStyle}> All Campaigns</h1>
      <div style={galleryStyle}>
        {campaigns.map((campaign, index) => {
          const progress = Math.min(
            (ethers.BigNumber.from(campaign.amountCollected)
              .mul(100)
              .div(campaign.target)
            ).toNumber(),
            100
          );

          return (
            <div key={index} style={cardStyle} onClick={() => setSelected(index)}>
              <img src={campaign.image} alt={campaign.title} style={imgStyle} />
              <h3 style={{ marginTop: "0.5rem" }}>{campaign.title}</h3>
              <p>{campaign.description.slice(0, 60)}...</p>
              <p><strong>Target:</strong> {ethers.utils.formatEther(campaign.target)} ETH</p>
              <p><strong>Collected:</strong> {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
              <div style={progressContainer}>
                <div style={{ ...progressBar, width: `${progress}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ========== Styles ==========

const titleStyle = {
  fontSize: "2rem",
  color: "#fff",
  marginBottom: "1rem",
};

const galleryStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: "1.5rem",
  width: "100%",
};

const cardStyle = {
  background: "#222",
  padding: "1rem",
  width: "300px",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#eee",
  transition: "transform 0.2s",
  boxShadow: "0 0 10px rgba(0,0,0,0.4)",
};

const imgStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "6px",
};

const btnBackStyle = {
  marginBottom: "1rem",
  padding: "0.5rem 1rem",
  background: "#555",
  border: "none",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
};

const progressContainer = {
  width: "100%",
  height: "8px",
  backgroundColor: "#555",
  borderRadius: "4px",
  marginTop: "8px",
};

const progressBar = {
  height: "100%",
  backgroundColor: "#00ff88",
  borderRadius: "4px",
};

export default ViewCampaigns;
