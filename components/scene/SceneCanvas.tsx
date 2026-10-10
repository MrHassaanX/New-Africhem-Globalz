"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useSyncExternalStore } from "react";
import type { Group } from "three";

function MaterialSample({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock, pointer }, dt) => {
    if (!group.current || reduced) return;
    const damping = Math.min(dt * 2, 1);
    const target = -.35 + pointer.x * .12 + Math.sin(clock.elapsedTime * .18) * .06;
    group.current.rotation.y += (target - group.current.rotation.y) * damping;
  });
  return <group ref={group} rotation={[.15, -.35, -.25]}>
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[(i - 2) * .56, 0, (i - 2) * -.14]}>
      <boxGeometry args={[.35, 3.1 - Math.abs(i - 2) * .3, .45]} />
      <meshPhysicalMaterial color={i === 2 ? "#58d7e8" : "#2686aa"} roughness={.15} metalness={.55} clearcoat={1} />
    </mesh>)}
  </group>;
}
const subscribeQuality = (fn: () => void) => { const media = matchMedia("(max-width: 767px), (pointer: coarse)"); media.addEventListener("change", fn); return () => media.removeEventListener("change", fn); };
export default function SceneCanvas({ active, reduced }: { active: boolean; reduced: boolean }) {
  const mobile = useSyncExternalStore(subscribeQuality, () => matchMedia("(max-width: 767px), (pointer: coarse)").matches, () => true);
  return <div className="scene-canvas" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={mobile ? 1 : [1, 1.5]} frameloop={active && !reduced ? "always" : "demand"} gl={{ antialias: false, powerPreference: "low-power", alpha: false }} fallback={<span>Static material preview</span>}>
      <color attach="background" args={["#081c29"]} />
      <ambientLight intensity={.7} /><directionalLight position={[2, 4, 5]} intensity={4} color="#b1eaff" /><pointLight position={[-4, -1, 2]} intensity={18} color="#008bb9" />
      <MaterialSample reduced={reduced} />
    </Canvas>
  </div>;
}

