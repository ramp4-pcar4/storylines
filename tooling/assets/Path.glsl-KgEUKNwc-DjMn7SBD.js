import{o as e}from"./vec2f64-D8dbcrKD-BWzTcbaA.js";import{t}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{n,t as r}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as i}from"./Float3PassUniform-BEhcqx4m-DR57WjmF.js";import{t as a}from"./FloatPassUniform-gHcGW-mi-_VlsNBhT.js";import{c as o}from"./Emissions.glsl-C1fRgyHC-CGrS4bf2.js";import{a as s,r as c,t as l}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{c as u,d,u as f}from"./FloatsPassUniform-WQAJGOL7-CJ9oYnNg.js";import{t as p}from"./ObjectAndLayerIdColor.glsl-C3sEfoJy-iKidzcOy.js";import{t as m}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{i as h,n as g,t as _}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{t as v}from"./TerrainDepthTest.glsl-D0F_r5xM-CjVn1995.js";import{t as y}from"./OutputColorHighlightOLID.glsl-DuYrVBF1-BSHMohz0.js";import{a as b,r as x}from"./Transform.glsl-B8LYsJdc-DQSGKLr8.js";import{a as S,n as C}from"./ReadShadowMap.glsl-dCXMBZ4w-C9FPCZwn.js";import{t as w}from"./Float2PassUniform-oNPLRE_S-DVNswLpf.js";import{c as T,d as E,i as D,l as O,n as k,t as A,u as j}from"./SnowCover.glsl-wYbF-EO9-CaaFoAzr.js";import{t as M}from"./Normals.glsl-BBG8Tr27-Dxg59e3m.js";import{t as N}from"./NormalUtils.glsl-CWSzXXL2-5EWleM21.js";var P=8;function F(e,t){let{attributes:o,vertex:s}=e;o.add(`position`,`vec3`),o.add(`profileVertexAndNormal`,`vec4`),o.add(`profileAuxData`,`vec3`),o.add(`profileRight`,`vec2`),o.add(`profileUp`,`vec2`),s.code.add(r`bool isCapVertex() {
return profileAuxData.z == 1.0;
}`),s.uniforms.add(new w(`size`,e=>e.size));let{hasVVSize:c,hasVVColor:l,hasVVOpacity:d}=t;c?(o.add(`sizeFeatureAttribute`,`float`),s.uniforms.add(new i(`vvSizeMinSize`,e=>e.vvSize.minSize),new i(`vvSizeMaxSize`,e=>e.vvSize.maxSize),new i(`vvSizeOffset`,e=>e.vvSize.offset),new i(`vvSizeFactor`,e=>e.vvSize.factor),new i(`vvSizeFallback`,e=>e.vvSize.fallback)),s.code.add(r`vec2 getSize() {
float value = sizeFeatureAttribute;
if (isnan(value)) {
return vvSizeFallback.xz;
}
return size * clamp(vvSizeOffset + value * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).xz;
}`)):s.code.add(r`vec2 getSize(){
return size;
}`),d?(o.add(`opacityFeatureAttribute`,`float`),s.constants.add(`vvOpacityNumber`,`int`,P),s.uniforms.add(new u(`vvOpacityValues`,P,e=>e.vvOpacity.values),new u(`vvOpacityOpacities`,P,e=>e.vvOpacity.opacityValues),new a(`vvOpacityFallback`,e=>e.vvOpacity.fallback,{supportsNaN:!0})),s.code.add(r`
    vec4 applyOpacity(vec4 color) {
      // if we encounter NaN in the color it means the color is in the fallback case where the symbol color
      // is not defined and there is no valid color visual variable override. In this case just return a fully
      // transparent color
      if (isnan(color.r)) {
        return vec4(0);
      }

      float value = opacityFeatureAttribute;

      if (isnan(value)) {
        // If there is a color vv then it will already have taken care of applying the fallback
        return ${n(l,`color`,`vec4(color.rgb, vvOpacityFallback)`)};
      }

      if (value <= vvOpacityValues[0]) {
        return vec4(color.rgb, vvOpacityOpacities[0]);
      }

      for (int i = 1; i < vvOpacityNumber; ++i) {
        if (vvOpacityValues[i] >= value) {
          float f = (value - vvOpacityValues[i-1]) / (vvOpacityValues[i] - vvOpacityValues[i-1]);
          return vec4(color.rgb, mix(vvOpacityOpacities[i-1], vvOpacityOpacities[i], f));
        }
      }

      return vec4( color.rgb, vvOpacityOpacities[vvOpacityNumber - 1]);
    }
    `)):s.code.add(r`vec4 applyOpacity(vec4 color){
return color;
}`),l?(o.add(`colorFeatureAttribute`,`float`),s.constants.add(`vvColorNumber`,`int`,8),s.uniforms.add(new u(`vvColorValues`,8,e=>e.vvColor.values),new f(`vvColorColors`,8,e=>e.vvColor.colors),new m(`vvColorFallback`,e=>e.vvColor.fallback)),s.code.add(r`vec4 getColor() {
float value = colorFeatureAttribute;
if (isnan(value)) {
return applyOpacity(vvColorFallback);
}
if (value <= vvColorValues[0]) {
return applyOpacity(vvColorColors[0]);
}
for (int i = 1; i < vvColorNumber; ++i) {
if (vvColorValues[i] >= value) {
float f = (value - vvColorValues[i-1]) / (vvColorValues[i] - vvColorValues[i-1]);
return applyOpacity(mix(vvColorColors[i-1], vvColorColors[i], f));
}
}
return applyOpacity(vvColorColors[vvColorNumber - 1]);
}`)):s.code.add(r`vec4 getColor(){
return applyOpacity(vec4(1, 1, 1, 1));
}`),s.code.add(r`vec3 decompressAxis(vec2 axis) {
float z = 1.0 - abs(axis.x) - abs(axis.y);
return normalize(vec3(axis + sign(axis) * min(z, 0.0), z));
}
vec3 calculateVPos() {
vec2 size = getSize();
vec3 origin = position;
vec3 right = decompressAxis(profileRight);
vec3 up = decompressAxis(profileUp);
vec2 profileVertex = profileVertexAndNormal.xy * size;`),s.code.add(r`if(isCapVertex()) {
float positionOffsetAlongProfilePlaneNormal = profileAuxData.x * size[0];
vec3 forward = cross(up, right);
vec3 offset = right * profileVertex.x + up * profileVertex.y + forward * positionOffsetAlongProfilePlaneNormal;
return origin + offset;
}
vec2 rotationRight = vec2(profileAuxData.x, profileAuxData.y);
float maxDistance = length(rotationRight);`),s.code.add(r`rotationRight = maxDistance > 0.0 ? normalize(rotationRight) : vec2(0, 0);
float rx = dot(profileVertex, rotationRight);
if (abs(rx) > maxDistance) {
vec2 rotationUp = vec2(-rotationRight.y, rotationRight.x);
float ry = dot(profileVertex, rotationUp);
profileVertex = rotationRight * maxDistance * sign(rx) + rotationUp * ry;
}
vec3 offset = right * profileVertex.x + up * profileVertex.y;
return origin + offset;
}`),s.code.add(r`vec3 localNormal() {
vec3 right = decompressAxis(profileRight);
vec3 up = decompressAxis(profileUp);
vec3 normal = right * profileVertexAndNormal.z + up * profileVertexAndNormal.w;
if(isCapVertex()) {
vec3 forward = cross(up, right);
normal += forward * profileAuxData.y;
}
return normal;
}`)}var I=class extends d{constructor(){super(...arguments),this.size=e(1,1)}};function L(e){let u=new t,{vertex:d,fragment:f,varyings:m}=u;g(d,e),m.add(`vpos`,`vec3`,{invariant:!0}),u.include(F,e);let{output:w,spherical:P,pbrMode:I,snowCover:L}=e;switch((o(w)||w===9)&&(u.include(x),u.include(C,e),u.include(p,e),u.include(v,e),m.add(`vnormal`,`vec3`),m.add(`vcolor`,`vec4`),d.main.add(r`vpos = calculateVPos();
vnormal = normalize(localNormal());
forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);
forwardObjectAndLayerIdColor();
vcolor = getColor();
forwardLinearDepthToReadShadowMap();`)),w){case 0:u.include(O,e),f.include(E,e),f.include(T,e),u.include(M,e),f.include(l,e),u.include(y,e),_(f,e),D(f),A(f),f.uniforms.add(d.uniforms.get(`localOrigin`),new i(`ambient`,e=>e.ambient),new i(`diffuse`,e=>e.diffuse),new a(`opacity`,e=>e.opacity)),f.include(c),f.include(j,e),S(f),f.main.add(r`
        discardBySlice(vpos);
        discardByTerrainDepth();

        shadingParams.viewDirection = normalize(vpos - cameraPosition);
        shadingParams.normalView = vnormal;
        vec3 normal = shadingNormal(shadingParams);
        float ssao = evaluateAmbientOcclusionInverse();

        vec3 posWorld = vpos + localOrigin;
        vec3 normalGround = ${P?`normalize(posWorld);`:`vec3(0.0, 0.0, 1.0);`}

        vec3 albedo = vcolor.rgb * max(ambient, diffuse); // combine the old material parameters into a single one
        float combinedOpacity = vcolor.a * opacity;

        ${n(L,r`float snow = getSnow(normal, normalGround);
                 albedo = mix(albedo, vec3(1), snow);
                 ssao = mix(ssao, 1.0, snow);`)}

        float additionalAmbientScale = additionalDirectedAmbientLight(posWorld);
        vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
        float shadow = readShadow(additionalAmbientScale, vpos);

        ${n(I===2,`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];\n           ${n(L,`mrr = applySnowToMRR(mrr, snow);`)}`)}

        vec3 shadedColor = ${I===2?`evaluateSceneLightingPBR(normal, albedo, shadow, 1.0 - ssao, additionalLight, shadingParams.viewDirection, normalGround, mrr, additionalAmbientIrradiance);`:`evaluateSceneLighting(normal, albedo, shadow, 1.0 - ssao, additionalLight);`}
        vec4 finalColor = vec4(shadedColor, combinedOpacity);
        outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${n(L,`, snow`)});`);break;case 1:u.include(x),d.main.add(r`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),u.fragment.include(l,e),f.main.add(r`discardBySlice(vpos);`);break;case 3:case 4:case 5:case 6:u.include(x),b(u),m.add(`depth`,`float`),d.main.add(r`vpos = calculateVPos();
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);`),u.fragment.include(l,e),u.include(k,e),f.main.add(r`discardBySlice(vpos);
outputDepth(depth);`);break;case 9:u.fragment.include(l,e),f.main.add(r`discardBySlice(vpos);
outputObjectAndLayerIdColor();`);break;case 2:u.include(x),u.include(N,e),h(d),m.add(`vnormal`,`vec3`),d.main.add(r`vpos = calculateVPos();
vnormal = normalize((viewNormal * vec4(localNormal(), 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);`),u.fragment.include(l,e),f.main.add(r`discardBySlice(vpos);
vec3 normal = normalize(vnormal);
if (gl_FrontFacing == false) normal = -normal;
fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);`);break;case 8:u.include(x),u.include(N,e),m.add(`vnormal`,`vec3`),d.main.add(r`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),u.fragment.include(l,e),u.include(s,e),f.main.add(r`discardBySlice(vpos);
calculateOcclusionAndOutputHighlight();`)}return u}var R=Object.freeze(Object.defineProperty({__proto__:null,build:L},Symbol.toStringTag,{value:`Module`}));export{L as n,R as r,I as t};