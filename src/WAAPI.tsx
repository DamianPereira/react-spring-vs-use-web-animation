import "./styles.css";
import useWebAnimations from "@wellyshen/use-web-animations";
import React, { useEffect, useState } from "react";

const AnimatedBox = ({
  playState,
  onFinish,
}: {
  playState: AnimationPlayState;
  onFinish: (animation?: Animation) => void;
}) => {
  const defaultAnimationOptions: KeyframeAnimationOptions = {
    duration: 500,
    easing: "ease-in-out",
    fill: "forwards",
  };
  const getKeyframes = () => [
    { top: "0%" },
    { top: "calc(100% - 60px)" },
  ];

  const { ref, getAnimation, animate } = useWebAnimations<HTMLDivElement>({
    autoPlay: false,
    keyframes: getKeyframes(),
    animationOptions: defaultAnimationOptions,
    onFinish: () => onFinish(getAnimation()),
  });

  useEffect(() => {
    const animation = getAnimation();
    if (animation) {
      switch (playState) {
        case "running":
          animation.play();
          break;
        case "idle":
          animation.cancel();
          break;
      }
    }
  }, [playState]);

  return <div className="box" ref={ref} />;
};

export default function WAAPIAnimated() {
  const [playStates, setPlayStates] = useState<AnimationPlayState[]>(
    [...new Array(5).keys()].map((): AnimationPlayState => "idle")
  );
  return (
    <div className="boxes">
      <button
        onClick={() => {
          setPlayStates(
            playStates.map(
              (_playState, index): AnimationPlayState =>
                index === 0 ? "running" : "idle"
            )
          );
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          setPlayStates(playStates.map((): AnimationPlayState => "idle"));
        }}
      >
        Cancel
      </button>
      <div className="container">
        {playStates.map((playState, index) => (
          <AnimatedBox
            key={index}
            playState={playState}
            onFinish={(animation) => {
              const newPlayStates = [...playStates];
              newPlayStates[index] = animation?.playState || "idle";
              if (
                index + 1 < playStates.length &&
                playStates[index] !== "idle"
              ) {
                newPlayStates[index + 1] = "running";
              }
              setPlayStates(newPlayStates);
            }}
          />
        ))}
      </div>
    </div>
  );
}
