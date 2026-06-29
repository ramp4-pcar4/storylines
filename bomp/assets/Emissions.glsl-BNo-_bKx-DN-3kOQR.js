import{o as e}from"./colorUtils-DDC8SjYu-CQvRS7Rn.js";import{n as t,t as n}from"./glsl-BgsHvHfn-n7nRq5tN.js";function r(t){t.constants.add(`GAMMA`,`float`,e).constants.add(`INV_GAMMA`,`float`,1/e).code.add(n`vec3 delinearizeGamma(vec3 color) {
return pow(color, vec3(INV_GAMMA));
}
vec4 delinearizeGamma(vec4 color) {
return vec4(delinearizeGamma(color.rgb), color.a);
}
vec3 linearizeGamma(vec3 color) {
return pow(color, vec3(GAMMA));
}`)}var i=class{constructor(e,t,n,r,i=null){if(this.name=e,this.type=t,this.arraySize=i,this.bind={0:null,1:null,2:null},r)switch(n){case void 0:break;case 0:this.bind[0]=r;break;case 1:this.bind[1]=r;break;case 2:this.bind[2]=r}}equals(e){return this.type===e.type&&this.name===e.name&&this.arraySize===e.arraySize}},a=class extends i{constructor(e,t,n){super(e,`vec3`,2,(r,i,a,o)=>r.setUniform3fv(e,t(i,a,o),n))}},o=class extends i{constructor(e,t,n){super(e,`vec3`,1,(r,i,a)=>r.setUniform3fv(e,t(i,a),n))}},s=class extends i{constructor(e,t,n){super(e,`float`,1,(r,i,a)=>r.setUniform1f(e,t(i,a),n))}},c=class extends i{constructor(e,t){super(e,`sampler2D`,2,(n,r,i)=>n.bindTexture(e,t(r,i)))}},l=class extends i{constructor(e,t){super(e,`sampler2D`,1,(n,r,i)=>n.bindTexture(e,t(r,i)))}};function u(e){return e===3||e===4||e===5}function d(e){return u(e)||e===6||e===7}function f(e){return v(e)||e===2}function p(e){return e===8||e===9}function m(e){return h(e)||p(e)}function h(e){return e===0}function g(e){return h(e)||e===9}function _(e){return h(e)||p(e)}function v(e){return _(e)||y(e)}function y(e){return e===1}function b(e){return y(e)||d(e)}function x(e,t){switch(t.textureCoordinateType){case 1:e.attributes.add(`uv0`,`vec2`),e.varyings.add(`vuv0`,`vec2`),e.vertex.code.add(n`void forwardTextureCoordinates() { vuv0 = uv0; }`);return;case 2:e.attributes.add(`uv0`,`vec2`),e.attributes.add(`uvRegion`,`vec4`),e.varyings.add(`vuv0`,`vec2`),e.varyings.add(`vuvRegion`,`vec4`),e.vertex.code.add(n`void forwardTextureCoordinates() {
vuv0 = uv0;
vuvRegion = uvRegion;
}`);return;default:t.textureCoordinateType;case 0:e.vertex.code.add(n`void forwardTextureCoordinates() {}`);return;case 3:return}}function S(e){e.fragment.code.add(n`vec4 textureAtlasLookup(sampler2D tex, vec2 textureCoordinates, vec4 atlasRegion) {
vec2 atlasScale = atlasRegion.zw - atlasRegion.xy;
vec2 uvAtlas = fract(textureCoordinates) * atlasScale + atlasRegion.xy;
float maxdUV = 0.125;
vec2 dUVdx = clamp(dFdx(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
vec2 dUVdy = clamp(dFdy(textureCoordinates), -maxdUV, maxdUV) * atlasScale;
return textureGrad(tex, uvAtlas, dUVdx, dUVdy);
}`)}function C(e,t){let{textureCoordinateType:r}=t;if(r===0||r===3)return;e.include(x,t);let i=r===2;i&&e.include(S),e.fragment.code.add(n`
    vec4 textureLookup(sampler2D tex, vec2 uv) {
      return ${i?`textureAtlasLookup(tex, uv, vuvRegion)`:`texture(tex, uv)`};
    }
  `)}var w=class extends i{constructor(e,t,n){super(e,`float`,2,(r,i,a)=>r.setUniform1f(e,t(i,a),n))}};function T(e,i){if(!h(i.output))return;e.fragment.include(r);let{emissionSource:u,hasEmissiveTextureTransform:d,bindType:f}=i,p=u===3||u===4||u===5;p&&(e.include(C,i),e.fragment.uniforms.add(f===1?new l(`texEmission`,e=>e.textureEmissive):new c(`texEmission`,e=>e.textureEmissive)));let m=u===2||p;m&&e.fragment.uniforms.add(f===1?new o(`emissiveBaseColor`,e=>e.emissiveBaseColor):new a(`emissiveBaseColor`,e=>e.emissiveBaseColor));let g=u!==0;g&&!(u===7||u===6||u===4||u===5)&&e.fragment.uniforms.add(f===1?new s(`emissiveStrength`,e=>e.emissiveStrength??0):new w(`emissiveStrength`,e=>e.emissiveStrength??0));let _=u===7,v=u===5,y=u===1||u===6||_;e.fragment.code.add(n`
    vec4 getEmissions(vec3 symbolColor) {
      vec4 emissions = ${m?v?`emissiveSource == 0 ? vec4(emissiveBaseColor, 1.0): vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(emissiveBaseColor, 1.0)`:y?_?`emissiveSource == 0 ? vec4(0.0): vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(linearizeGamma(symbolColor), 1.0)`:`vec4(0.0)`};
      ${t(p,`${t(v,`if(emissiveSource == 0) {\n              vec4 emissiveFromTex = textureLookup(texEmission, ${d?`emissiveUV`:`vuv0`});\n              emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);\n           }`,`vec4 emissiveFromTex = textureLookup(texEmission, ${d?`emissiveUV`:`vuv0`});\n           emissions *= vec4(linearizeGamma(emissiveFromTex.rgb), emissiveFromTex.a);`)}\n        emissions.w = emissions.rgb == vec3(0.0) ? 0.0: emissions.w;`)}
      ${t(g,`emissions.rgb *= emissiveStrength * ${n.float(1)};`)}
      return emissions;
    }
  `)}export{o as _,p as a,r as b,h as c,y as d,T as f,s as g,c as h,f as i,m as l,l as m,v as n,_ as o,b as p,x as r,g as s,C as t,d as u,a as v,i as y};