import * as echarts from "echarts";
import { useEffect, useRef } from "react";

const loadingOption = {
  graphic: {
    elements: [
      {
        type: "group",
        left: "center",
        top: "center",
        children: new Array(7).fill(0).map((val, i) => ({
          type: "rect",
          x: i * 20,
          shape: {
            x: 0,
            y: -40,
            width: 10,
            height: 80,
          },
          style: {
            fill: "#5470c6",
          },
          keyframeAnimation: {
            duration: 1000,
            delay: i * 200,
            loop: true,
            keyframes: [
              {
                percent: 0.5,
                scaleY: 0.3,
                easing: "cubicIn",
              },
              {
                percent: 1,
                scaleY: 1,
                easing: "cubicOut",
              },
            ],
          },
        })),
      },
    ],
  },
};


export default function EchartContainer({ option }) {
  const container = useRef();
  const chart = useRef(null);

  useEffect(() => {
    chart.current = echarts.init(container.current, "default");
    chart.current.setOption(option ? option : loadingOption);
    window.addEventListener("resize",chart.current.resize)

  }, []);

  useEffect(() => {
    if (option) {
      chart.current.setOption(option);
    }
  }, [option]);

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
}
