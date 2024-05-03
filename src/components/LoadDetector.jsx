import { useState, useEffect } from 'react';

export default function LoadDetector({ callback }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    callback.call();
    return () => {};
  }, [loaded]);

  return(<div />)
}