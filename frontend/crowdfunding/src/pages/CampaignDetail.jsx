import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x14a8269174248742eb8370b4bebafffc60f3491b";

const CampaignDetail = () => {
  const { id } = useParams();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const [campaign, setCampaign] = useState(null);
  const [donation, setDonation] = useState("");

  const fetchCampaign = async () => {
    if (!contract) return;
    try {
      const campaigns = await contract.call("getCampaigns");
      setCampaign(campaigns[id]);
    } catch (err) {
      console.error(" Error fetching campaign:", err);
    }
  };

  const donateToCampaign = async () => {
    if (!contract || !donation) return;
    try {
      await contract.call("donateToCampaign", [id], {
        value: ethers.utils.parseEther(donation),
      });
      alert(" Donation successful!");
      setDonation("");
      fetchCampaign();
    } catch (err) {
      console.error(" Donation error:", err);
      alert("Something went wrong during the donation.");
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [contract]);

  if (!campaign) return <div style={loadingStyle}>Loading campaign details...</div>;

  const progress = (campaign.amountCollected / campaign.target) * 100;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}> {campaign.title}</h1>

      <img
        src={campaign.image}
        alt={campaign.title}
        style={imageStyle}
      />

      <p style={descStyle}>{campaign.description}</p>

      <div style={infoGrid}>
        <p><strong>Owner:</strong> {campaign.owner}</p>
        <p><strong>Target:</strong> {ethers.utils.formatEther(campaign.target)} ETH</p>
        <p><strong>Collected:</strong> {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
      </div>

      <div style={progressBarContainer}>
        <div style={{ ...progressBarFill, width: `${progress}%` }}></div>
      </div>
      <p style={progressText}>{Math.floor(progress)}% funded</p>

      <input
        type="text"
        placeholder="Enter amount in ETH"
        value={donation}
        onChange={(e) => setDonation(e.target.value)}
        style={inputStyle}
      />
      <button
        onClick={donateToCampaign}
        style={donateBtn}
      >
        💸 Donate
      </button>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem",
  background: "#111",
  color: "#fff",
  borderRadius: "10px",
  minHeight: "100vh",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "1rem",
};

const imageStyle = {
  width: "100%",
  height: "350px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "1rem",
};

const descStyle = {
  fontSize: "1.1rem",
  marginBottom: "1rem",
  lineHeight: "1.5",
};

const infoGrid = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "1rem",
  gap: "1rem",
  flexWrap: "wrap",
};

const progressBarContainer = {
  height: "10px",
  width: "100%",
  backgroundColor: "#333",
  borderRadius: "5px",
  overflow: "hidden",
  marginBottom: "0.5rem",
};

const progressBarFill = {
  height: "100%",
  backgroundColor: "#4ade80",
};

const progressText = {
  marginBottom: "1.5rem",
  fontSize: "0.9rem",
  color: "#ccc",
};

const inputStyle = {
  width: "100%",
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #444",
  background: "#1a1a1a",
  color: "#fff",
  marginBottom: "1rem",
};

const donateBtn = {
  width: "100%",
  padding: "1rem",
  backgroundColor: "#4caf50",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
};

const loadingStyle = {
  color: "#fff",
  padding: "2rem",
  fontSize: "1.2rem",
};

export default CampaignDetail;
