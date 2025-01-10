import { Link } from "react-router";
import "../css/buttons.css"; // Import the CSS for the button styling

// ButtonLong component that can be reused throughout the app
export function ButtonLong({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;  // Define the onClick prop
}) {
  return (
    <button className="button-long" onClick={onClick}>
      {text}
    </button>
  );
}

export const ButtonCTA = ({ text, link }: { text: string; link: string }) => {
  return (
    <Link to={link}>
      <button className="button-cta">
        {text}
      </button>
    </Link>
  );
};

