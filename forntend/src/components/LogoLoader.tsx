import { useEffect, useState } from "react";

interface LogoLoaderProps {
  /** Minimum display time in ms before the loader can fade out */
  minDuration?: number;
  /** Whether the app content is ready */
  ready?: boolean;
}

const LogoLoader = ({ minDuration = 1800, ready = false }: LogoLoaderProps) => {
  const [minElapsed, setMinElapsed] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (minElapsed && ready) {
      setFadeOut(true);
      const cleanup = setTimeout(() => setRemoved(true), 500);
      return () => clearTimeout(cleanup);
    }
  }, [minElapsed, ready]);

  if (removed) return null;

  return (
    <div className={`logo-loader-wrapper ${fadeOut ? "fade-out" : ""}`}>
      <div className="logo-loader-pindrop">
        <div className="pindrop-dots">
          <span />
          <span />
          <span />
          <span />
        </div>
        <img src="/logo.png" alt="Spotnere" />
        <div className="pindrop-shadow" />
      </div>
    </div>
  );
};

export default LogoLoader;
