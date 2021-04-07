import React, { useRef, useMemo, Suspense } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  Vector3 as FiberVector3,
  Euler,
  useLoader,
  useResource,
  MeshProps,
  Object3DNode,
} from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Mesh, PerspectiveCamera, RectAreaLight, Vector3, WebGLRenderer } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

extend({ OrbitControls });
extend({ RectAreaLightHelper });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>,
      rectAreaLightHelper: Object3DNode<RectAreaLightHelper, typeof RectAreaLightHelper>,
    }
  }
}
const RootComponent = styled.div`
  width: 100vw;
  height: 100vh;
`;

function Loading() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function CameraControls() {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree() as {
    camera: PerspectiveCamera,
    gl: WebGLRenderer,
  };

  useMemo(() => {
    camera.fov = 15;
    camera.position.set(-10, 1, 0);
    camera.updateProjectionMatrix();
  }, []);

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef<OrbitControls>();
  useFrame(() => controls.current.update());
  const targetVector = new Vector3();
  targetVector.set(0, 1.2, 0);
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom
      autoRotate
      autoRotateSpeed={-1.0}
      target={targetVector}
      maxDistance={15}
      minDistance={5}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI * (3 / 8)}
    />
  );
}

function Floor() {
  return (
    <mesh visible scale={[100, 100, 100]} rotation={[-Math.PI * (1 / 2), 0, 0]}>
      <planeGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={0.1}
        metalness={0}
      />
    </mesh>
  );
}

function AreaLight({ position, rotation }: {position?: FiberVector3, rotation?: Euler}) {
  useMemo(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <mesh visible position={position} rotation={rotation}>
      <rectAreaLight color="#FFFFFF" intensity={20} width={0.1} height={5} />
    </mesh>
  );
}

AreaLight.defaultProps = {
  rotation: undefined,
  position: undefined,
};

function TopLight({ position, rotation }: {position?: FiberVector3, rotation?: Euler}) {
  const lightRef = useResource<RectAreaLight>();

  useMemo(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <mesh visible position={position} rotation={rotation}>
      <rectAreaLight ref={lightRef} color="#FFFFFF" intensity={5} width={2.5} height={4} />
      <rectAreaLightHelper light={lightRef.current} dispose={() => {}} />
    </mesh>
  );
}

TopLight.defaultProps = {
  rotation: undefined,
  position: undefined,
};

interface CarProps extends MeshProps {
  url: string
}

function Car(props: CarProps) {
  const { url } = props;
  const meshRef = useRef<Mesh>();
  const model = useLoader(GLTFLoader, url);

  return (
    <mesh
      ref={meshRef}
      visible
      position={[0, 0, 0]}
      {...props}
    >
      <primitive object={model.scene} />
    </mesh>
  );
}

function BacklitVehiclePage() {
  return (
    <>
      <Head>
        <title>Vehicle Lighting Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <RootComponent>
        <Canvas style={{ background: '#000000' }}>
          <CameraControls />
          <Suspense fallback={<Loading />}>
            <AreaLight position={[0, 0, -5]} rotation={[0, Math.PI, 0]} />
            <AreaLight position={[0, 0, 5]} />
            <TopLight position={[0, 4, 0]} rotation={[-Math.PI / 2, 0, 0]} />
            <Car url="/alfa/scene.gltf" scale={[12, 12, 12]} />
            <Floor />
          </Suspense>
        </Canvas>
      </RootComponent>
    </>
  );
}

export default BacklitVehiclePage;
