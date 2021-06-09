import React, { useEffect, useState } from "react";
import { useSprings, animated, config } from "react-spring";

const SpringAnimated = (): JSX.Element => {
  const [active, setActive] = useState(new Array(5).fill(false));
  const [springs, api] = useSprings(active.length, () => ({ top: "0%" }));
  useEffect(() => {
    console.log("running effect", active);
    api.start((index) => ({
      top: active[index] ? "100%" : "0%",
      // config: config.wobbly,
      immediate: !active[index],
      onRest: ({ cancelled }) => {
        const newActive = [...active];
        if (index + 1 < active.length && active[index] === true && !cancelled) {
          newActive[index + 1] = true;
          setActive(newActive);
        }
      },
    }));
  }, active);
  return (
    <div className="boxes">
      <button
        onClick={() => {
          setActive([true, ...active.slice(1)]);
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          api.stop(true);
          setActive(new Array(active.length).fill(false));
        }}
      >
        Cancel
      </button>
      <div className="container">
        {springs.map((spring, index) => (
          <animated.div className="box" key={index} style={spring} />
        ))}
      </div>
    </div>
  );
};
export default SpringAnimated;
