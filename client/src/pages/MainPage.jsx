import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "../css/mainPage.css"

const MainPage = () => {
  const [code, setCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const StartMeeting = () => {
    navigate(`/${uuidv4()}`);
  };

  const JoinMeeting = () => {
    setShowInput(true);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/${code}`);
    }
  };

  return (
    <div className="main-container">
      <h1 className="title">Video Meeting App</h1>
      <div className="button-group">
        <button className="btn primary" onClick={StartMeeting}>
          Start the Meeting
        </button>
        <button className="btn secondary" onClick={JoinMeeting}>
          Join a Meeting
        </button>
      </div>

      {showInput && (
        <form className="join-form" onSubmit={HandleSubmit}>
          <input
            type="text"
            placeholder="Enter Meeting Code"
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit" className="btn join">
            Join Meeting
          </button>
        </form>
      )}
    </div>
  );
};

export default MainPage;
