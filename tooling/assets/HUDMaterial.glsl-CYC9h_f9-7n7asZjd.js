import{S as e,b as t}from"./vec2-aaJlEBBD-CCrQ5eBV.js";import{n}from"./vec2f64-D8dbcrKD-BWzTcbaA.js";import{t as r}from"./vec4f64-DFGee9an-Ds_BsC0f.js";import{t as i}from"./ShaderBuilder-qfzG-N7a-DmACrk8a.js";import{n as a,t as o}from"./glsl-EDZkDhgF-BXUHa7Co.js";import{t as s}from"./FloatPassUniform-gHcGW-mi-_VlsNBhT.js";import{t as c}from"./Texture2DPassUniform-RVTT2Sjh-MHqWw8x6.js";import{t as l}from"./ReadDepth.glsl--9xefl90-Ca2Hj69z.js";import{t as u}from"./Texture2DBindUniform-BjIiNL3v-BB2Xk7Bq.js";import{a as d,n as f,r as p,s as m}from"./AlphaCutoff-CYKfZXRg-DXKS3VEd.js";import{t as h}from"./ObjectAndLayerIdColor.glsl-C3sEfoJy-iKidzcOy.js";import{t as g}from"./Float4PassUniform-R_rVPKlL-DiM68u5g.js";import{a as _}from"./VisualVariables.glsl-DLFsc7-1-BCTRy2of.js";import{r as v}from"./View.glsl-DtKDkY_h-DkmvCuEr.js";import{t as y}from"./TerrainDepthTest.glsl-D0F_r5xM-CjVn1995.js";import{t as ee}from"./Float4BindUniform-BljimXR4-BshF8Q3x.js";import{n as b,r as x,t as S}from"./ScreenSizePerspective.glsl-Dmu3eZ8--BjGhRx0o.js";import{t as C}from"./Float2PassUniform-oNPLRE_S-DVNswLpf.js";import{t as w}from"./PositionOutsideClipSpace-I4C860lT-BrKdM2ya.js";import{n as T,r as E,t as D}from"./HUDVisibility.glsl-BMiGDFPE-BGRZCPco.js";function O(e,t){let{vertex:n,fragment:r}=e;e.include(y,t),n.include(T),n.main.add(o`vec4 posProjCenter;
if (dot(position, position) > 0.0) {
ProjectHUDAux projectAux;
vec4 posProj = projectPositionHUD(projectAux);
posProjCenter = alignToPixelCenter(posProj, viewport.zw);
forwardViewPosDepth(projectAux.posView);
vec3 vpos = projectAux.posModel;
if (rejectBySlice(vpos)) {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
} else {
posProjCenter = vec4(1e038, 1e038, 1e038, 1.0);
}
gl_Position = posProjCenter;
gl_PointSize = 1.0;`),r.main.add(o`fragColor = vec4(1);
if(discardByTerrainDepth()) {
fragColor.g = 0.5;
}`)}function k(t){let n=new i;if(n.include(E,t),n.vertex.include(m,t),t.occlusionPass)return n.include(O,t),n;let{output:y,oitPass:k,hasOcclusionTexture:N,signedDistanceFieldEnabled:P,useVisibilityPixel:I,pixelSnappingEnabled:L,hasEmission:R,hasScreenSizePerspective:z,debugDrawLabelBorder:B,hasVVSize:V,hasVVColor:H,hasRotation:U,occludedFragmentFade:W,sampleSignedDistanceFieldTexelCenter:G}=t;n.include(b),n.include(_,t),n.include(h,t),I&&n.include(D);let{vertex:K,fragment:q}=n;q.include(p),n.varyings.add(`vcolor`,`vec4`),n.varyings.add(`vtc`,`vec2`),n.varyings.add(`vsize`,`vec2`);let J=y===8,Y=J&&I;Y&&n.varyings.add(`voccluded`,`float`),K.uniforms.add(new ee(`viewport`,e=>e.camera.fullViewport),new C(`screenOffset`,(t,n)=>e(M,2*t.screenOffset[0]*n.camera.pixelRatio,2*t.screenOffset[1]*n.camera.pixelRatio)),new C(`anchorPosition`,e=>j(e)),new g(`materialColor`,({color:e})=>e),new s(`materialRotation`,e=>e.rotation),new c(`tex`,e=>e.texture)),v(K),P&&(K.uniforms.add(new g(`outlineColor`,e=>e.outlineColor)),q.uniforms.add(new g(`outlineColor`,e=>A(e)?e.outlineColor:r),new s(`outlineSize`,e=>A(e)?e.outlineSize:0))),L&&K.include(T),z&&(S(K),x(K)),B&&n.varyings.add(`debugBorderCoords`,`vec4`),n.attributes.add(`uv0`,`vec2`),n.attributes.add(`uvi`,`vec4`),n.attributes.add(`color`,`vec4`),n.attributes.add(`size`,`vec2`),n.attributes.add(`rotation`,`float`),(V||H)&&n.attributes.add(`featureAttribute`,`vec4`),K.main.add(o`
    ProjectHUDAux projectAux;
    vec4 posProj = projectPositionHUD(projectAux);
    forwardObjectAndLayerIdColor();

    if (rejectBySlice(projectAux.posModel)) {
      gl_Position = ${w};
      return;
    }

    vec2 inputSize;
    ${a(z,o`
        inputSize = screenSizePerspectiveScaleVec2(size, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspective);
        vec2 screenOffsetScaled = screenSizePerspectiveScaleVec2(screenOffset, projectAux.absCosAngle, projectAux.distanceToCamera, screenSizePerspectiveAlignment);`,o`
        inputSize = size;
        vec2 screenOffsetScaled = screenOffset;`)}
    ${a(V,o`inputSize *= vvScale(featureAttribute).xx;`)}

    vec2 combinedSize = inputSize * pixelRatio;
    vec4 quadOffset = vec4(0.0);

    ${a(I,o`
        bool visible = testHUDVisibility(posProj);
        if (!visible) {
          vtc = vec2(0.0);
          ${a(B,`debugBorderCoords = vec4(0.5, 0.5, 1.5 / combinedSize);`)}
          return;
        }
      `)}
    ${a(Y,o`voccluded = visible ? 0.0 : 1.0;`)}
  `);let X=o`
    vec2 uv = mix(uvi.xy, uvi.zw, bvec2(uv0));
    vec2 texSize = vec2(textureSize(tex, 0));
    uv = mix(vec2(1.0), uv / texSize, lessThan(uv, vec2(${F})));
    quadOffset.xy = (uv0 - anchorPosition) * 2.0 * combinedSize;

    ${a(U,o`
        float angle = radians(materialRotation + rotation);
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        mat2 rotate = mat2(cosAngle, -sinAngle, sinAngle,  cosAngle);

        quadOffset.xy = rotate * quadOffset.xy;
      `)}

    quadOffset.xy = (quadOffset.xy + screenOffsetScaled) / viewport.zw * posProj.w;
  `,Z=L?P?o`posProj = alignToPixelOrigin(posProj, viewport.zw) + quadOffset;`:o`posProj += quadOffset;
if (inputSize.x == size.x) {
posProj = alignToPixelOrigin(posProj, viewport.zw);
}`:o`posProj += quadOffset;`;K.main.add(o`
    ${X}
    ${H?`vcolor = interpolateVVColor(featureAttribute.y) * materialColor;`:`vcolor = color * materialColor;`}

    ${a(y===9,o`vcolor.a = 1.0;`)}

    bool alphaDiscard = vcolor.a < ${o.float(f)};
    ${a(P,`alphaDiscard = alphaDiscard && outlineColor.a < ${o.float(f)};`)}
    if (alphaDiscard) {
      // "early discard" if both symbol color (= fill) and outline color (if applicable) are transparent
      gl_Position = vec4(1e38, 1e38, 1e38, 1.0);
      return;
    } else {
      ${Z}
      gl_Position = posProj;
    }

    vtc = uv;

    ${a(B,o`debugBorderCoords = vec4(uv0, 1.5 / combinedSize);`)}
    vsize = inputSize;
  `),q.uniforms.add(new c(`tex`,e=>e.texture)),W&&!J&&(q.include(l),q.uniforms.add(new u(`depthMap`,e=>e.mainDepth),new s(`occludedOpacity`,e=>e.occludedFragmentOpacity?.value??1))),N&&q.uniforms.add(new u(`texOcclusion`,e=>e.hudOcclusion?.attachment));let Q=B?o`(isBorder > 0.0 ? 0.0 : ${o.float(f)})`:o.float(f),$=o`
    ${a(B,o`float isBorder = float(any(lessThan(debugBorderCoords.xy, debugBorderCoords.zw)) || any(greaterThan(debugBorderCoords.xy, 1.0 - debugBorderCoords.zw)));`)}

    vec2 samplePos = vtc;

    ${a(G,o`
      float txSize = float(textureSize(tex, 0).x);
      float texelSize = 1.0 / txSize;

      // Calculate how much we have to add/subtract to/from each texel to reach the size of an onscreen pixel
      vec2 scaleFactor = (vsize - txSize) * texelSize;
      samplePos += (vec2(1.0, -1.0) * texelSize) * scaleFactor;`)}

    ${P?o`
      vec4 fillPixelColor = vcolor;

      // Get distance in output units (i.e. pixels)

      float sdf = texture(tex, samplePos).r;
      float pixelDistance = sdf * vsize.x;

      // Create smooth transition from the icon into its outline
      float fillAlphaFactor = clamp(0.5 - pixelDistance, 0.0, 1.0);
      fillPixelColor.a *= fillAlphaFactor;

      if (outlineSize > 0.25) {
        vec4 outlinePixelColor = outlineColor;
        float clampedOutlineSize = min(outlineSize, 0.5*vsize.x);

        // Create smooth transition around outline
        float outlineAlphaFactor = clamp(0.5 - (abs(pixelDistance) - 0.5*clampedOutlineSize), 0.0, 1.0);
        outlinePixelColor.a *= outlineAlphaFactor;

        if (
          outlineAlphaFactor + fillAlphaFactor < ${Q} ||
          fillPixelColor.a + outlinePixelColor.a < ${o.float(f)}
        ) {
          discard;
        }

        // perform un-premultiplied over operator (see https://en.wikipedia.org/wiki/Alpha_compositing#Description)
        float compositeAlpha = outlinePixelColor.a + fillPixelColor.a * (1.0 - outlinePixelColor.a);
        vec3 compositeColor = vec3(outlinePixelColor) * outlinePixelColor.a +
                              vec3(fillPixelColor) * fillPixelColor.a * (1.0 - outlinePixelColor.a);

        ${a(!J,o`fragColor = vec4(compositeColor, compositeAlpha);`)}
      } else {
        if (fillAlphaFactor < ${Q}) {
          discard;
        }

        ${a(!J,o`fragColor = premultiplyAlpha(fillPixelColor);`)}
      }

      // visualize SDF:
      // fragColor = vec4(clamp(-pixelDistance/vsize.x*2.0, 0.0, 1.0), clamp(pixelDistance/vsize.x*2.0, 0.0, 1.0), 0.0, 1.0);
      `:o`
          vec4 texColor = texture(tex, samplePos, -0.5);
          if (texColor.a < ${Q}) {
            discard;
          }
          ${a(!J,o`fragColor = texColor * premultiplyAlpha(vcolor);`)}
          `}

    ${a(W&&!J,o`
        float zSample = -linearizeDepth(texelFetch(depthMap, ivec2(gl_FragCoord.xy), 0).x);
        float zFragment = -linearizeDepth(gl_FragCoord.z);
        if (zSample < ${o.float(1-te)} * zFragment) {
          fragColor *= occludedOpacity;
        }
      `)}
    ${a(N,o`fragColor *= texelFetch(texOcclusion, ivec2(gl_FragCoord.xy), 0).r;`)}

    ${a(!J&&B,o`fragColor = mix(fragColor, vec4(1.0, 0.0, 1.0, 1.0), isBorder * 0.5);`)}

    ${a(k===2,o`
    if (fragColor.a < ${o.float(f)}) {
      discard;
    }`)}
  `;switch(y){case 0:n.outputs.add(`fragColor`,`vec4`,0),R&&n.outputs.add(`fragEmission`,`vec4`,1),k===1&&n.outputs.add(`fragAlpha`,`float`,R?2:1),q.main.add(o`
        ${$}
        // Unlike other materials, the fragment shader outputs premultiplied colors.
        // Disable this for front face rendering for correct OIT compositing.
        ${a(k===2,o`fragColor.rgb /= fragColor.a;`)}
        ${a(R,o`fragEmission = vec4(0.0);`)}
        ${a(k===1,o`fragAlpha = fragColor.a;`)}`);break;case 9:q.main.add(o`
        ${$}
        outputObjectAndLayerIdColor();`);break;case 8:n.include(d,t),q.main.add(o`
        ${$}
        outputHighlight(${a(Y,o`voccluded == 1.0`,o`false`)});`)}return n}function A(e){return e.outlineColor[3]>0&&e.outlineSize>0}function j(e){return e.textureIsSignedDistanceField?N(e.anchorPosition,e.distanceFieldBoundingBox,M):t(M,e.anchorPosition),M}var M=n();function N(t,n,r){e(r,t[0]*(n[2]-n[0])+n[0],t[1]*(n[3]-n[1])+n[1])}var te=.08,P=32e3,F=o.float(P),I=Object.freeze(Object.defineProperty({__proto__:null,build:k,calculateAnchorPosition:j,fullUV:P},Symbol.toStringTag,{value:`Module`}));export{P as i,I as n,k as r,j as t};