"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, Group, ShaderMaterial, Vector2 } from "three";
import { sceneMotion } from "./sceneMotion";

const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;
varying vec2 vUv;
varying vec3 vViewPosition;
void main() {
  vUv = uv;
  vec3 p = position;
  float slow = uTime * 0.22;
  float wave = sin(p.y * 1.45 + p.x * 1.12 + slow) * 0.33;
  float fold = sin(p.x * 2.7 - p.y * 0.76 - slow * 0.72) * 0.17;
  float crease = exp(-pow(p.x * 1.2 + sin(p.y * 0.95 + slow) * 0.36, 2.0)) * 0.56;
  p.z += wave + fold + crease;
  p.x += sin(p.y * 1.35 + slow) * 0.15 + uProgress * 0.19;
  p.y += sin(p.x * 0.8 - slow) * 0.06;
  vec4 viewPos = modelViewMatrix * vec4(p, 1.0);
  vViewPosition = viewPos.xyz;
  gl_Position = projectionMatrix * viewPos;
}`;

const fragmentShader = `
uniform float uTime;
uniform float uTheme;
uniform vec2 uPointer;
varying vec2 vUv;
varying vec3 vViewPosition;
void main() {
  vec3 normal = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
  if (!gl_FrontFacing) normal *= -1.0;
  vec3 viewDir = normalize(-vViewPosition);
  float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.1);
  vec2 lightCenter = vec2(0.28 + uPointer.x * 0.12, 0.8 + uPointer.y * 0.07);
  float light = exp(-length(vUv - lightCenter) * 4.0);
  float crease = pow(max(dot(normal, normalize(vec3(0.5 + uPointer.x * 0.25, 0.45, 1.0))), 0.0), 8.0);
  float striation = pow(max(sin(vUv.y * 29.0 + sin(vUv.x * 13.0) * 1.6 + uTime * 0.15), 0.0), 18.0);
  vec3 deep = mix(vec3(0.035, 0.18, 0.26), vec3(0.05, 0.23, 0.33), uTheme);
  vec3 ice = mix(vec3(0.55, 0.83, 0.9), vec3(0.32, 0.73, 0.82), uTheme);
  vec3 color = mix(deep, ice, clamp(0.16 + light * 0.48 + crease * 0.48 + fresnel * 0.45, 0.0, 1.0));
  color += striation * vec3(0.21, 0.39, 0.43);
  float edge = smoothstep(0.0, 0.13, vUv.x) * smoothstep(0.0, 0.13, 1.0 - vUv.x);
  edge *= smoothstep(0.0, 0.11, vUv.y) * smoothstep(0.0, 0.11, 1.0 - vUv.y);
  float alpha = clamp(0.11 + fresnel * 0.17 + light * 0.09 + crease * 0.1, 0.0, 0.42) * edge;
  gl_FragColor = vec4(color, alpha);
}`;

const pointVertex = `
attribute float aSize;
uniform float uTime;
uniform vec2 uPointer;
void main() {
  vec3 p = position;
  p.y += sin(uTime * 0.42 + p.x * 2.3) * 0.06;
  vec2 delta = p.xy - uPointer * 1.3;
  float nearPointer = max(0.0, 1.0 - length(delta) / 1.1);
  p.xy += normalize(delta + vec2(0.0001)) * nearPointer * 0.05;
  vec4 viewPos = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * viewPos;
  gl_PointSize = aSize * (6.0 / max(1.0, -viewPos.z));
}`;
const pointFragment = `
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(0.65, 0.91, 0.95, (1.0 - d * 2.0) * 0.45);
}`;

function Material({ mobile }: { mobile: boolean }) {
  const group = useRef<Group>(null);
  const sheet = useRef<ShaderMaterial>(null);
  const points = useRef<ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const elapsed = useRef(0);
  const { invalidate } = useThree();
  const bubbles = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new Float32Array(36 * 3);
    const sizes = new Float32Array(36);
    for (let i = 0; i < 36; i++) {
      const t = i * 2.399963;
      const radius = Math.sqrt((i + .5) / 36);
      positions[i * 3] = Math.cos(t) * radius * 2.35;
      positions[i * 3 + 1] = Math.sin(t) * radius * 2.7;
      positions[i * 3 + 2] = .12 + (i % 6) * .06;
      sizes[i] = i % 7 === 0 ? 4.2 : 2.3;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    return geometry;
  }, []);
  useEffect(() => () => bubbles.dispose(), [bubbles]);
  useEffect(() => {
    const update = () => {
      if (sheet.current) sheet.current.uniforms.uTheme.value = document.documentElement.dataset.theme === "dark" ? 1 : 0;
      invalidate();
    };
    update();
    window.addEventListener("africhem-theme", update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { window.removeEventListener("africhem-theme", update); observer.disconnect(); };
  }, [invalidate]);
  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, .05);
    const p = sceneMotion.progress;
    const d = Math.min(delta * 3, 1);
    const targetX = mobile ? 0 : sceneMotion.pointer.x;
    const targetY = mobile ? 0 : sceneMotion.pointer.y;
    pointer.current.x += (targetX - pointer.current.x) * d;
    pointer.current.y += (targetY - pointer.current.y) * d;
    if (group.current) {
      group.current.rotation.y += ((mobile ? -.19 : -.22 + pointer.current.x * .07 + p * .22) - group.current.rotation.y) * d;
      group.current.rotation.z += ((-.09 + p * .13) - group.current.rotation.z) * d;
      group.current.position.x += ((p * -.45) - group.current.position.x) * d;
      group.current.scale.setScalar(1 + p * .13);
    }
    for (const material of [sheet.current, points.current]) {
      if (!material) continue;
      material.uniforms.uTime.value = elapsed.current;
      material.uniforms.uPointer.value.set(pointer.current.x, pointer.current.y);
      if (material.uniforms.uProgress) material.uniforms.uProgress.value = p;
    }
  });
  return <group ref={group}>
    <mesh rotation={[0, -.11, .11]} position={[.35, -1.05, .35]}>
      <planeGeometry args={[4.25, 4.5, mobile ? 32 : 64, mobile ? 32 : 64]} />
      <shaderMaterial ref={sheet} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={{ uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: new Vector2() }, uTheme: { value: 0 } }} transparent depthWrite={false} side={DoubleSide} />
    </mesh>
    {!mobile && <points geometry={bubbles}>
      <shaderMaterial ref={points} vertexShader={pointVertex} fragmentShader={pointFragment} uniforms={{ uTime: { value: 0 }, uPointer: { value: new Vector2() } }} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>}
  </group>;
}
function qualitySubscribe(fn: () => void) {
  const media = matchMedia("(max-width: 767px), (pointer: coarse)");
  media.addEventListener("change", fn);
  return () => media.removeEventListener("change", fn);
}
export default function MaterialCanvas({ active }: { active: boolean }) {
  const mobile = useSyncExternalStore(qualitySubscribe, () => matchMedia("(max-width: 767px), (pointer: coarse)").matches, () => true);
  useEffect(() => { window.dispatchEvent(new Event("africhem-canvas-ready")); }, []);
  useEffect(() => {
    if (mobile) return;
    const move = (event: PointerEvent) => {
      sceneMotion.pointer.x = event.clientX / innerWidth * 2 - 1;
      sceneMotion.pointer.y = -(event.clientY / innerHeight * 2 - 1);
    };
    const reset = () => { sceneMotion.pointer.x = 0; sceneMotion.pointer.y = 0; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", reset); reset(); };
  }, [mobile]);
  return <div className="home-webgl" data-render-active={active}>
    <Canvas aria-label="Subtle moving liquid material highlight" dpr={mobile ? 1 : [1, 1.5]} frameloop={active ? "always" : "demand"} camera={{ position: [0, 0, 8.2], fov: 41 }} gl={{ alpha: true, antialias: false, powerPreference: "low-power" }} fallback={null}>
      <Material mobile={mobile} />
    </Canvas>
  </div>;
}

