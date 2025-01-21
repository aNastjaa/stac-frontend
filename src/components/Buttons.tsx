import { Link } from "react-router";
import "../css/buttons.css"; 


export function ButtonLong({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
  disabled?: boolean; 
}) {
  return (
    <button className="button-long" onClick={onClick}>
      {text}
    </button>
  );
}

export const ButtonCTA = ({
  text,
  link,
  onClick,
}: {
  text: string;
  link: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; // Accept event
}) => {
  return (
    <Link to={link}>
      <button className="button-cta" onClick={onClick}>
        {text}
      </button>
    </Link>
  );
};

export function ButtonPrimary({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void; 
  disabled?: boolean; 
}) {
  return (
    <button className="button-primary" onClick={onClick}>
      {text}
    </button>
  );
}

