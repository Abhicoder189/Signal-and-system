import { useMemo } from "react";

function useGraph(signal = []) {
  return useMemo(
    () =>
      signal.map((value, index) => ({
        x: index,
        y: value
      })),
    [signal]
  );
}

export default useGraph;