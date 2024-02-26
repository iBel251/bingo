import React, { useState } from "react";

const OtpTest = () => {
  const [statusMessage, setStatusMessage] = useState("");

  const sendOTP = async () => {
    const url = "https://sms.yegara.com/api3/send";
    const data = {
      id: "1234",
      domain: "example.com",
      to: "0799121936", // Replace with the actual recipient number
      otp: "4875", // Ideally, this should be dynamically generated
    };

    try {
      const response = await fetch(url, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //dsfbjdbfjb
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);
      setStatusMessage("OTP sent successfully.");
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Failed to send OTP.");
    }
  };

  return (
    <div>
      <div>OtpTest</div>
      <button onClick={sendOTP}>Send OTP</button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default OtpTest;
