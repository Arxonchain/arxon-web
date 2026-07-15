import { useNavigate } from "react-router-dom";

interface WaitlistDialogProps {
  children: React.ReactNode;
}

export const WaitlistDialog = ({ children }: WaitlistDialogProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/mining-choice");
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
};
