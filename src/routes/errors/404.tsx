import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/404.css"; 
import { ButtonCTA } from "../../components/Buttons";

const NotFound = () => {
  const navigate = useNavigate();

  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page in the history stack
  };

  return (
    <div className="not-found-container-wrapper">
        <div className="not-found-container">
            <h1 className="not-found-title">Oopsie! 🫥 </h1>
            <p className="not-found-message">
                It looks like the page you’re looking for has run away. <br/> But don't worry,
                you can get back on track!
            </p>
            <p className="not-found-message">
                Just press the magic button below to go back to where you came from!🚀
            </p>
            <div className="take-me-back-button">
                <ButtonCTA 
                    text="Take me back! " 
                    link="/" 
                    onClick={handleGoBack} 
                />
            </div>
        </div>

        {/* Background with large transparent 404 */}
      <div className="not-found-background">
        <h1 className="not-found-background-text">404</h1>
      </div>
    </div>
  );
};

export default NotFound;
