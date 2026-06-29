import{n as e}from"./vec4f64-DFGee9an-ChZtdph7.js";import{t}from"./ShaderBuilder-aUMFb5cS-Bh1P788U.js";import{n,t as r}from"./glsl-EDZkDhgF-n7nRq5tN.js";import{_ as i,g as a}from"./Emissions.glsl-C1fRgyHC-BHLvU4yY.js";import{Bt as o,Ft as s,Gt as c,Vt as l,Wt as u,Xt as d,bn as f,gn as p,qt as m,vn as h}from"./FloatArray-BPbliE26-DBjHebJv.js";function g(e,t){if(!t.screenSizeEnabled)return;let n=e.vertex;u(n,t),n.uniforms.add(new d(`perScreenPixelRatio`,e=>e.camera.perScreenPixelRatio),new a(`screenSizeScale`,e=>e.screenSizeScale)).code.add(r`float computeRenderPixelSizeAt( vec3 pWorld ){
vec3 viewForward = - vec3(view[0][2], view[1][2], view[2][2]);
float viewDirectionDistance = abs(dot(viewForward, pWorld - cameraPosition));
return viewDirectionDistance * perScreenPixelRatio;
}
vec3 screenSizeScaling(vec3 position, vec3 anchor){
return position * screenSizeScale * computeRenderPixelSizeAt(anchor) + anchor;
}`)}function _(e){let a=new t;a.include(s),a.include(g,e),a.fragment.include(h,e),a.include(o,e),a.include(l,e);let{vertex:u,fragment:d}=a;return d.include(f),c(u,e),d.uniforms.add(new p(`uColor`,e=>e.color)),a.attributes.add(`position`,`vec3`),a.varyings.add(`vWorldPosition`,`vec3`),e.screenSizeEnabled&&a.attributes.add(`offset`,`vec3`),e.shadingEnabled&&(m(u),a.attributes.add(`normal`,`vec3`),a.varyings.add(`vViewNormal`,`vec3`),d.uniforms.add(new i(`shadingDirection`,e=>e.shadingDirection)),d.uniforms.add(new p(`shadedColor`,e=>v(e.shadingTint,e.color)))),u.main.add(r`
    vWorldPosition = ${e.screenSizeEnabled?r`screenSizeScaling(offset, position)`:r`position`};
    ${n(e.shadingEnabled,r`vec3 worldNormal = normal;
           vViewNormal = (viewNormal * vec4(worldNormal, 1)).xyz;`)}
    forwardViewPosDepth((view * vec4(vWorldPosition, 1.0)).xyz);
    gl_Position = transformPosition(proj, view, vWorldPosition);
  `),d.main.add(r`
      discardBySlice(vWorldPosition);
      discardByTerrainDepth();
      ${e.shadingEnabled?r`vec3 viewNormalNorm = normalize(vViewNormal);
             float shadingFactor = 1.0 - clamp(-dot(viewNormalNorm, shadingDirection), 0.0, 1.0);
             vec4 finalColor = mix(uColor, shadedColor, shadingFactor);`:r`vec4 finalColor = uColor;`}
      outputColorHighlightOLID(applySlice(finalColor, vWorldPosition), finalColor.rgb);`),a}function v(e,t){let n=1-e[3],r=e[3]+t[3]*n;return r===0?(y[3]=r,y):(y[0]=(e[0]*e[3]+t[0]*t[3]*n)/r,y[1]=(e[1]*e[3]+t[1]*t[3]*n)/r,y[2]=(e[2]*e[3]+t[2]*t[3]*n)/r,y[3]=t[3],y)}var y=e(),b=Object.freeze(Object.defineProperty({__proto__:null,build:_},Symbol.toStringTag,{value:`Module`}));export{b as n,_ as t};