import{d as e}from"./screenUtils-TBnwIy4h-DHFvz9lM.js";import{n as t}from"./vec4f64-DFGee9an-Ds_BsC0f.js";import{l as n}from"./vec4-DqQz8Ac_-E812nRgt.js";import{t as r}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as i}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{t as a}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{n as o,r as s}from"./ScreenSizePerspective.glsl-Dmu3eZ8--BjGhRx0o.js";var c=class{constructor(t){this.screenLength=e(t.screenLength),this.minWorldLength=t.minWorldLength??0,this.maxWorldLength=t.maxWorldLength??1/0}};function l(e,t){let n=e.vertex;t.hasVerticalOffset?(d(n),t.hasScreenSizePerspective&&(e.include(o),s(n),a(e.vertex,t)),n.code.add(r`
      vec3 calculateVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        float viewDistance = length((view * vec4(worldPos, 1.0)).xyz);
        ${t.spherical?r`vec3 worldNormal = normalize(worldPos + localOrigin);`:r`vec3 worldNormal = vec3(0.0, 0.0, 1.0);`}
        ${t.hasScreenSizePerspective?r`
            float cosAngle = dot(worldNormal, normalize(worldPos - cameraPosition));
            float verticalOffsetScreenHeight = screenSizePerspectiveScaleFloat(verticalOffset.x, abs(cosAngle), viewDistance, screenSizePerspectiveAlignment);`:r`
            float verticalOffsetScreenHeight = verticalOffset.x;`}
        // Screen sized offset in world space, used for example for line callouts
        float worldOffset = clamp(verticalOffsetScreenHeight * verticalOffset.y * viewDistance, verticalOffset.z, verticalOffset.w);
        return worldNormal * worldOffset;
      }

      vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) {
        return worldPos + calculateVerticalOffset(worldPos, localOrigin);
      }
    `)):n.code.add(r`vec3 addVerticalOffset(vec3 worldPos, vec3 localOrigin) { return worldPos; }`)}var u=t();function d(e){e.uniforms.add(new i(`verticalOffset`,(e,t)=>{let{minWorldLength:r,maxWorldLength:i,screenLength:a}=e.verticalOffset,o=Math.tan(.5*t.camera.fovY)/(.5*t.camera.fullViewport[3]);return n(u,a*(t.camera.pixelRatio||1),o,r,i)}))}export{d as n,l as r,c as t};