import { useState } from "react";
import "./css/Mode.css";

export const Mode = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    console.log("Toggle State:", event.target.checked);
  };

  return (
    <div className="toggle-container transform rotate-90">
      <input
        className="toggle-input"
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className="toggle-handle-wrapper">
        <div className="toggle-handle">
          <div className="toggle-handle-knob"></div>
          <div className="toggle-handle-bar-wrapper">
            <div className="toggle-handle-bar"></div>
          </div>
        </div>
      </div>
      <div className="toggle-base">
        <div className="toggle-base-inside"></div>
      </div>
    </div>
  );
};
