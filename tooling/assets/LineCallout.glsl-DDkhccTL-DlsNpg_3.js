import{S as e}from"./vec2-aaJlEBBD-CCrQ5eBV.js";import{n as t}from"./vec2f64-D8dbcrKD-BWzTcbaA.js";import{t as n}from"./vec4f64-DFGee9an-Ds_BsC0f.js";import{t as r}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{n as i,t as a}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as o}from"./FloatPassUniform-gHcGW-mi-_VlsNBhT.js";import{t as s}from"./Float2BindUniform-DpaMSVXH-D2fHlh4X.js";import{t as c}from"./ReadDepth.glsl--9xefl90-Ca2Hj69z.js";import{t as l}from"./Texture2DBindUniform-BjIiNL3v-BB2Xk7Bq.js";import{s as u}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{t as d}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{t as f}from"./OutputColorHighlightOLID.glsl-DuYrVBF1-BSHMohz0.js";import{t as p}from"./Float4BindUniform-BljimXR4-BshF8Q3x.js";import{r as m}from"./ScreenSizePerspective.glsl-Dmu3eZ8--BjGhRx0o.js";import{t as h}from"./Float2PassUniform-oNPLRE_S-DVNswLpf.js";import{n as g,r as _,t as v}from"./HUDVisibility.glsl-BMiGDFPE-BGRZCPco.js";function y(e){e.include(c),e.uniforms.add(new l(`geometryDepthTexture`,e=>e.geometryDepth?.attachment)),e.code.add(a`bool geometryDepthTest(vec2 pos, float elementDepth) {
float geometryDepth = linearDepthFromTexture(geometryDepthTexture, pos);
return (elementDepth < (geometryDepth - 1.0));
}`)}function b(t){let c=new r,{vertex:l,fragment:b}=c,{terrainDepthTest:C}=t;return l.include(g),c.include(_,t),c.vertex.include(u,t),t.hudDepth||c.include(f,t),c.attributes.add(`uv0`,`vec2`),l.uniforms.add(new p(`viewport`,e=>e.camera.fullViewport),new o(`lineSize`,(e,t)=>e.size>0?Math.max(1,e.size)*t.camera.pixelRatio:0),new s(`pixelToNDC`,t=>e(S,2/t.camera.fullViewport[2],2/t.camera.fullViewport[3])),new o(`borderSize`,(e,t)=>e.borderColor?t.camera.pixelRatio:0),new h(`screenOffset`,(t,n)=>e(S,t.horizontalScreenOffset*n.camera.pixelRatio,0))),c.varyings.add(`coverageSampling`,`vec4`),c.varyings.add(`lineSizes`,`vec2`),C&&c.varyings.add(`depth`,`float`),t.useVisibilityPixel&&c.include(v),t.hasScreenSizePerspective&&m(l),l.main.add(a`
    ProjectHUDAux projectAux;
    vec4 endPoint = projectPositionHUD(projectAux);

    vec3 vpos = projectAux.posModel;
    if (rejectBySlice(vpos)) {
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    }
    ${i(t.useVisibilityPixel,a`if (!testHUDVisibility(endPoint)) {
             gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
             return;
           }`)}

    ${t.hasScreenSizePerspective?a`vec3 perspectiveFactor = screenSizePerspectiveScaleFactor(projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);
               vec2 screenOffsetScaled = applyScreenSizePerspectiveScaleFactorVec2(screenOffset, perspectiveFactor);`:`vec2 screenOffsetScaled = screenOffset;`}
    // Add view dependent polygon offset to get exact same original starting point. This is mostly used to get the
    // correct depth value
    vec3 posView = (view * vec4(position, 1.0)).xyz;
    ${i(C,`depth = posView.z;`)}

    applyHUDViewDependentPolygonOffset(centerOffsetAndDistance.w, projectAux.absCosAngle, posView);
    vec4 startPoint = proj * vec4(posView, 1.0);

    // Apply screen offset to both start and end point
    vec2 screenOffsetNorm = screenOffsetScaled * 2.0 / viewport.zw;
    startPoint.xy += screenOffsetNorm * startPoint.w;
    endPoint.xy += screenOffsetNorm * endPoint.w;

    // Align start and end to pixel origin
    vec4 startAligned = alignToPixelOrigin(startPoint, viewport.zw);
    vec4 endAligned = alignToPixelOrigin(endPoint, viewport.zw);
    ${i(t.hudDepth,t.hudDepthAlignStart?`endAligned = vec4(endAligned.xy / endAligned.w * startAligned.w, startAligned.zw);`:`startAligned = vec4(startAligned.xy / startAligned.w * endAligned.w, endAligned.zw);`)}
    vec4 projectedPosition = mix(startAligned, endAligned, uv0.y);

    // The direction of the line in screen space
    vec2 screenSpaceDirection = normalize(endAligned.xy / endAligned.w - startAligned.xy / startAligned.w);
    vec2 perpendicularScreenSpaceDirection = vec2(screenSpaceDirection.y, -screenSpaceDirection.x);
    ${t.hasScreenSizePerspective?a`float lineSizeScaled = applyScreenSizePerspectiveScaleFactorFloat(lineSize, perspectiveFactor);
               float borderSizeScaled = applyScreenSizePerspectiveScaleFactorFloat(borderSize, perspectiveFactor);`:a`float lineSizeScaled = lineSize;
               float borderSizeScaled = borderSize;`}
    float halfPixelSize = lineSizeScaled * 0.5;

    // Compute full ndc offset, adding 1px padding for doing anti-aliasing and the border size
    float padding = 1.0 + borderSizeScaled;
    vec2 ndcOffset = (-halfPixelSize - padding + uv0.x * (lineSizeScaled + padding + padding)) * pixelToNDC;

    // Offset x/y from the center of the line in screen space
    projectedPosition.xy += perpendicularScreenSpaceDirection * ndcOffset * projectedPosition.w;

    // Compute a coverage varying which we can use in the fragment shader to determine
    // how much a pixel is actually covered by the line (i.e. to anti alias the line).
    // This works by computing two coordinates that can be linearly interpolated and then
    // subtracted to find out how far away from the line edge we are.
    float edgeDirection = (uv0.x * 2.0 - 1.0);

    float halfBorderSize = 0.5 * borderSizeScaled;
    float halfPixelSizeAndBorder = halfPixelSize + halfBorderSize;
    float outerEdgeCoverageSampler = edgeDirection * (halfPixelSizeAndBorder + halfBorderSize + 1.0);

    float isOneSided = float(lineSizeScaled < 2.0 && borderSize < 2.0);

    coverageSampling = vec4(
      // Edge coordinate
      outerEdgeCoverageSampler,

      // Border edge coordinate
      outerEdgeCoverageSampler - halfPixelSizeAndBorder * isOneSided,

      // Line offset
      halfPixelSize - 0.5,

      // Border offset
      halfBorderSize - 0.5 + halfPixelSizeAndBorder * (1.0 - isOneSided)
    );

    lineSizes = vec2(lineSizeScaled, borderSizeScaled);
    gl_Position = projectedPosition;`),b.uniforms.add(new d(`uColor`,e=>e.color??n),new d(`borderColor`,e=>e.borderColor??n)),C&&(b.include(y,t),b.uniforms.add(new s(`inverseViewport`,e=>e.inverseViewport))),b.main.add(a`
    ${i(C,`if( geometryDepthTest(gl_FragCoord.xy * inverseViewport, depth) ){ discard; }`)}

    vec2 coverage = min(1.0 - clamp(abs(coverageSampling.xy) - coverageSampling.zw, 0.0, 1.0), lineSizes);

    float borderAlpha = uColor.a * borderColor.a * coverage.y;
    float colorAlpha = uColor.a * coverage.x;

    float finalAlpha = mix(borderAlpha, 1.0, colorAlpha);
    ${i(t.hudDepth,a`
    if (max(coverage.x, coverage.y) < ${a.float(x)}) discard;`,a`
    vec3 finalRgb = mix(borderColor.rgb * borderAlpha, uColor.rgb, colorAlpha);
    outputColorHighlightOLID(vec4(finalRgb, finalAlpha), finalRgb);`)}`),c}var x=.5,S=t(),C=Object.freeze(Object.defineProperty({__proto__:null,build:b},Symbol.toStringTag,{value:`Module`}));export{b as n,C as t};