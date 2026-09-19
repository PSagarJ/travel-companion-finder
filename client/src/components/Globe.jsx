import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { TextureLoader } from "three";
import { useNavigate } from "react-router-dom";

// Approximate coordinates for the three featured destinations
const PINS = [
  { id: "dest-1", label: "Bali", lat: -8.34, lng: 115.09 },
  { id: "dest-2", label: "Kyoto", lat: 35.01, lng: 135.77 },
  { id: "dest-3", label: "Ladakh", lat: 34.15, lng: 77.58 },
];

const RADIUS = 1.5;

// Converts latitude/longitude to a 3D point on the sphere's surface —
// the standard projection used for globe visualizations.
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
};

const EarthSphere = () => {
  const meshRef = useRef();
  const texture = useLoader(
    TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
  );

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

const Pin = ({ id, label, lat, lng, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector3(lat, lng, RADIUS + 0.02);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(id)}
        scale={hovered ? 1.6 : 1}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color="#e67e5a"
          emissive="#e67e5a"
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </mesh>
      <Html distanceFactor={6} occlude>
        <div
          onClick={() => onSelect(id)}
          className={`-translate-x-1/2 cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap shadow-lg transition-all ${
            hovered
              ? "scale-110 bg-white text-slate-900"
              : "bg-black/70 text-white"
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
};

// Slowly auto-rotates the whole globe group; pauses while the user is
// actively dragging (handled by OrbitControls' own autoRotate prop instead
// would fight with manual group rotation, so we spin the group directly and
// disable autoRotate on the controls).
const RotatingGroup = ({ children }) => {
  const groupRef = useRef();
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const GlobeScene = ({ onSelect }) => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 3, 5]} intensity={1.2} />
    <Suspense fallback={null}>
      <RotatingGroup>
        <EarthSphere />
        {PINS.map((pin) => (
          <Pin key={pin.id} {...pin} onSelect={onSelect} />
        ))}
      </RotatingGroup>
    </Suspense>
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={(Math.PI * 2) / 3}
    />
  </>
);

const Globe = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <GlobeScene onSelect={(id) => navigate(`/explore/${id}`)} />
      </Canvas>
    </div>
  );
};

export default Globe;
