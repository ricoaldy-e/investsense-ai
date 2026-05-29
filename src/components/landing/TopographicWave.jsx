import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveMesh = () => {
  const geometryRef = useRef();

  const { positions, count } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 20, 80, 40);
    const pos = geo.attributes.position.array.slice();
    return { positions: pos, count: geo.attributes.position.count };
  }, []);

  useFrame(({ clock }) => {
    if (!geometryRef.current) return;

    const time = clock.getElapsedTime() * 0.3;
    const posArray = geometryRef.current.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const ox = positions[ix];
      const oy = positions[iy];

      const w1 = Math.sin(ox * 0.45 + time) * 0.3;
      const w2 = Math.sin(oy * 0.6 + time * 0.55) * 0.2;
      const w3 = Math.cos(ox * 0.3 + oy * 0.4 + time * 0.35) * 0.15;

      posArray[iz] = w1 + w2 + w3;
    }

    geometryRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <mesh
      rotation={[-Math.PI * 0.55, 0, 0]}
      position={[0, -3.5, 0]}
    >
      <planeGeometry ref={geometryRef} args={[40, 20, 80, 40]} />
      <meshBasicMaterial
        color="#a8b5c8"
        wireframe
        transparent
        opacity={0.085}
      />
    </mesh>
  );
};

const TopographicWave = () => {
  const handleCreated = useCallback(({ gl }) => {
    gl.domElement.style.pointerEvents = 'none';
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 5%, black 35%, black 55%, transparent 90%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, black 35%, black 55%, transparent 90%)',
      }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 5, 5], zoom: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        onCreated={handleCreated}
        style={{ background: 'transparent' }}
      >
        <WaveMesh />
      </Canvas>
    </div>
  );
};

export default TopographicWave;
