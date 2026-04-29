import { useState } from "react";

export const usePoints = () => {
  const [points] = useState(0);
  return { points };
};

export default usePoints;
