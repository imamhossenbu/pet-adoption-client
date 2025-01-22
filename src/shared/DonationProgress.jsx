/* eslint-disable react/prop-types */

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DonationProgress = ({ donatedAmount, maxDonationAmount }) => {
  const progress = (donatedAmount / maxDonationAmount) * 100 || 0;

  return (
    <div style={{ width: "64px", height: "64px" }}> {/* Adjust size here */}
      <CircularProgressbar
        value={progress}
        text={`${Math.round(progress)}%`}
        styles={buildStyles({
          textColor: "#4B5563", // Gray text color
          pathColor: "#22C55E", // Green path color
          trailColor: "#E5E7EB", // Light gray trail color
          textSize: "32px", // Adjust text size
        })}
      />
    </div>
  );
};

export default DonationProgress;
