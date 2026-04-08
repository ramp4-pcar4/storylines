import{n as e}from"./vec2f64-D8dbcrKD-BWzTcbaA.js";import{t}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{t as n}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as r}from"./Texture2DDrawUniform-DswgHdDh-Dbbi-Vrl.js";import{t as i}from"./NoParameters-DvFAVXX5-TeCC2WiX.js";import{t as a}from"./Float2DrawUniform-LhTbmE_3-sFZkHKqr.js";import{t as o}from"./HighlightCellGridScreenSpacePass.glsl-ssR23D_d-DqU6XsL0.js";var s=class extends i{constructor(){super(...arguments),this.blurSize=e()}};function c(){let e=new t;return e.include(o),e.outputs.add(`fragHighlight`,`vec2`,0),e.fragment.uniforms.add(new a(`blurSize`,e=>e.blurSize),new r(`blurInput`,e=>e.blurInput)).main.add(n`vec2 highlightTextureSize = vec2(textureSize(blurInput,0));
vec2 center = texture(blurInput, sUV).rg;
if (vOutlinePossible == 0.0) {
fragHighlight = center;
} else {
vec2 sum = center * 0.204164;
sum += texture(blurInput, sUV + blurSize * 1.407333).rg * 0.304005;
sum += texture(blurInput, sUV - blurSize * 1.407333).rg * 0.304005;
sum += texture(blurInput, sUV + blurSize * 3.294215).rg * 0.093913;
sum += texture(blurInput, sUV - blurSize * 3.294215).rg * 0.093913;
fragHighlight = sum;
}`),e}var l=Object.freeze(Object.defineProperty({__proto__:null,HighlightBlurDrawParameters:s,build:c},Symbol.toStringTag,{value:`Module`}));export{l as n,s as r,c as t};