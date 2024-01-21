import React, { CSSProperties, createElement } from "react";

const themeUtils = {
  createComponent(element, styles) {
    // @ts-ignore
    const { classes } = this;

    return ({ children }) => (
      <>
        {createElement(
          element,
          {
            className: classes.join(" "),
            style: styles
          },
          children
        )}
      </>
    );
  }
};

function fn(styles = {}) {
  // @ts-ignore
  let { classes } = this;
  classes = [...classes];

  const animationName = Object.keys(styles)
    .filter((key) => key.startsWith("animate$"))
    .map((key) => key.replace("animate$", ""))[0];
  const animation = styles[`animate$${animationName}`];
  if (animation) {
    const { paused, duration, iterationCount, args, delay } =
      animation instanceof Array
        ? {
            args: animation,
            paused: undefined,
            duration: undefined,
            iterationCount: undefined,
            delay: undefined
          }
        : animation;

    const keyframe = `_${animationName}${
      args?.map((arg) => "_" + arg).join("") ?? ""
    }`;

    styles = {
      animationPlayState: paused ? "paused" : "running",
      animationName: keyframe,
      animationDuration: duration ?? "1s",
      animationIterationCount: iterationCount,
      animationDelay: delay,
      animationFillMode: "forwards",
      ...styles
    };
    classes.push(keyframe);
    classes.push("_" + animationName);
    delete styles[`animate$${animationName}`];
  }

  return {
    className: classes.join(" "),
    style: styles
  };
}

function generateProxy(classes = []) {
  return new Proxy(fn.bind({ classes }), {
    get(_, prop) {
      if (themeUtils[prop]) return themeUtils[prop];

      return generateProxy([...classes, prop]);
    }
  });
}

export const $ = generateProxy();
export default $;

const css = `
@keyframes _fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes _fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

._fadeIn {
  opacity: 0;
}

._fadeIn_fromBottom {
  transform: translateY(100%);
}

._fadeIn_fromTop {
  transform: translateY(-100%);
}

._fadeIn_fromLeft {
  transform: translateX(-100%);
}

._fadeIn_fromRight {
  transform: translateX(100%);
}

@keyframes _fadeIn_fromBottom {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes _fadeOut_toBottom {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(100%);
        opacity: 0;
    }
}

@keyframes _fadeIn_fromTop {
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes _fadeOut_toTop {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-100%);
        opacity: 0;
    }
}

@keyframes _fadeIn_fromLeft {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes _fadeOut_toLeft {
    0% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-100%);
        opacity: 0;
    }
}

@keyframes _fadeIn_fromRight {
    0% {
        transform: translateX(100%);
        opacity: 0;
    }
    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes _fadeOut_toRight {
    0% {
        transform: translateX(0);
        opacity: 1;
    }
    100% {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes _zoomIn {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes _zoomOut {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(0.5);
        opacity: 0;
    }
}

@keyframes _spinIn {
    0% {
        transform: rotate(0deg) scale(0.25);
        opacity: 0;
        animation-timing-function: linear;
    }
    25% {
        transform: rotate(180deg) scale(0.4375);
        opacity: 0.25;
        animation-timing-function: linear;
    }
    50% {
        transform: rotate(360deg) scale(0.625);
        opacity: 0.5;
        animation-timing-function: linear;
    }
    75% {
        transform: rotate(540deg) scale(0.8125);
        opacity: 0.75;
        animation-timing-function: linear;
    }
    100% {
        transform: rotate(720deg) scale(1);
        opacity: 1;
        animation-timing-function: linear;
    }
}

.grid-container {
   display: grid;
   grid-template-columns: repeat(7, 1fr);
   grid-template-rows: repeat(6, 1fr);
   gap: 2px;
   max-width: 100%;
}

.grid-item {
   border: 0.2px solid #222;
   border-radius: 1px;
   padding-left: 0px!important;
   padding-right: 0px!important;
   padding-bottom: 0px!important;
   padding-top: calc(100% - 1px)!important;
}

`;

export function AnimationProvider({ children }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}
