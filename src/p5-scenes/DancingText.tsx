import { useMemo } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";

import { string, mappers, easing, animation, colors } from "./utils/index.js";

export const DancingText = () => {
  const sceneSketch = useMemo(() => {
    return (p) => {
      let text = "canyoureadme";
      const depth = 60;

      p.setup = () => {
        p.disableFriendlyErrors = true;
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.frameRate(60);
      };

      p.draw = () => {
        const time = p.millis() / 1000; // Time in seconds
        const center = p.createVector(p.width / 2, p.height / 2);

        p.background(0, 0, 0, 150);
        p.noFill();

        const points = animation.ease({
          values: text.split("").map((char) =>
            string.getTextPoints({
              text: char,
              position: p.createVector(0, 0),
              size: p.width / 1.75,
              font: string.fonts.sans,
              sampleFactor: 0.1,
              simplifyThreshold: 0,
            })
          ),
          lerpFn: mappers.lerpPoints,
          currentTime: animation.progression * text.length,
          easingFn: easing.easeInOutExpo,
        });

        const rotation = animation.ease({
          values: [
            p.createVector(0, 0, 0),
            p.createVector(p.PI / 5, 0, 0),
            p.createVector(-p.PI / 5, p.PI / 5, 0),
            p.createVector(0, 0, p.PI / 5),
          ],
          duration: 1,
          currentTime: animation.progression * text.length,
          lerpFn: mappers.lerpPoints,
          easingFn: easing.easeInOutBack,
        });

        p.push();
        p.rotateX(rotation.x);
        p.rotateY(rotation.y);
        p.rotateZ(rotation.z);

        for (let z = 0; z < depth; z++) {
          const depthProgression = -(z / depth);

          p.push();
          p.translate(
            0,
            0,
            mappers.fn(z, 0, depth, 0, -1500, easing.easeInExpo)
          );
          p.strokeWeight(15);

          for (let i = 0; i < points.length; i++) {
            const progression = i / points.length;
            const { x, y } = points[i];

            const opacityFactor =
              mappers.fn(
                Math.sin(depthProgression * 2 * Math.PI),
                -1,
                1,
                1.75,
                1
              ) * Math.pow(1.1, z);

            p.stroke(
              colors.rainbow({
                hueOffset: time,
                hueIndex:
                  mappers.fn(
                    p.noise(
                      x / p.width,
                      y / p.height + animation.circularProgression,
                      depthProgression / 2
                    ),
                    0,
                    1,
                    -p.PI,
                    p.PI
                  ) * 14,
                opacityFactor,
              })
            );

            const xx =
              x * mappers.fn(z, 0, depth, 1, 0, easing.easeInExpo) +
              x * Math.pow(1.15, z);
            const yy =
              y * mappers.fn(z, 0, depth, 1, 0, easing.easeInExpo) +
              y * Math.pow(1.05, z);

            p.point(xx, yy);
          }
          p.pop();
        }
        p.pop();

        p.orbitControl();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };
  }, []);
  function sketch(p5) {
    p5.setup = () => p5.createCanvas(600, 400, p5.WEBGL);

    p5.draw = () => {
      p5.background(250);
      p5.normalMaterial();
      p5.push();
      p5.rotateZ(p5.frameCount * 0.01);
      p5.rotateX(p5.frameCount * 0.01);
      p5.rotateY(p5.frameCount * 0.01);
      p5.plane(100);
      p5.pop();
    };
  }
  return <ReactP5Wrapper sketch={sceneSketch} />;
};
