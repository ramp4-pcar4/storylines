import{r as e}from"./mat3f64-H1VyAOlk-C6GkH5Px.js";import{c as t}from"./vec2f64-D8dbcrKD-BWzTcbaA.js";import{t as n}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{n as r,t as i}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as a}from"./Float3PassUniform-BEhcqx4m-DR57WjmF.js";import{t as o}from"./FloatPassUniform-gHcGW-mi-_VlsNBhT.js";import{t as s}from"./Texture2DDrawUniform-DswgHdDh-Dbbi-Vrl.js";import{t as c}from"./Texture2DPassUniform-RVTT2Sjh-MHqWw8x6.js";import{c as l,r as u,t as d}from"./Emissions.glsl-C1fRgyHC-CGrS4bf2.js";import{n as f,t as p}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{t as m}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{a as ee,n as te,o as h,r as g}from"./VisualVariables.glsl-DLFsc7-1-BCTRy2of.js";import{n as _,t as v}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{t as y}from"./TerrainDepthTest.glsl-D0F_r5xM-CjVn1995.js";import{t as b}from"./OutputColorHighlightOLID.glsl-DuYrVBF1-BSHMohz0.js";import{r as ne}from"./Transform.glsl-B8LYsJdc-DQSGKLr8.js";import{t as re}from"./VertexColor.glsl-DkZ0DT-i-Dv7AbXX-.js";import{a as ie}from"./MaterialUtil-CTR37o33-D9-rHoNr.js";import{t as ae}from"./MixExternalColor.glsl-uNucrwe0-C34PV_jx.js";import{r as oe}from"./VerticalOffset.glsl-CpSd_uMO-By6AzRsO.js";import{a as se,n as x,r as S,t as C}from"./ReadShadowMap.glsl-dCXMBZ4w-C9FPCZwn.js";import{t as w}from"./Float2PassUniform-oNPLRE_S-DVNswLpf.js";import{t as T}from"./Float2DrawUniform-LhTbmE_3-sFZkHKqr.js";import{c as E,d as D,i as O,l as k,t as A,u as j}from"./SnowCover.glsl-wYbF-EO9-Bo8c42ah.js";import{a as M,c as N,i as P,l as F,n as I,r as L,t as R,u as z}from"./DefaultMaterialAuxiliaryPasses.glsl-DzmFvfsX-Cd7QLUwP.js";import{t as B}from"./Normals.glsl-BBG8Tr27-Dxg59e3m.js";function ce(e,t){return V(e,t)}function V(n,r){let a=n.fragment,{hasVertexTangents:o,doubleSidedMode:l,hasNormalTexture:u,textureCoordinateType:f,bindType:p,hasNormalTextureTransform:m}=r;o?(n.attributes.add(`tangent`,`vec4`),n.varyings.add(`vTangent`,`vec4`),l===2?a.code.add(i`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = gl_FrontFacing ? vTangent.w : -vTangent.w;
vec3 tangent = normalize(gl_FrontFacing ? vTangent.xyz : -vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`):a.code.add(i`mat3 computeTangentSpace(vec3 normal) {
float tangentHeadedness = vTangent.w;
vec3 tangent = normalize(vTangent.xyz);
vec3 bitangent = cross(normal, tangent) * tangentHeadedness;
return mat3(tangent, bitangent, normal);
}`)):a.code.add(i`mat3 computeTangentSpace(vec3 normal, vec3 pos, vec2 st) {
vec3 Q1 = dFdx(pos);
vec3 Q2 = dFdy(pos);
vec2 stx = dFdx(st);
vec2 sty = dFdy(st);
float det = stx.t * sty.s - sty.t * stx.s;
vec3 T = stx.t * Q2 - sty.t * Q1;
T = T - normal * dot(normal, T);
T *= inversesqrt(max(dot(T,T), 1.e-10));
vec3 B = sign(det) * cross(normal, T);
return mat3(T, B, normal);
}`),u&&f!==0&&(n.include(d,r),a.uniforms.add(p===1?new c(`normalTexture`,e=>e.textureNormal):new s(`normalTexture`,e=>e.textureNormal)),m&&(a.uniforms.add(p===1?new w(`scale`,e=>e.scale??t):new T(`scale`,e=>e.scale??t)),a.uniforms.add(new h(`normalTextureTransformMatrix`,t=>t.normalTextureTransformMatrix??e))),a.code.add(i`vec3 computeTextureNormal(mat3 tangentSpace, vec2 uv) {
vec3 rawNormal = textureLookup(normalTexture, uv).rgb * 2.0 - 1.0;`),m&&a.code.add(i`mat3 normalRotation = mat3(normalTextureTransformMatrix[0][0]/scale[0], normalTextureTransformMatrix[0][1]/scale[1], 0.0,
normalTextureTransformMatrix[1][0]/scale[0], normalTextureTransformMatrix[1][1]/scale[1], 0.0,
0.0, 0.0, 0.0 );
rawNormal.xy = (normalRotation * vec3(rawNormal.x, rawNormal.y, 1.0)).xy;`),a.code.add(i`return tangentSpace * rawNormal;
}`))}function H(t,n){n.hasColorTextureTransform?(t.varyings.add(`colorUV`,`vec2`),t.vertex.uniforms.add(new h(`colorTextureTransformMatrix`,t=>t.colorTextureTransformMatrix??e)).code.add(i`void forwardColorUV(){
colorUV = (colorTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardColorUV(){}`)}function U(t,n){n.hasNormalTextureTransform&&n.textureCoordinateType!==0?(t.varyings.add(`normalUV`,`vec2`),t.vertex.uniforms.add(new h(`normalTextureTransformMatrix`,t=>t.normalTextureTransformMatrix??e)).code.add(i`void forwardNormalUV(){
normalUV = (normalTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardNormalUV(){}`)}function W(t,n){n.hasEmissionTextureTransform&&n.textureCoordinateType!==0?(t.varyings.add(`emissiveUV`,`vec2`),t.vertex.uniforms.add(new h(`emissiveTextureTransformMatrix`,t=>t.emissiveTextureTransformMatrix??e)).code.add(i`void forwardEmissiveUV(){
emissiveUV = (emissiveTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardEmissiveUV(){}`)}function G(t,n){n.hasOcclusionTextureTransform&&n.textureCoordinateType!==0?(t.varyings.add(`occlusionUV`,`vec2`),t.vertex.uniforms.add(new h(`occlusionTextureTransformMatrix`,t=>t.occlusionTextureTransformMatrix??e)).code.add(i`void forwardOcclusionUV(){
occlusionUV = (occlusionTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardOcclusionUV(){}`)}function le(t,n){n.hasMetallicRoughnessTextureTransform&&n.textureCoordinateType!==0?(t.varyings.add(`metallicRoughnessUV`,`vec2`),t.vertex.uniforms.add(new h(`metallicRoughnessTextureTransformMatrix`,t=>t.metallicRoughnessTextureTransformMatrix??e)).code.add(i`void forwardMetallicRoughnessUV(){
metallicRoughnessUV = (metallicRoughnessTextureTransformMatrix * vec3(vuv0, 1.0)).xy;
}`)):t.vertex.code.add(i`void forwardMetallicRoughnessUV(){}`)}function K(e){let t=new n,{attributes:s,vertex:d,fragment:h,varyings:w}=t,{output:T,normalType:V,offsetBackfaces:K,spherical:q,snowCover:J,pbrMode:Y,textureAlphaPremultiplied:ue,instancedDoublePrecision:de,hasVertexColors:X,hasVertexTangents:Z,hasColorTexture:Q,hasNormalTexture:fe,hasNormalTextureTransform:pe,hasColorTextureTransform:me}=e;if(_(d,e),s.add(`position`,`vec3`),w.add(`vpos`,`vec3`,{invariant:!0}),t.include(ee,e),t.include(P,e),t.include(oe,e),t.include(H,e),!l(T))return t.include(F,e),t;t.include(U,e),t.include(W,e),t.include(G,e),t.include(le,e),v(d,e),t.include(I,e),t.include(ne);let $=V===0||V===1;return $&&K&&t.include(z),t.include(ce,e),t.include(M,e),t.include(R,e),w.add(`vPositionLocal`,`vec3`),t.include(u,e),t.include(N,e),t.include(re,e),d.uniforms.add(new m(`externalColor`,e=>e.externalColor,{supportsNaN:!0})),w.add(`vcolorExt`,`vec4`),t.include(y,e),d.include(g),d.include(te),t.include(de?S:x,e),d.main.add(i`
    forwardVertexColor();

    MaskedColor maskedColor =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColor.color;
    forwardColorMixMode(maskedColor.mask);

    vpos = getVertexInLocalOriginSpace();
    vPositionLocal = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    ${r($,`vNormalWorld = dpNormal(vvLocalNormal(normalModel()));`)}
    vpos = addVerticalOffset(vpos, localOrigin);
    ${r(Z,`vTangent = dpTransformVertexTangent(tangent);`)}
    gl_Position = transformPosition(proj, view, vpos);
    ${r($&&K,`gl_Position = offsetBackfacingClipPosition(gl_Position, vpos, vNormalWorld, cameraPosition);`)}

    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardTextureCoordinates();
    forwardColorUV();
    forwardNormalUV();
    forwardEmissiveUV();
    forwardOcclusionUV();
    forwardMetallicRoughnessUV();

    if (opacityMixMode != ${i.int(ie.ignore)} && vcolorExt.a < ${i.float(f)}) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
    }
    forwardLinearDepthToReadShadowMap();
  `),h.include(D,e),h.include(E,e),t.include(L,e),h.include(p,e),t.include(b,e),v(h,e),h.uniforms.add(d.uniforms.get(`localOrigin`),new a(`ambient`,e=>e.ambient),new a(`diffuse`,e=>e.diffuse),new o(`opacity`,e=>e.opacity),new o(`layerOpacity`,e=>e.layerOpacity)),Q&&h.uniforms.add(new c(`tex`,e=>e.texture)),t.include(k,e),h.include(C,e),h.include(ae),t.include(B,e),h.include(j,e),O(h),A(h),se(h),h.main.add(i`
    discardBySlice(vpos);
    discardByTerrainDepth();
    ${Q?i`
            vec4 texColor = texture(tex, ${me?`colorUV`:`vuv0`});
            ${r(ue,`texColor.rgb /= texColor.a;`)}
            discardOrAdjustAlpha(texColor);`:i`vec4 texColor = vec4(1.0);`}
    shadingParams.viewDirection = normalize(vpos - cameraPosition);
    ${V===2?i`vec3 normal = screenDerivativeNormal(vPositionLocal);`:i`shadingParams.normalView = vNormalWorld;
                vec3 normal = shadingNormal(shadingParams);`}
    applyPBRFactors();
    float ssao = evaluateAmbientOcclusionInverse() * getBakedOcclusion();

    vec3 posWorld = vpos + localOrigin;

    float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
    float shadow = readShadow(additionalAmbientScale, vpos);

    vec3 matColor = max(ambient, diffuse);
    vec3 albedo = mixExternalColor(${r(X,`vColor.rgb *`)} matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
    float opacity_ = layerOpacity * mixExternalOpacity(${r(X,`vColor.a * `)} opacity, texColor.a, vcolorExt.a, opacityMixMode);

    ${fe?`mat3 tangentSpace = computeTangentSpace(${Z?`normal`:`normal, vpos, vuv0`});\n            vec3 shadingNormal = computeTextureNormal(tangentSpace, ${pe?`normalUV`:`vuv0`});`:`vec3 shadingNormal = normal;`}
    vec3 normalGround = ${q?`normalize(posWorld);`:`vec3(0.0, 0.0, 1.0);`}

    ${r(J,i`
          float snow = getSnow(normal, normalGround);
          albedo = mix(albedo, vec3(1), snow);
          shadingNormal = mix(shadingNormal, normal, snow);
          ssao = mix(ssao, 1.0, snow);`)}

    vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;

    ${Y===1||Y===2?i`
            float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${r(J,`mrr = applySnowToMRR(mrr, snow);`)}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, additionalAmbientIrradiance);`:i`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
    vec4 finalColor = vec4(shadedColor, opacity_);
    outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${r(J,`, snow`)});
  `),t}var q=Object.freeze(Object.defineProperty({__proto__:null,build:K},Symbol.toStringTag,{value:`Module`}));export{q as n,K as t};