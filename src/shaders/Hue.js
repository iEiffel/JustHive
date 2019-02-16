import React from 'react';
import GL from 'gl-react';

const shaders = GL.Shaders.create({
  hue: {
    frag:
    `
    precision highp float;
    varying vec2 uv;
    uniform sampler2D image;
    uniform float factor;
    const mat3 rgb2yiq = mat3(0.299, 0.587, 0.114, 0.595716, -0.274453, -0.321263, 0.211456, -0.522591, 0.311135);
    const mat3 yiq2rgb = mat3(1.0, 0.9563, 0.6210, 1.0, -0.2721, -0.6474, 1.0, -1.1070, 1.7046);
    void main() {
      vec3 yColor = rgb2yiq * texture2D(image, uv).rgb;
      float originalHue = atan(yColor.b, yColor.g);
      float finalHue = originalHue + factor;
      float chroma = sqrt(yColor.b*yColor.b+yColor.g*yColor.g);
      vec3 yFinalColor = vec3(yColor.r, chroma * cos(finalHue), chroma * sin(finalHue));
      gl_FragColor = vec4(yiq2rgb*yFinalColor, 1.0);
    }
    `
  }
});

export const Hue = GL.createComponent(
  ({ children, factor }) =>
    <GL.Node shader={shaders.hue} uniforms={{ factor }}>
      <GL.Uniform name="image">{children}</GL.Uniform>
    </GL.Node>
);
