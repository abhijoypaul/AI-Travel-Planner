import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function TopProgressBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);
    
    // Simulate progression steps
    const t1 = setTimeout(() => setProgress(45), 80);
    const t2 = setTimeout(() => setProgress(75), 220);
    const t3 = setTimeout(() => setProgress(90), 450);
    const t4 = setTimeout(() => {
      setProgress(100);
      const tOut = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(tOut);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-505 via-purple-500 to-cyan-400 transition-all duration-300 ease-out z-[9999]"
      style={{ width: `${progress}%` }}
    />
  );
}
