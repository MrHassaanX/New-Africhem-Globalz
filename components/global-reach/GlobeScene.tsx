"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { networkArcs, networkLocations, type Coordinate } from "@/lib/globe/locations";

type Props = { active: boolean; reducedMotion: boolean; onSelectionChange: (index: number | null) => void };
type RotationControl = { yaw: number; velocity: number; dragging: boolean; resumeAt: number; autoBlend: number };
const revolutionSeconds = 42;

function onSphere([longitude, latitude]: Coordinate, radius: number) {
  const lat = latitude * Math.PI / 180;
  const lon = longitude * Math.PI / 180;
  return new THREE.Vector3(radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.cos(lon));
}

function createRoutes() {
  return networkArcs.map(([from, to]) => {
    const start = onSphere(networkLocations[from].coordinate, 1);
    const end = onSphere(networkLocations[to].coordinate, 1);
    const path = Array.from({ length: 49 }, (_, index) => {
      const t = index / 48;
      return start.clone().lerp(end, t).normalize().multiplyScalar(1.54 + .12 * Math.sin(Math.PI * t));
    });
    const curve = new THREE.CatmullRomCurve3(path);
    return { curve, geometry: new THREE.TubeGeometry(curve, 48, .0035, 3, false) };
  });
}

function GlobeObject({ active, reducedMotion, mobile, dark, getControl, select }: Props & { mobile: boolean; dark: boolean; getControl: () => RotationControl; select: (index: number) => void }) {
  const globe = useRef<THREE.Group>(null);
  const firstFrame = useRef(false);
  const elapsed = useRef(0);
  const routeMaterials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const halos = useRef<Array<THREE.Mesh | null>>([]);
  const loadedTexture = useLoader(THREE.TextureLoader, `/globe/earth-${dark ? "dark" : "light"}-${mobile ? "mobile" : "desktop"}.webp`);
  const earthTexture = useMemo(() => {
    const texture = loadedTexture.clone();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.offset.x = .25; // SphereGeometry faces longitude zero at U=.25.
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  }, [loadedTexture]);
  const routes = useMemo(() => createRoutes(), []);
  const points = useMemo(() => networkLocations.map(({ coordinate }) => onSphere(coordinate, 1.565)), []);

  useEffect(() => () => {
    earthTexture.dispose();
    routes.forEach(({ geometry }) => geometry.dispose());
  }, [earthTexture, routes]);

  useFrame((_, delta) => {
    if (!globe.current) return;
    const step = Math.min(delta, .08);
    const rotation = getControl();
    if (active && !reducedMotion) {
      elapsed.current += step;
      if (!rotation.dragging) {
        rotation.yaw += rotation.velocity * step;
        rotation.velocity *= Math.exp(-step * 4.5);
        if (Math.abs(rotation.velocity) < .001) rotation.velocity = 0;
        if (performance.now() >= rotation.resumeAt) {
          rotation.autoBlend = Math.min(1, rotation.autoBlend + step / .8);
          rotation.yaw += step * 2 * Math.PI / revolutionSeconds * rotation.autoBlend;
        }
      }
    }
    const time = elapsed.current;
    globe.current.rotation.y = rotation.yaw;
    globe.current.rotation.x = -.07;
    const reveal = reducedMotion ? 1 : Math.min(1, time / 1.5);
    routes.forEach((_, index) => {
      const material = routeMaterials.current[index];
      if (material) material.opacity = reveal * (dark ? .57 : .5);
    });
    halos.current.forEach((halo, index) => {
      if (halo) halo.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 1.7 + index * 1.6) * .14);
    });
  });

  return <group ref={globe} rotation={[-.07, -1, 0]}>
    <mesh onAfterRender={() => {
      if (firstFrame.current) return;
      firstFrame.current = true;
      requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event("africhem-globe-ready"))));
    }}>
      <sphereGeometry args={[1.5, mobile ? 48 : 80, mobile ? 32 : 56]} />
      <meshPhysicalMaterial map={earthTexture} roughness={.68} metalness={.12} clearcoat={.24} clearcoatRoughness={.52} />
    </mesh>
    {routes.map(({ geometry }, index) => <group key={index}>
      <mesh geometry={geometry}>
        <meshBasicMaterial ref={(material) => { routeMaterials.current[index] = material; }} color={dark ? "#E55852" : "#B83D39"} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>)}
    {networkLocations.map(({ name, primary }, index) => <group key={name} position={points[index]} onClick={(event) => { event.stopPropagation(); select(index); }} onPointerOver={(event) => { event.stopPropagation(); select(index); }}>
      <mesh ref={(node) => { halos.current[index] = node; }}>
        <sphereGeometry args={[primary ? .105 : mobile ? .065 : .07, 12, 12]} />
        <meshBasicMaterial color={primary ? "#e7b999" : dark ? "#5cbdd5" : "#3d90a9"} transparent opacity={primary ? .4 : .26} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[primary ? .035 : mobile ? .023 : .026, 12, 12]} />
        <meshBasicMaterial color={primary ? "#f2d7c1" : dark ? "#d6f5fa" : "#e8faf9"} />
      </mesh>
    </group>)}
    <mesh scale={1.045} renderOrder={2}>
      <sphereGeometry args={[1.5, mobile ? 32 : 48, mobile ? 24 : 36]} />
      <shaderMaterial transparent depthWrite={false} side={THREE.FrontSide} blending={THREE.AdditiveBlending}
        uniforms={{ color: { value: new THREE.Color(dark ? "#53b9dc" : "#4b91ac") }, strength: { value: dark ? .22 : .12 } }}
        vertexShader={`varying vec3 vNormal; varying vec3 vView; void main() { vec4 viewPosition = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = normalize(-viewPosition.xyz); gl_Position = projectionMatrix * viewPosition; }`}
        fragmentShader={`uniform vec3 color; uniform float strength; varying vec3 vNormal; varying vec3 vView; void main() { float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 3.2); gl_FragColor = vec4(color, rim * strength); }`}
      />
    </mesh>
  </group>;
}

function InvalidateBridge({ register }: { register: (invalidate: () => void) => void }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    register(invalidate);
    window.dispatchEvent(new Event("africhem-canvas-ready"));
  }, [invalidate, register]);
  return null;
}

export default function GlobeScene(props: Props) {
  const control = useRef<RotationControl>({ yaw: -1, velocity: 0, dragging: false, resumeAt: 0, autoBlend: 1 });
  const pointer = useRef<{ id: number; x: number; y: number; time: number; horizontal: boolean } | null>(null);
  const invalidate = useRef<() => void>(() => {});
  const [dragging, setDragging] = useState(false);
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [tablet, setTablet] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1100);
  const [dark, setDark] = useState(() => typeof document === "undefined" || document.documentElement.dataset.theme !== "light");
  useEffect(() => {
    const update = () => {
      setMobile(window.innerWidth < 768);
      setTablet(window.innerWidth >= 768 && window.innerWidth < 1100);
      setDark(document.documentElement.dataset.theme !== "light");
    };
    window.addEventListener("resize", update, { passive: true });
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { window.removeEventListener("resize", update); observer.disconnect(); };
  }, []);
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: event.timeStamp, horizontal: false };
    control.current.resumeAt = performance.now() + 1500;
    control.current.autoBlend = 0;
    control.current.velocity = 0;
    invalidate.current();
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = pointer.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      gesture.horizontal = true;
      props.onSelectionChange(null);
      control.current.dragging = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const elapsedMs = Math.max(8, event.timeStamp - gesture.time);
    const change = dx * .005;
    control.current.yaw += change;
    control.current.velocity = Math.max(-1.4, Math.min(1.4, change / elapsedMs * 1000));
    invalidate.current();
    gesture.x = event.clientX;
    gesture.y = event.clientY;
    gesture.time = event.timeStamp;
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pointer.current = null;
    control.current.dragging = false;
    control.current.resumeAt = performance.now() + 1500;
    if (props.reducedMotion) control.current.velocity = 0;
    invalidate.current();
    setDragging(false);
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    control.current.yaw += event.key === "ArrowRight" ? .18 : -.18;
    control.current.velocity = 0;
    control.current.autoBlend = 0;
    control.current.resumeAt = performance.now() + 1500;
    props.onSelectionChange(null);
    invalidate.current();
  }
  return <div className="globe-input" data-dragging={dragging} role="group" tabIndex={0}
    aria-label="Interactive globe. Drag left or right, or use arrow keys to rotate."
    onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onKeyDown={onKeyDown}>
  <Canvas className="globe-canvas" dpr={mobile ? [1, 1.2] : [1, 1.5]}
    frameloop={!props.active || props.reducedMotion ? "demand" : "always"}
    camera={{ position: [0, .05, mobile ? 6.25 : tablet ? 6.8 : 5.15], fov: 39, near: .1, far: 20 }}
    gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance" }}>
    <InvalidateBridge register={(fn) => { invalidate.current = fn; }} />
    <ambientLight intensity={dark ? 1.25 : 1.4} color={dark ? "#b7dce7" : "#e6eef0"} />
    <directionalLight position={[-3, 3, 5]} intensity={dark ? 1.55 : 1.4} color={dark ? "#9cd5e6" : "#dce9ec"} />
    <directionalLight position={[3, -1, -2]} intensity={.7} color="#2d8fae" />
    <Suspense fallback={null}><GlobeObject {...props} mobile={mobile} dark={dark} getControl={() => control.current} select={props.onSelectionChange} /></Suspense>
  </Canvas>
  </div>;
}
