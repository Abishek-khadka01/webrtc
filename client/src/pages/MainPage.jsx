import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

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
    <>
      <div>
        <button onClick={StartMeeting}>Start the meeting</button>
        <button onClick={JoinMeeting}>Join the meeting</button>

        {showInput && (
          <form onSubmit={HandleSubmit}>
            <input
              type="text"
              name="meeting"
              id="meeting"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit">Join Meeting</button>
          </form>
        )}
      </div>
    </>
  );
};

export default MainPage;
