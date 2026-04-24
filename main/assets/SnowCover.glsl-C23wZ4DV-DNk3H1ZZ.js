const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SSAOBlur.glsl-DPcUXOwd-CGWXrKYG.js","assets/ReadDepth.glsl-DNR_DJR2-BEyDud_v.js","assets/Float2BindUniform-DpaMSVXH-BGReIXIp.js","assets/Uniform-Dp2mgLmf-BM7pSPal.js","assets/glsl-EDZkDhgF-1nQWz_5s.js","assets/vec2-BNGcJ5FZ-dP_UoMdt.js","assets/common-DgIStbYe-B-GQl4G-.js","assets/vec2f64-D8dbcrKD-BS-u17WT.js","assets/SSAOBlur.glsl-_nImQT10-DAzuzHVs.js","assets/Float2DrawUniform-LhTbmE_3-Myz5Izxa.js","assets/FloatPassUniform-gHcGW-mi-B-N7xlye.js","assets/ScreenSpacePass.glsl-EDYRj6we-Cmv1YD9G.js","assets/ShaderBuilder-aUMFb5cS-DVyJ2HBP.js","assets/Error-ndV5rHvq-DjAkQfaK.js","assets/typedArrayUtil-DYSyCOD_-C51R4Gew.js","assets/Texture2DDrawUniform-DswgHdDh-Bo2NvWBA.js","assets/Texture2DPassUniform-RVTT2Sjh-CON65h7T.js","assets/SSAO.glsl-HmHOFiae-CMTIOOdX.js","assets/CameraSpace.glsl-DhKWVhj4-Cbw4qoWA.js","assets/Float4BindUniform-BljimXR4-BRvmHObd.js","assets/vec4-DtLpLkJR-CdKCOdK6.js","assets/vec4f64-DFGee9an-DomfOCrs.js","assets/Gamma.glsl-3nSDeBy7-Bb2s3-zG.js","assets/colorUtils-DDC8SjYu-CR55xSZS.js","assets/SSAO.glsl-CMJXvjDJ-ByoJkoyD.js","assets/Float2PassUniform-oNPLRE_S-Cd3_CB19.js","assets/FloatBindUniform-avAg5yxD-BhZMNpUZ.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-Cyz9Y8Yl.js";import{E as t}from"./promiseUtils-BPG26xDs-DuvMP2mt.js";import{x as n,y as r}from"./decorators-ZlNXPDAo-C42KH3mg.js";import{t as i}from"./time-CZDdoUVM-BEj5rBu0.js";import{i as a}from"./reactiveUtils-6jIZIaR0-CoplyZbf.js";import{n as o}from"./tslib.es6-D23imAM7-Dm7Q6JjB.js";import{h as s}from"./mathUtils-DUZju9LU-CDB96HNW.js";import{S as c}from"./vec2-BNGcJ5FZ-dP_UoMdt.js";import{f as l,u}from"./vec3f64-CG5ySZkG-BgrtjPdM.js";import{p as d}from"./vec3-D0JSMCWt-BPHQgKj2.js";import{n as f}from"./vec2f64-D8dbcrKD-BS-u17WT.js";import{d as p}from"./enums-BXIvOhb7-BNGbPBKh.js";import{a as m,i as h}from"./Texture-SkviwCZk-DmGZudDc.js";import{n as g,t as _}from"./glsl-EDZkDhgF-1nQWz_5s.js";import{t as v}from"./Gamma.glsl-3nSDeBy7-Bb2s3-zG.js";import{t as y}from"./Float3DrawUniform-CLaN-1NK-MY6whRlv.js";import{t as b}from"./Float3PassUniform-BEhcqx4m-Cnyd18mw.js";import{t as x}from"./Texture2DDrawUniform-DswgHdDh-Bo2NvWBA.js";import{t as S}from"./Texture2DPassUniform-RVTT2Sjh-CON65h7T.js";import{t as C}from"./Emissions.glsl-C1fRgyHC-DqMZxEPQ.js";import{t as w}from"./Texture2DBindUniform-BjIiNL3v-BGoTEUTM.js";import{t as T}from"./NoParameters-DvFAVXX5-BVSvNVuL.js";import{t as E}from"./FloatBindUniform-avAg5yxD-BhZMNpUZ.js";import{r as D,u as O}from"./renderState-DZR-41ug-BLC9Ah9x.js";import{c as k,f as A,o as ee,p as j,r as te}from"./SceneLighting-CdUVoPSk-DV6PVLf6.js";import{t as M}from"./PiUtils.glsl-E150IKCl-B3zfJNPr.js";import{t as N}from"./BooleanBindUniform-Dh7KRyL2-Dr6FSI4d.js";import{a as P,c as ne,d as F,i as re,o as ie,s as I,t as L,u as R}from"./ReadShadowMap.glsl-B3ui5m-b-BEcyRhYh.js";import{n as z,t as B}from"./SSAO.glsl-CMJXvjDJ-ByoJkoyD.js";import{n as V}from"./SSAOBlur.glsl-_nImQT10-DAzuzHVs.js";function H({normalTexture:e,metallicRoughnessTexture:t,metallicFactor:n,roughnessFactor:r,emissiveTexture:i,emissiveFactor:a,occlusionTexture:o}){return e==null&&t==null&&i==null&&(a==null||d(a,l))&&o==null&&(r==null||r===1)&&(n==null||n===1)}var U=u(1,1,.5),W=u(0,.6,.2),G=u(0,1,.2);function K(e,t){switch(t.output){case 3:case 4:case 5:case 6:e.fragment.code.add(_`float _calculateFragDepth(const in float depth) {
const float SLOPE_SCALE = 2.0;
const float BIAS = 20.0 * .000015259;
float m = max(abs(dFdx(depth)), abs(dFdy(depth)));
return depth + SLOPE_SCALE * m + BIAS;
}
void outputDepth(float _linearDepth){
float fragDepth = _calculateFragDepth(_linearDepth);
gl_FragDepth = fragDepth;
}`);break;case 7:e.fragment.code.add(_`void outputDepth(float _linearDepth){
gl_FragDepth = _linearDepth;
}`)}}var q=class extends A{constructor(){super(...arguments),this.shader=new k(V,()=>e(()=>import(`./SSAOBlur.glsl-DPcUXOwd-CGWXrKYG.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16])))}initializePipeline(){return D({colorWrite:O})}};q=o([n(`esri.views.3d.webgl-engine.effects.ssao.SSAOBlurTechnique`)],q);var J=`eXKEvZaUc66cjIKElE1jlJ6MjJ6Ufkl+jn2fcXp5jBx7c6KEflSGiXuXeW6OWs+tfqZ2Yot2Y7Zzfo2BhniEj3xoiXuXj4eGZpqEaHKDWjSMe7palFlzc3BziYOGlFVzg6Zzg7CUY5JrjFF7eYJ4jIKEcyyEonSXe7qUfqZ7j3xofqZ2c4R5lFZ5Y0WUbppoe1l2cIh2ezyUho+BcHN2cG6DbpqJhqp2e1GcezhrdldzjFGUcyxjc3aRjDyEc1h7Sl17c6aMjH92pb6Mjpd4dnqBjMOEhqZleIOBYzB7gYx+fnqGjJuEkWlwnCx7fGl+c4hjfGyRe5qMlNOMfnqGhIWHc6OMi4GDc6aMfqZuc6aMzqJzlKZ+lJ6Me3qRfoFue0WUhoR5UraEa6qMkXiPjMOMlJOGe7JrUqKMjK6MeYRzdod+Sl17boiPc6qEeYBlcIh2c1WEe7GDiWCDa0WMjEmMdod+Y0WcdntzhmN8WjyMjKJjiXtzgYxYaGd+a89zlEV7e2GJfnd+lF1rcK5zc4p5cHuBhL6EcXp5eYB7fnh8iX6HjIKEeaxuiYOGc66RfG2Ja5hzjlGMjEmMe9OEgXuPfHyGhPeEdl6JY02McGuMfnqGhFiMa3WJfnx2l4hwcG1uhmN8c0WMc39og1GBbrCEjE2EZY+JcIh2cIuGhIWHe0mEhIVrc09+gY5+eYBlnCyMhGCDl3drfmmMgX15aGd+gYx+fnuRfnhzY1SMsluJfnd+hm98WtNrcIuGh4SEj0qPdkqOjFF7jNNjdnqBgaqUjMt7boeBhnZ4jDR7c5pze4GGjEFrhLqMjHyMc0mUhKZze4WEa117kWlwbpqJjHZ2eX2Bc09zeId+e0V7WlF7jHJ2l72BfId8l3eBgXyBe897jGl7c66cgW+Xc76EjKNbgaSEjGx4fId8jFFjgZB8cG6DhlFziZhrcIh2fH6HgUqBgXiPY8dahGFzjEmMhEFre2dxhoBzc5SGfleGe6alc7aUeYBlhKqUdlp+cH5za4OEczxza0Gcc4J2jHZ5iXuXjH2Jh5yRjH2JcFx+hImBjH+MpddCl3dreZeJjIt8ZW18bm1zjoSEeIOBlF9oh3N7hlqBY4+UeYFwhLJjeYFwaGd+gUqBYxiEYot2fqZ2ondzhL6EYyiEY02Ea0VjgZB8doaGjHxoc66cjEGEiXuXiXWMiZhreHx8frGMe75rY02Ec5pzfnhzlEp4a3VzjM+EhFFza3mUY7Zza1V5e2iMfGyRcziEhDyEkXZ2Y4OBnCx7g5t2eyBjgV6EhEFrcIh2dod+c4Z+nJ5zjm15jEmUeYxijJp7nL6clIpjhoR5WrZraGd+fnuRa6pzlIiMg6ZzfHx5foh+eX1ufnB5eX1ufnB5aJt7UqKMjIh+e3aBfm5lbYSBhGFze6J4c39oc0mUc4Z+e0V7fKFVe0WEdoaGY02Ec4Z+Y02EZYWBfH6HgU1+gY5+hIWUgW+XjJ57ebWRhFVScHuBfJ6PhBx7WqJzlM+Ujpd4gHZziX6HjHmEgZN+lJt5boiPe2GJgX+GjIGJgHZzeaxufnB5hF2JtdN7jJ57hp57hK6ElFVzg6ZzbmiEbndzhIWHe3uJfoFue3qRhJd2j3xoc65zlE1jc3p8lE1jhniEgXJ7e657vZaUc3qBh52BhIF4aHKDa9drgY5+c52GWqZzbpqJe8tjnM+UhIeMfo2BfGl+hG1zSmmMjKJjZVaGgX15c1lze0mEp4OHa3mUhIWHhDyclJ6MeYOJkXiPc0VzhFiMlKaEboSJa5Jze41re3qRhn+HZYWBe0mEc4p5fnORbox5lEp4hGFjhGGEjJuEc1WEhLZjeHeGa7KlfHx2hLaMeX1ugY5+hIWHhKGPjMN7c1WEho1zhoBzZYx7fnhzlJt5exyUhFFziXtzfmmMa6qMYyiEiXxweV12kZSMeWqXSl17fnhzxmmMrVGEe1mcc4p5eHeGjK6MgY5+doaGa6pzlGV7g1qBh4KHkXiPeW6OaKqafqZ2eXZ5e1V7jGd7boSJc3BzhJd2e0mcYot2h1RoY8dahK6EQmWEWjx7e1l2lL6UgXyBdnR4eU9zc0VreX1umqaBhld7fo2Bc6KEc5Z+hDyEcIeBWtNrfHyGe5qMhMuMe5qMhEGEbVVupcNzg3aHhIF4boeBe0mEdlptc39ofFl5Y8uUlJOGiYt2UmGEcyxjjGx4jFF7a657ZYWBnElzhp57iXtrgZN+tfOEhIOBjE2HgU1+e8tjjKNbiWCDhE15gUqBgYN7fnqGc66ce9d7iYSBj0qPcG6DnGGcT3eGa6qMZY+JlIiMl4hwc3aRdnqBlGV7eHJ2hLZjfnuRhDyEeX6MSk17g6Z+c6aUjHmEhIF4gXyBc76EZW18fGl+fkl+jCxrhoVwhDyUhIqGlL2DlI6EhJd2tdN7eYORhEGMa2Faa6pzc3Bzc4R5lIRznM+UY9eMhDycc5Z+c4p5c4iGY117pb6MgXuPrbJafnx2eYOJeXZ5e657hDyEcziElKZjfoB5eHeGj4WRhGGEe6KGeX1utTStc76EhFGJnCyMa5hzfH6HnNeceYB7hmN8gYuMhIVrczSMgYF8h3N7c5pza5hzjJqEYIRdgYuMlL2DeYRzhGGEeX1uhLaEc4iGeZ1zdl6JhrVteX6Me2iMfm5lWqJzSpqEa6pzdnmchHx2c6OMhNdrhoR5g3aHczxzeW52gV6Ejm15frGMc0Vzc4Z+l3drfniJe+9rWq5rlF1rhGGEhoVwe9OEfoh+e7pac09+c3qBY0lrhDycdnp2lJ6MiYOGhGCDc3aRlL2DlJt5doaGdnp2gYF8gWeOjF2Uc4R5c5Z+jEmMe7KEc4mEeYJ4dmyBe0mcgXiPbqJ7eYB7fmGGiYSJjICGlF1reZ2PnElzbpqJfH6Hc39oe4WEc5eJhK6EhqyJc3qBgZB8c09+hEmEaHKDhFGJc5SGiXWMUpaEa89zc6OMnCyMiXtrho+Be5qMc7KEjJ57dmN+hKGPjICGbmiEe7prdod+hGCDdnmchBx7eX6MkXZ2hGGEa657hm98jFFjY5JreYOJgY2EjHZ2a295Y3FajJ6Mc1J+YzB7e4WBjF2Uc4R5eV12gYxzg1qBeId+c9OUc5pzjFFjgY5+hFiMlIaPhoR5lIpjjIKBlNdSe7KEeX2BfrGMhIqGc65zjE2UhK6EklZ+QmWEeziMWqZza3VzdnR4foh+gYF8n3iJiZhrnKp7gYF8eId+lJ6Me1lrcIuGjKJjhmN8c66MjFF7a6prjJ6UnJ5zezyUfruRWlF7nI5zfHyGe657h4SEe8tjhBx7jFFjc09+c39ojICMeZeJeXt+YzRzjHZ2c0WEcIeBeXZ5onSXkVR+gYJ+eYFwdldzgYF7eX2BjJ6UiXuXlE1jh4SEe1mchLJjc4Z+hqZ7eXZ5bm1zlL6Ue5p7iWeGhKqUY5pzjKJjcIeBe8t7gXyBYIRdlEp4a3mGnK6EfmmMZpqEfFl5gYxzjKZuhGFjhoKGhHx2fnx2eXuMe3aBiWeGvbKMe6KGa5hzYzB7gZOBlGV7hmN8hqZlYot2Y117a6pzc6KEfId8foB5rctrfneJfJ6PcHN2hFiMc5pzjH92c0VzgY2EcElzdmCBlFVzg1GBc65zY4OBboeBcHiBeYJ4ewxzfHx5lIRzlEmEnLKEbk1zfJ6PhmN8eYBljBiEnMOEiXxwezyUcIeBe76EdsKEeX2BdnR4jGWUrXWMjGd7fkl+j4WRlEGMa5Jzho+BhDyEfnqMeXt+g3aHlE1jczClhNN7ZW18eHx8hGFjZW18iXWMjKJjhH57gYuMcIuGWjyMe4ZtjJuExmmMj4WRdntzi4GDhFFzYIRdnGGcjJp7Y0F7e4WEkbCGiX57fnSHa657a6prhBCMe3Z+SmmMjH92eHJ2hK6EY1FzexhrvbKMnI5za4OEfnd+eXuMhImBe897hLaMjN+EfG+BeIOBhF1+eZeJi4GDkXZ2eXKEgZ6Ejpd4c2GHa1V5e5KUfqZuhCx7jKp7lLZrg11+hHx2hFWUoot2nI5zgbh5mo9zvZaUe3qRbqKMfqZ2kbCGhFiM`,ae=class extends T{constructor(){super(...arguments),this.projScale=1}},oe=class extends ae{constructor(){super(...arguments),this.intensity=1}},se=class extends T{},ce=class extends se{constructor(){super(...arguments),this.blurSize=f()}},Y=class extends A{constructor(){super(...arguments),this.shader=new k(B,()=>e(()=>import(`./SSAO.glsl-HmHOFiae-CMTIOOdX.js`),__vite__mapDeps([17,18,2,3,19,4,5,6,7,20,21,22,23,1,24,25,26,10,11,12,13,14,16])))}initializePipeline(){return D({colorWrite:O})}};Y=o([n(`esri.views.3d.webgl-engine.effects.ssao.SSAOTechnique`)],Y);var X=class extends ee{constructor(e){super(e),this.consumes={required:[`normals`]},this.produces=j.SSAO,this.isEnabled=()=>!1,this._enableTime=i(0),this._passParameters=new oe,this._drawParameters=new ce}initialize(){let e=Uint8Array.from(atob(J),e=>e.charCodeAt(0)),t=new h(32);t.wrapMode=33071,t.pixelFormat=6407,t.wrapMode=10497,t.hasMipmap=!0,this._passParameters.noiseTexture=new m(this.renderingContext,t,e),this.techniques.precompile(Y),this.techniques.precompile(q),this.addHandles(a(()=>this.isEnabled(),()=>this._enableTime=i(0)))}destroy(){this._passParameters.noiseTexture=t(this._passParameters.noiseTexture)}render(e){let t=e.find(({name:e})=>e===`normals`),n=t?.getTexture(),r=t?.getTexture(p);if(!n||!r)return;let a=this.techniques.get(Y),o=this.techniques.get(q);if(!a.compiled||!o.compiled)return this._enableTime=i(performance.now()),void this.requestRender(1);this._enableTime===0&&(this._enableTime=i(performance.now()));let l=this.renderingContext,u=this.view.qualitySettings.fadeDuration,d=this.bindParameters,f=d.camera,m=f.relativeElevation,h=s((I-m)/(I-ne),0,1),g=u>0?Math.min(u,performance.now()-this._enableTime)/u:1,_=g*h;this._passParameters.normalTexture=n,this._passParameters.depthTexture=r,this._passParameters.projScale=1/f.computeScreenPixelSizeAtDist(1),this._passParameters.intensity=4*le/z(f)**6*_;let v=f.fullViewport[2],y=f.fullViewport[3],b=this.fboCache.acquire(v,y,`ssao input`,2);l.bindFramebuffer(b.fbo),l.setViewport(0,0,v,y),l.bindTechnique(a,d,this._passParameters,this._drawParameters),l.screen.draw();let x=Math.round(v/2),S=Math.round(y/2),C=this.fboCache.acquire(x,S,`ssao blur`,0);l.bindFramebuffer(C.fbo),this._drawParameters.colorTexture=b.getTexture(),c(this._drawParameters.blurSize,0,2/y),l.bindTechnique(o,d,this._passParameters,this._drawParameters),l.setViewport(0,0,x,S),l.screen.draw(),b.release();let w=this.fboCache.acquire(x,S,j.SSAO,0);return l.bindFramebuffer(w.fbo),l.setViewport(0,0,v,y),l.setClearColor(1,1,1,0),l.clear(16384),this._drawParameters.colorTexture=C.getTexture(),c(this._drawParameters.blurSize,2/v,0),l.bindTechnique(o,d,this._passParameters,this._drawParameters),l.setViewport(0,0,x,S),l.screen.draw(),l.setViewport4fv(f.fullViewport),C.release(),g<1&&this.requestRender(2),w}};o([r()],X.prototype,`consumes`,void 0),o([r()],X.prototype,`produces`,void 0),o([r({constructOnly:!0})],X.prototype,`isEnabled`,void 0),X=o([n(`esri.views.3d.webgl-engine.effects.ssao.SSAO`)],X);var le=.5;function Z(e,t){t.receiveAmbientOcclusion?(e.uniforms.add(new w(`ssaoTex`,e=>e.ssao?.getTexture())),e.constants.add(`blurSizePixelsInverse`,`float`,1/2),e.code.add(_`float evaluateAmbientOcclusionInverse() {
vec2 ssaoTextureSizeInverse = 1.0 / vec2(textureSize(ssaoTex, 0));
return texture(ssaoTex, gl_FragCoord.xy * blurSizePixelsInverse * ssaoTextureSizeInverse).r;
}
float evaluateAmbientOcclusion() {
return 1.0 - evaluateAmbientOcclusionInverse();
}`)):e.code.add(_`float evaluateAmbientOcclusionInverse() { return 1.0; }
float evaluateAmbientOcclusion() { return 0.0; }`)}function ue(e){e.code.add(_`float mapChannel(float x, vec2 p) {
return (x < p.x) ? mix(0.0, p.y, x/p.x) : mix(p.y, 1.0, (x - p.x) / (1.0 - p.x) );
}`),e.code.add(_`vec3 blackLevelSoftCompression(vec3 color, float averageAmbientRadiance) {
vec2 p = vec2(0.02, 0.0075) * averageAmbientRadiance;
return vec3(mapChannel(color.x, p), mapChannel(color.y, p), mapChannel(color.z, p));
}`)}function Q(e){e.constants.add(`ambientBoostFactor`,`float`,te)}function $(e){e.uniforms.add(new E(`lightingGlobalFactor`,e=>e.lighting.globalFactor))}function de(e,t){let{pbrMode:n,spherical:r,hasColorTexture:i}=t;e.include(Z,t),n!==0&&e.include(L,t),e.include(ie,t),e.include(M),e.include(re,t),e.include(v);let a=!(n===2&&!i);switch(a&&e.include(ue),e.code.add(_`
    ${g(n!==0,`const float GROUND_REFLECTANCE = 0.2;`)}
  `),Q(e),$(e),F(e),e.code.add(_`
    float additionalDirectedAmbientLight(float lightAlignment) {
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }

    float additionalDirectedAmbientLight(vec3 vPosWorld) {
      float lightAlignment = dot(${r?_`normalize(vPosWorld)`:_`vec3(0.0, 0.0, 1.0)`}, mainLightDirection);
      return smoothstep(0.0, 1.0, clamp(lightAlignment * 2.5, 0.0, 1.0));
    }
  `),P(e),e.code.add(_`vec3 evaluateAdditionalLighting(float ambientOcclusion, vec3 vPosWorld) {
float additionalAmbientScale = additionalDirectedAmbientLight(vPosWorld);
return (1.0 - ambientOcclusion) * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor * mainLightIntensity;
}`),n){case 0:case 4:case 3:e.include(R),e.code.add(_`vec3 evaluateSceneLighting(vec3 normalWorld, vec3 albedo, float shadow, float ssao, vec3 additionalLight) {
vec3 mainLighting = applyShading(normalWorld, shadow);
vec3 ambientLighting = calculateAmbientIrradiance(normalWorld, ssao);
vec3 albedoLinear = linearizeGamma(albedo);
vec3 totalLight = mainLighting + ambientLighting + additionalLight;
totalLight = min(totalLight, vec3(PI));
vec3 outColor = vec3((albedoLinear / PI) * totalLight);
return delinearizeGamma(outColor);
}`);break;case 1:case 2:e.code.add(_`const float fillLightIntensity = 0.25;
const float horizonLightDiffusion = 0.4;
const float additionalAmbientIrradianceFactor = 0.02;
vec3 evaluateSceneLightingPBR(vec3 normal, vec3 albedo, float shadow, float ssao, vec3 additionalLight,
vec3 viewDir, vec3 groundNormal, vec3 mrr, float additionalAmbientIrradiance) {
vec3 viewDirection = -viewDir;
vec3 h = normalize(viewDirection + mainLightDirection);
PBRShadingInfo inputs;
inputs.NdotV = clamp(abs(dot(normal, viewDirection)), 0.001, 1.0);
inputs.NdotNG = clamp(dot(normal, groundNormal), -1.0, 1.0);
vec3 reflectedView = normalize(reflect(viewDirection, normal));
inputs.RdotNG = clamp(dot(reflectedView, groundNormal), -1.0, 1.0);
inputs.albedoLinear = linearizeGamma(albedo);
inputs.ssao = ssao;
inputs.metalness = mrr[0];
inputs.roughness = clamp(mrr[1] * mrr[1], 0.001, 0.99);`),e.code.add(_`inputs.f0 = (0.16 * mrr[2] * mrr[2]) * (1.0 - inputs.metalness) + inputs.albedoLinear * inputs.metalness;
inputs.f90 = vec3(clamp(dot(inputs.f0, vec3(50.0 * 0.33)), 0.0, 1.0));
inputs.diffuseColor = inputs.albedoLinear * (vec3(1.0) - inputs.f0) * (1.0 - inputs.metalness);`),t.useFillLights?e.uniforms.add(new N(`hasFillLights`,e=>e.enableFillLights)):e.constants.add(`hasFillLights`,`bool`,!1),e.code.add(_`vec3 ambientDir = vec3(5.0 * groundNormal[1] - groundNormal[0] * groundNormal[2], - 5.0 * groundNormal[0] - groundNormal[2] * groundNormal[1], groundNormal[1] * groundNormal[1] + groundNormal[0] * groundNormal[0]);
ambientDir = ambientDir != vec3(0.0) ? normalize(ambientDir) : normalize(vec3(5.0, -1.0, 0.0));
inputs.NdotAmbDir = hasFillLights ? abs(dot(normal, ambientDir)) : 1.0;
float NdotL = clamp(dot(normal, mainLightDirection), 0.001, 1.0);
vec3 mainLightIrradianceComponent = NdotL * (1.0 - shadow) * mainLightIntensity;
vec3 fillLightsIrradianceComponent = inputs.NdotAmbDir * mainLightIntensity * fillLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(normal, ssao) + additionalLight;
inputs.skyIrradianceToSurface = ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;
inputs.groundIrradianceToSurface = GROUND_REFLECTANCE * ambientLightIrradianceComponent + mainLightIrradianceComponent + fillLightsIrradianceComponent ;`),e.uniforms.add(new E(`lightingSpecularStrength`,e=>e.lighting.mainLight.specularStrength),new E(`lightingEnvironmentStrength`,e=>e.lighting.mainLight.environmentStrength)).code.add(_`vec3 horizonRingDir = inputs.RdotNG * groundNormal - reflectedView;
vec3 horizonRingH = normalize(viewDirection + horizonRingDir);
inputs.NdotH_Horizon = dot(normal, horizonRingH);
float NdotH = clamp(dot(normal, h), 0.0, 1.0);
vec3 mainLightRadianceComponent = lightingSpecularStrength * normalDistribution(NdotH, inputs.roughness) * mainLightIntensity * (1.0 - shadow);
vec3 horizonLightRadianceComponent = lightingEnvironmentStrength * normalDistribution(inputs.NdotH_Horizon, min(inputs.roughness + horizonLightDiffusion, 1.0)) * mainLightIntensity * fillLightIntensity;
vec3 ambientLightRadianceComponent = lightingEnvironmentStrength * calculateAmbientRadiance(ssao) + additionalLight;
float normalDirectionModifier = mix(1., min(mix(0.1, 2.0, (inputs.NdotNG + 1.) * 0.5), 1.0), clamp(inputs.roughness * 5.0, 0.0 , 1.0));
inputs.skyRadianceToSurface = (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.groundRadianceToSurface = 0.5 * GROUND_REFLECTANCE * (ambientLightRadianceComponent + horizonLightRadianceComponent) * normalDirectionModifier + mainLightRadianceComponent;
inputs.averageAmbientRadiance = ambientLightIrradianceComponent[1] * (1.0 + GROUND_REFLECTANCE);`),e.code.add(_`
        vec3 reflectedColorComponent = evaluateEnvironmentIllumination(inputs);
        vec3 additionalMaterialReflectanceComponent = inputs.albedoLinear * additionalAmbientIrradiance;
        vec3 outColorLinear = reflectedColorComponent + additionalMaterialReflectanceComponent;
        ${a?_`vec3 outColor = blackLevelSoftCompression(outColorLinear, inputs.averageAmbientRadiance);`:_`vec3 outColor = max(vec3(0.0), outColorLinear - 0.005 * inputs.averageAmbientRadiance);`}
        return delinearizeGamma(outColor);
      }
    `);break;case 5:case 6:F(e),P(e),e.code.add(_`const float roughnessTerrain = 0.5;
const float specularityTerrain = 0.5;
const vec3 fresnelReflectionTerrain = vec3(0.04);
vec3 evaluatePBRSimplifiedLighting(vec3 n, vec3 c, float shadow, float ssao, vec3 al, vec3 vd, vec3 nup) {
vec3 viewDirection = -vd;
vec3 h = normalize(viewDirection + mainLightDirection);
float NdotL = clamp(dot(n, mainLightDirection), 0.001, 1.0);
float NdotV = clamp(abs(dot(n, viewDirection)), 0.001, 1.0);
float NdotH = clamp(dot(n, h), 0.0, 1.0);
float NdotNG = clamp(dot(n, nup), -1.0, 1.0);
vec3 albedoLinear = linearizeGamma(c);
float lightness = 0.3 * albedoLinear[0] + 0.5 * albedoLinear[1] + 0.2 * albedoLinear[2];
vec3 f0 = (0.85 * lightness + 0.15) * fresnelReflectionTerrain;
vec3 f90 =  vec3(clamp(dot(f0, vec3(50.0 * 0.33)), 0.0, 1.0));
vec3 mainLightIrradianceComponent = (1. - shadow) * NdotL * mainLightIntensity;
vec3 ambientLightIrradianceComponent = calculateAmbientIrradiance(n, ssao) + al;
vec3 ambientSky = ambientLightIrradianceComponent + mainLightIrradianceComponent;
vec3 indirectDiffuse = ((1.0 - NdotNG) * mainLightIrradianceComponent + (1.0 + NdotNG ) * ambientSky) * 0.5;
vec3 outDiffColor = albedoLinear * (1.0 - f0) * indirectDiffuse / PI;
vec3 mainLightRadianceComponent = normalDistribution(NdotH, roughnessTerrain) * mainLightIntensity;
vec2 dfg = prefilteredDFGAnalytical(roughnessTerrain, NdotV);
vec3 specularColor = f0 * dfg.x + f90 * dfg.y;
vec3 specularComponent = specularityTerrain * specularColor * mainLightRadianceComponent;
vec3 outColorLinear = outDiffColor + specularComponent;
vec3 outColor = delinearizeGamma(outColorLinear);
return outColor;
}`)}}function fe(e,t){let n=t.pbrMode,r=e.fragment;if(n!==2&&n!==0&&n!==1)return void r.code.add(_`void applyPBRFactors() {}`);if(n===0)return void r.code.add(_`void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);if(n===2)return void r.code.add(_`vec3 mrr = vec3(0.0, 0.6, 0.2);
float occlusion = 1.0;
void applyPBRFactors() {}
float getBakedOcclusion() { return 1.0; }`);let{hasMetallicRoughnessTexture:i,hasMetallicRoughnessTextureTransform:a,hasOcclusionTexture:o,hasOcclusionTextureTransform:s,bindType:c}=t;(i||o)&&e.include(C,t),r.code.add(_`vec3 mrr;
float occlusion;`),i&&r.uniforms.add(c===1?new S(`texMetallicRoughness`,e=>e.textureMetallicRoughness):new x(`texMetallicRoughness`,e=>e.textureMetallicRoughness)),o&&r.uniforms.add(c===1?new S(`texOcclusion`,e=>e.textureOcclusion):new x(`texOcclusion`,e=>e.textureOcclusion)),r.uniforms.add(c===1?new b(`mrrFactors`,e=>e.mrrFactors):new y(`mrrFactors`,e=>e.mrrFactors)),r.code.add(_`
    ${g(i,_`void applyMetallicRoughness(vec2 uv) {
            vec3 metallicRoughness = textureLookup(texMetallicRoughness, uv).rgb;
            mrr[0] *= metallicRoughness.b;
            mrr[1] *= metallicRoughness.g;
          }`)}

    ${g(o,`void applyOcclusion(vec2 uv) { occlusion *= textureLookup(texOcclusion, uv).r; }`)}

    float getBakedOcclusion() {
      return ${o?`occlusion`:`1.0`};
    }

    void applyPBRFactors() {
      mrr = mrrFactors;
      occlusion = 1.0;

      ${g(i,`applyMetallicRoughness(${a?`metallicRoughnessUV`:`vuv0`});`)}
      ${g(o,`applyOcclusion(${s?`occlusionUV`:`vuv0`});`)}
    }
  `)}function pe(e,t){t.snowCover&&(e.uniforms.add(new E(`snowCover`,e=>e.snowCover)).code.add(_`float getSnow(vec3 normal, vec3 groundNormal) {
return smoothstep(0.5, 0.55, dot(normal, groundNormal)) * snowCover;
}
float getRealisticTreeSnow(vec3 faceNormal, vec3 shadingNormal, vec3 groundNormal) {
float snow = min(1.0, smoothstep(0.5, 0.55, dot(faceNormal, groundNormal)) +
smoothstep(0.5, 0.55, dot(-faceNormal, groundNormal)) +
smoothstep(0.0, 0.1, dot(shadingNormal, groundNormal)));
return snow * snowCover;
}`),e.code.add(_`vec3 applySnowToMRR(vec3 mrr, float snow) {
return mix(mrr, vec3(0.0, 1.0, 0.04), snow);
}`))}export{W as a,Z as c,de as d,Q as i,fe as l,K as n,H as o,U as r,G as s,$ as t,pe as u};