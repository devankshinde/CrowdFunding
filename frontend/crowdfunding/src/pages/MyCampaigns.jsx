import React, { useEffect, useState } from "react";
import { useContract, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x14a8269174248742eb8370b4bebafffc60f3491b";

const MyCampaigns = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const address = useAddress();
  const [campaigns, setCampaigns] = useState([]);

  const fetchMyCampaigns = async () => {
    if (!contract || !address) return;
    try {
      const allCampaigns = await contract.call("getCampaigns");
      const myCampaigns = allCampaigns.filter(c => c.owner.toLowerCase() === address.toLowerCase());
      setCampaigns(myCampaigns);
    } catch (err) {
      console.error(" Failed to fetch campaigns", err);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, [contract, address]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Campaigns</h1>
      {campaigns.length === 0 ? (
        <p>No campaigns created by you yet.</p>
      ) : (
        <div style={styles.grid}>
          {campaigns.map((c, index) => {
            const target = parseFloat(ethers.utils.formatEther(c.target));
            const collected = parseFloat(ethers.utils.formatEther(c.amountCollected));
            const progress = Math.min((collected / target) * 100, 100);

            return (
              <div key={index} style={styles.card}>
                <img src={c.image} alt={c.title} style={styles.image} />
                <h3 style={styles.title}>{c.title}</h3>
                <div style={styles.progressContainer}>
                  <div style={{ ...styles.progressBar, width: `${progress}%` }} />
                </div>
                <p><strong>Target:</strong> {target} ETH</p>
                <p><strong>Collected:</strong> {collected} ETH</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: "#111",
    minHeight: "100vh",
    color: "#fff",
  },
  header: {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    justifyContent: "center",
  },
  card: {
    background: "#1e1e1e",
    borderRadius: "10px",
    padding: "1rem",
    width: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "0.5rem",
  },
  title: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  },
  progressContainer: {
    height: "8px",
    width: "100%",
    backgroundColor: "#333",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00c851",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
};

export default MyCampaigns;
