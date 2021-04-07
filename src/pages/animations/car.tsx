import React, { useRef, Suspense } from 'react';
import Head from 'next/head';
import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import styled from 'styled-components';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Mesh } from 'three';

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

function Lambo() {
  const meshRef = useRef<Mesh>();
  const model = useLoader(GLTFLoader, '/lambo/scene.gltf');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} receiveShadow visible position={[0, -0.5, 5]} rotation={[0, 1, 1]}>
      <primitive object={model.scene} />
    </mesh>
  );
}


function CarPage() {
  return (
    <>
      <Head>
        <title>Vehicle Test Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <RootComponent>
        <Canvas shadowMap camera={{ position: [0, 0, 15] }}>
          <Suspense fallback={<Loading />}>
            <ambientLight intensity={0.5} />
            <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
            <Lambo />
            <mesh receiveShadow>
              <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
              <meshPhongMaterial attach="material" color="#272727" />
            </mesh>
          </Suspense>
        </Canvas>
      </RootComponent>
    </>
  );
}

export default CarPage;
