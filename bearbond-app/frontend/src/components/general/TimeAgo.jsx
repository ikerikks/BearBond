import { useState, useEffect } from "react";

const TimeAgo = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const postTime = new Date(timestamp);
      const now = new Date();
      const secondsAgo = Math.floor((now - postTime) / 1000);

      if (secondsAgo < 60) {
        return `${secondsAgo}s`;
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        return `${minutesAgo}m`;
      } else if (secondsAgo < 86400) {
        const hoursAgo = Math.floor(secondsAgo / 3600);
        return `${hoursAgo}h`;
      } else {
        const daysAgo = Math.floor(secondsAgo / 86400);
        return `${daysAgo}d`;
      }
    };

    setTimeAgo(calculateTimeAgo());

    // Update the time every minute
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timestamp]);
  return (
    <p className="text-xs align-baseline">{timeAgo}</p>
  )
}


export default TimeAgo;