import{o as e}from"./vec2f64-HyGRlEgg-ChPkVDML.js";import{t}from"./ShaderBuilder-Dy-kUWY5-Xkes0yhG.js";import{n,t as r}from"./glsl-BgsHvHfn-n7nRq5tN.js";import{_ as i,c as a,g as o}from"./Emissions.glsl-BNo-_bKx-DN-3kOQR.js";import{Bt as s,Ft as c,Gt as l,Lt as u,Vt as d,Wt as f,X as p,_n as m,bn as h,dn as g,gn as _,mn as v,pn as y,qt as b,vn as x,xn as S}from"./FloatArray-CCh0HzKA-DllKqWgH.js";import{C,T as w,_ as T,c as E,f as D,g as O,l as k,u as A,v as j,y as M}from"./DefaultMaterial-jj1zY5ZD-Daj8Sdx1.js";import{t as N}from"./NormalUtils.glsl-YfLK241p-BNvC6ie1.js";var P=8;function F(e,t){let{attributes:a,vertex:s}=e;a.add(`position`,`vec3`),a.add(`profileVertexAndNormal`,`vec4`),a.add(`profileAuxData`,`vec3`),a.add(`profileRight`,`vec2`),a.add(`profileUp`,`vec2`),s.code.add(r`bool isCapVertex() {
return profileAuxData.z == 1.0;
}`),s.uniforms.add(new p(`size`,e=>e.size));let{hasVVSize:c,hasVVColor:l,hasVVOpacity:u}=t;c?(a.add(`sizeFeatureAttribute`,`float`),s.uniforms.add(new i(`vvSizeMinSize`,e=>e.vvSize.minSize),new i(`vvSizeMaxSize`,e=>e.vvSize.maxSize),new i(`vvSizeOffset`,e=>e.vvSize.offset),new i(`vvSizeFactor`,e=>e.vvSize.factor),new i(`vvSizeFallback`,e=>e.vvSize.fallback)),s.code.add(r`vec2 getSize() {
float value = sizeFeatureAttribute;
if (isnan(value)) {
return vvSizeFallback.xz;
}
return size * clamp(vvSizeOffset + value * vvSizeFactor, vvSizeMinSize, vvSizeMaxSize).xz;
}`)):s.code.add(r`vec2 getSize(){
return size;
}`),u?(a.add(`opacityFeatureAttribute`,`float`),s.constants.add(`vvOpacityNumber`,`int`,P),s.uniforms.add(new g(`vvOpacityValues`,P,e=>e.vvOpacity.values),new g(`vvOpacityOpacities`,P,e=>e.vvOpacity.opacityValues),new o(`vvOpacityFallback`,e=>e.vvOpacity.fallback,{supportsNaN:!0})),s.code.add(r`
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
}`),l?(a.add(`colorFeatureAttribute`,`float`),s.constants.add(`vvColorNumber`,`int`,8),s.uniforms.add(new g(`vvColorValues`,8,e=>e.vvColor.values),new y(`vvColorColors`,8,e=>e.vvColor.colors),new _(`vvColorFallback`,e=>e.vvColor.fallback)),s.code.add(r`vec4 getColor() {
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
}`)}var I=class extends v{constructor(){super(...arguments),this.size=e(1,1)}};function L(e){let p=new t,{vertex:g,fragment:_,varyings:v}=p;l(g,e),v.add(`vpos`,`vec3`,{invariant:!0}),p.include(F,e);let{output:y,spherical:P,pbrMode:I,snowCover:L}=e;switch((a(y)||y===9)&&(p.include(c),p.include(C,e),p.include(m,e),p.include(d,e),v.add(`vnormal`,`vec3`),v.add(`vcolor`,`vec4`),g.main.add(r`vpos = calculateVPos();
vnormal = normalize(localNormal());
forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);
forwardObjectAndLayerIdColor();
vcolor = getColor();
forwardLinearDepthToReadShadowMap();`)),y){case 0:p.include(T,e),_.include(M,e),_.include(O,e),p.include(E,e),_.include(x,e),p.include(s,e),f(_,e),D(_),k(_),_.uniforms.add(g.uniforms.get(`localOrigin`),new i(`ambient`,e=>e.ambient),new i(`diffuse`,e=>e.diffuse),new o(`opacity`,e=>e.opacity)),_.include(h),_.include(j,e),w(_),_.main.add(r`
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
        outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${n(L,`, snow`)});`);break;case 1:p.include(c),g.main.add(r`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),p.fragment.include(x,e),_.main.add(r`discardBySlice(vpos);`);break;case 3:case 4:case 5:case 6:p.include(c),u(p),v.add(`depth`,`float`),g.main.add(r`vpos = calculateVPos();
gl_Position = transformPositionWithDepth(proj, view, vpos, nearFar, depth);`),p.fragment.include(x,e),p.include(A,e),_.main.add(r`discardBySlice(vpos);
outputDepth(depth);`);break;case 9:p.fragment.include(x,e),_.main.add(r`discardBySlice(vpos);
outputObjectAndLayerIdColor();`);break;case 2:p.include(c),p.include(N,e),b(g),v.add(`vnormal`,`vec3`),g.main.add(r`vpos = calculateVPos();
vnormal = normalize((viewNormal * vec4(localNormal(), 1.0)).xyz);
gl_Position = transformPosition(proj, view, vpos);`),p.fragment.include(x,e),_.main.add(r`discardBySlice(vpos);
vec3 normal = normalize(vnormal);
if (gl_FrontFacing == false) normal = -normal;
fragColor = vec4(vec3(0.5) + 0.5 * normal, 1.0);`);break;case 8:p.include(c),p.include(N,e),v.add(`vnormal`,`vec3`),g.main.add(r`vpos = calculateVPos();
gl_Position = transformPosition(proj, view, vpos);`),p.fragment.include(x,e),p.include(S,e),_.main.add(r`discardBySlice(vpos);
calculateOcclusionAndOutputHighlight();`)}return p}var R=Object.freeze(Object.defineProperty({__proto__:null,build:L},Symbol.toStringTag,{value:`Module`}));export{L as n,R as r,I as t};