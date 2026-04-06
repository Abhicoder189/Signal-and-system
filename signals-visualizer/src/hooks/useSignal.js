import { useMemo, useState } from "react";
import { generateSine } from "../utils/signalFunctions";

function useSignal(initial = { amplitude: 1, frequency: 1, samples: 16 }) {
  const [config, setConfig] = useState(initial);

  const signal = useMemo(() => generateSine(config), [config]);

  return { config, setConfig, signal };
}

export default useSignal;