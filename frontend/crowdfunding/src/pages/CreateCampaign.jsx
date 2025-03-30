import React, { useState } from "react";
import { useContract, useAddress, useMetamask } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import "./CreateCampaign.css"; // Import the CSS

const CONTRACT_ADDRESS = "0x14a8269174248742eb8370b4bebafffc60f3491b";

const CreateCampaign = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);

  const [form, setForm] = useState({
    ownerName: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!contract || !address) {
      alert("Please connect your wallet and ensure contract is loaded.");
      return;
    }

    try {
      const targetInWei = ethers.utils.parseEther(form.target);
      const deadlineTimestamp = Math.floor(new Date(form.deadline).getTime() / 1000);

      await contract.call("createCampaign", [
        address,
        form.title,
        form.description,
        targetInWei,
        deadlineTimestamp,
        form.image,
      ]);

      alert(" Campaign created successfully!");
      setForm({ ownerName: "", title: "", description: "", target: "", deadline: "", image: "" });
    } catch (err) {
      console.error(" Error:", err);
      alert("Something went wrong while creating the campaign.");
    }
  };

  if (!address) {
    return (
      <div className="connect-wallet">
        <h2>🔐 Connect your wallet to get started</h2>
        <button onClick={connectWithMetamask}>Connect MetaMask</button>
      </div>
    );
  }

  return (
    <div className="create-campaign-container">
      <h1>Create a New Campaign</h1>

      <div className="form">
        <label>Owner's Name</label>
        <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="e.g. John Doe" />

        <label> Campaign Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Help build a school" />

        <label> Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your campaign..." />

        <label> Target (in ETH)</label>
        <input type="text" name="target" value={form.target} onChange={handleChange} placeholder="e.g. 0.5" />

        <label> Deadline</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

        <label> Image URL</label>
        <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="e.g. https://example.com/image.jpg" />

        <button onClick={handleCreate}>Create Campaign</button>
      </div>
    </div>
  );
};

export default CreateCampaign;
