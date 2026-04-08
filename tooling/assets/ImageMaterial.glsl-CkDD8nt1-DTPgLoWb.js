import{t as e}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{n as t,t as n}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as r}from"./FloatPassUniform-gHcGW-mi-_VlsNBhT.js";import{t as i}from"./Texture2DPassUniform-RVTT2Sjh-MHqWw8x6.js";import{t as a}from"./NoParameters-DvFAVXX5-TeCC2WiX.js";import{r as o,t as s}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{n as c}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{t as l}from"./TerrainDepthTest.glsl-D0F_r5xM-CjVn1995.js";import{t as u}from"./OutputColorHighlightOLID.glsl-DuYrVBF1-BSHMohz0.js";import{r as d}from"./Transform.glsl-B8LYsJdc-DQSGKLr8.js";var f=class extends a{};function p(a){let f=new e,{vertex:p,fragment:m,varyings:h}=f,{output:g,perspectiveInterpolation:_}=a;return c(p,a),f.include(d),f.include(l,a),f.fragment.include(s,a),f.fragment.code.add(n`void outputObjectAndLayerIdColor() {
    ${t(g===9,`fragColor = vec4(0, 0, 0, 1);`)}
    }`),f.include(u,a),f.attributes.add(`position`,`vec3`),f.attributes.add(`uv0`,`vec2`),_&&f.attributes.add(`perspectiveDivide`,`float`),p.main.add(n`
    vpos = position;
    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    vTexCoord = uv0;
    gl_Position = transformPosition(proj, view, vpos);
    ${t(_,`gl_Position *= perspectiveDivide;`)}`),h.add(`vpos`,`vec3`,{invariant:!0}),h.add(`vTexCoord`,`vec2`),m.include(o),m.uniforms.add(new r(`opacity`,e=>e.opacity),new i(`tex`,e=>e.texture)).main.add(n`discardBySlice(vpos);
discardByTerrainDepth();
vec4 finalColor = texture(tex, vTexCoord) * opacity;
outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),f}var m=Object.freeze(Object.defineProperty({__proto__:null,ImageMaterialPassParameters:f,build:p},Symbol.toStringTag,{value:`Module`}));export{m as n,p as r,f as t};