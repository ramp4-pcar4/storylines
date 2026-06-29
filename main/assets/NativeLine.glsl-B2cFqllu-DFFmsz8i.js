import{t as e}from"./ShaderBuilder-Dy-kUWY5-Xkes0yhG.js";import{t}from"./glsl-BgsHvHfn-n7nRq5tN.js";import{Bt as n,Ft as r,Gt as i,Mt as a,gn as o,vn as s}from"./FloatArray-CCh0HzKA-BmbfAaO3.js";function c(c){let l=new e,{vertex:u,fragment:d,varyings:f}=l;return l.fragment.include(s,c),l.include(r),l.include(a,c),l.include(n,c),i(u,c),l.attributes.add(`position`,`vec3`),f.add(`vpos`,`vec3`,{invariant:!0}),u.main.add(t`vpos = position;
forwardVertexColor();
gl_Position = transformPosition(proj, view, vpos);`),c.hasVertexColors||d.uniforms.add(new o(`constantColor`,e=>e.color)),d.main.add(t`
    discardBySlice(vpos);
    vec4 color = ${c.hasVertexColors?`vColor`:`constantColor`};
    outputColorHighlightOLID(applySlice(color, vpos), color.rgb);
  `),l}var l=Object.freeze(Object.defineProperty({__proto__:null,build:c},Symbol.toStringTag,{value:`Module`}));export{l as n,c as t};