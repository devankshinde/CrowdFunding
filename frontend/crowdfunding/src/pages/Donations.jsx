// src/pages/Donations.jsx
import React, { useEffect, useState } from "react";
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x14a8269174248742eb8370b4bebafffc60f3491b";

const Donations = () => {
  const { contract } = useContract(CONTRACT_ADDRESS);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState({});

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;
      try {
        const data = await contract.call("getCampaigns");

        const filtered = data.filter((c) =>
          ethers.BigNumber.from(c.amountCollected).lt(c.target)
        );

        setCampaigns(filtered);
      } catch (err) {
        console.error(" Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, [contract]);

  const handleDonate = async (index) => {
    const amount = donations[index];
    if (!amount || isNaN(amount)) return alert("Enter a valid amount");

    try {
      await contract.call("donateToCampaign", [index], {
        value: ethers.utils.parseEther(amount),
      });
      alert(" Donation successful!");
      setDonations((prev) => ({ ...prev, [index]: "" }));
    } catch (err) {
      console.error("Donation failed:", err);
      alert("Something went wrong during donation.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Donate to a Campaign</h1>
      <div style={styles.grid}>
        {campaigns.map((c, i) => {
          const target = parseFloat(ethers.utils.formatEther(c.target));
          const collected = parseFloat(ethers.utils.formatEther(c.amountCollected));
          const progress = Math.min((collected / target) * 100, 100);

          return (
            <div key={i} style={styles.card}>
              <img src={c.image} alt={c.title} style={styles.image} />
              <h2 style={styles.title}>{c.title}</h2>
              <div style={styles.progressContainer}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }} />
              </div>
              <p><strong>Target:</strong> {target} ETH</p>
              <p><strong>Collected:</strong> {collected} ETH</p>
              <input
                type="text"
                placeholder="Amount in ETH"
                value={donations[i] || ""}
                onChange={(e) =>
                  setDonations((prev) => ({ ...prev, [i]: e.target.value }))
                }
                style={styles.input}
              />
              <button onClick={() => handleDonate(i)} style={styles.button}>
                 Donate
              </button>
            </div>
          );
        })}
      </div>
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
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "200px",
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
  input: {
    width: "100%",
    padding: "0.4rem",
    margin: "0.6rem 0",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "#28a745",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default Donations;
