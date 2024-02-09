import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
const styles = {};

const successMessages = [
  "Welcome to the Summit",
  "You are checked in",
  "Welcome"
];
 
export default function Scan() {
  const [data, setData] = useState("No result");
  const [showMessages, setShowMessages] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (showMessages) {
      // set a timeout to hide the messages after 8 seconds
      const timeoutId = setTimeout(() => {
        setShowMessages(false);
        // Increment the index to display the next message on the next scan
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % successMessages.length);
      }, 4000);

      // clear the timeout when the component is unmounted or data changes
      return () => clearTimeout(timeoutId);
    }
  }, [showMessages, data]);
  

  const handleScanResult = (result, error) => {
    if (!!result) {
      setData(result.text);
      setShowMessages(true); // show messages again when new data is received
    }

    if (!!error) {
      console.error(error);
    }
  };

  const renderResult = () => {
    if (data !== "No result" && showMessages) {
      const [name, place] = data.split('|');
      return (
        <div>
          <h2 className={styles.welcome}>{successMessages[currentMessageIndex]},<br /> {name}!</h2>
          <h3 className={styles.place}>From {place}.</h3>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.container}>
        
      <div className={styles.container}>
        <div className={styles.img} style={{ backgroundImage: `url(pics/sum-bg.png)` }}>
          <QrReader className={styles.scanner}
            onResult={handleScanResult}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100px", height: "500px" }}
          />
        </div>
        {renderResult()}
      </div>
    </div>
  );
}