import{n as e,t}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as n}from"./ReadDepth.glsl--9xefl90-Ca2Hj69z.js";import{t as r}from"./Texture2DBindUniform-BjIiNL3v-BB2Xk7Bq.js";function i(i,{occlusionPass:a,terrainDepthTest:o,cullAboveTerrain:s}){let{vertex:c,fragment:l,varyings:u}=i;if(!o)return c.code.add(`void forwardViewPosDepth(vec3 pos) {}`),void l.code.add(`${a?`bool`:`void`} discardByTerrainDepth() { ${e(a,`return false;`)}}`);u.add(`viewPosDepth`,`float`,{invariant:!0}),c.code.add(`void forwardViewPosDepth(vec3 pos) {
    viewPosDepth = pos.z;
  }`),l.include(n),l.uniforms.add(new r(`terrainDepthTexture`,e=>e.terrainDepth?.attachment)).code.add(t`
    ${a?`bool`:`void`} discardByTerrainDepth() {
      float depth = texelFetch(terrainDepthTexture, ivec2(gl_FragCoord.xy), 0).r;
      float linearDepth = linearizeDepth(depth);
      ${a?`return viewPosDepth < linearDepth && depth < 1.0;`:`if(viewPosDepth ${s?`>`:`<=`} linearDepth) discard;`}
    }`)}export{i as t};