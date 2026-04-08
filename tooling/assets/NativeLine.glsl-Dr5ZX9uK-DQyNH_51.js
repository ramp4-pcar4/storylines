import{t as e}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{t}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as n}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{t as r}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{n as i}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{t as a}from"./OutputColorHighlightOLID.glsl-DuYrVBF1-BSHMohz0.js";import{r as o}from"./Transform.glsl-B8LYsJdc-DQSGKLr8.js";import{t as s}from"./VertexColor.glsl-DkZ0DT-i-Dv7AbXX-.js";function c(c){let l=new e,{vertex:u,fragment:d,varyings:f}=l;return l.fragment.include(n,c),l.include(o),l.include(s,c),l.include(a,c),i(u,c),l.attributes.add(`position`,`vec3`),f.add(`vpos`,`vec3`,{invariant:!0}),u.main.add(t`vpos = position;
forwardVertexColor();
gl_Position = transformPosition(proj, view, vpos);`),c.hasVertexColors||d.uniforms.add(new r(`constantColor`,e=>e.color)),d.main.add(t`
    discardBySlice(vpos);
    vec4 color = ${c.hasVertexColors?`vColor`:`constantColor`};
    outputColorHighlightOLID(applySlice(color, vpos), color.rgb);
  `),l}var l=Object.freeze(Object.defineProperty({__proto__:null,build:c},Symbol.toStringTag,{value:`Module`}));export{l as n,c as t};