import{t as e}from"./ShaderBuilder-aUMFb5cS-Bh1P788U.js";import{n as t,t as n}from"./glsl-EDZkDhgF-n7nRq5tN.js";import{g as r,m as i}from"./Emissions.glsl-C1fRgyHC-BHLvU4yY.js";import{Bt as a,Dn as o,Ft as s,Gt as c,Vt as l,bn as u,vn as d}from"./FloatArray-BPbliE26-QHySD8fE.js";var f=class extends o{};function p(o){let f=new e,{vertex:p,fragment:m,varyings:h}=f,{output:g,perspectiveInterpolation:_}=o;return c(p,o),f.include(s),f.include(l,o),f.fragment.include(d,o),f.fragment.code.add(n`void outputObjectAndLayerIdColor() {
    ${t(g===9,`fragColor = vec4(0, 0, 0, 1);`)}
    }`),f.include(a,o),f.attributes.add(`position`,`vec3`),f.attributes.add(`uv0`,`vec2`),_&&f.attributes.add(`perspectiveDivide`,`float`),p.main.add(n`
    vpos = position;
    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    vTexCoord = uv0;
    gl_Position = transformPosition(proj, view, vpos);
    ${t(_,`gl_Position *= perspectiveDivide;`)}`),h.add(`vpos`,`vec3`,{invariant:!0}),h.add(`vTexCoord`,`vec2`),m.include(u),m.uniforms.add(new r(`opacity`,e=>e.opacity),new i(`tex`,e=>e.texture)).main.add(n`discardBySlice(vpos);
discardByTerrainDepth();
vec4 finalColor = texture(tex, vTexCoord) * opacity;
outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),f}var m=Object.freeze(Object.defineProperty({__proto__:null,ImageMaterialPassParameters:f,build:p},Symbol.toStringTag,{value:`Module`}));export{m as n,p as r,f as t};