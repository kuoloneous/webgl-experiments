import React, { useRef, useMemo, Suspense } from 'react';
import Head from 'next/head';
import {
  Canvas, useFrame, useLoader, useThree,
} from 'react-three-fiber';
import styled from 'styled-components';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  InstancedMesh,
  LinearFilter,
  Mesh,
  Object3D,
  TextureLoader,
  WebGLRenderTarget,
} from 'three';
import RefractionMaterial from '../../components/utils/materials/refraction.material';
import BackfaceMaterial from '../../components/utils/materials/backface.material';

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

function Background() {
  const { viewport, aspect } = useThree();
  const meshRef = useRef<Mesh>();
  const texture = useLoader(TextureLoader, '/flat-background.webp');

  useMemo(() => {
    texture.minFilter = LinearFilter;
  }, []);

  useFrame(() => {
    meshRef.current.layers.set(1);
  });

  const adaptedHeight = 3800
    * (aspect > 5000 / 3800 ? viewport.width / 5000 : viewport.height / 3800);
  const adaptedWidth = 5000
    * (aspect > 5000 / 3800 ? viewport.width / 5000 : viewport.height / 3800);
  return (
    <mesh ref={meshRef} scale={[adaptedWidth, adaptedHeight, 1]}>
      <planeBufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" map={texture} depthTest={false} />
    </mesh>
  );
}

function BunchOfShibas() {
  const {
    size, viewport, gl, scene, camera, clock,
  } = useThree();
  const model = useRef<InstancedMesh>();
  const gltf = useLoader(GLTFLoader, '/shiba/scene.gltf');
  const mesh = gltf.nodes.Box002_default_0 as Mesh;

  const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
    const envFbo = new WebGLRenderTarget(size.width, size.height);
    const backfaceFbo = new WebGLRenderTarget(size.width, size.height);
    const backfaceMaterial = new BackfaceMaterial();
    const refractionMaterial = new RefractionMaterial({
      envMap: envFbo.texture,
      backfaceMap: backfaceFbo.texture,
      resolution: [size.width, size.height],
    });
    return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial];
  }, [size]);

  // Create random position data
  const dummy = useMemo(() => new Object3D(), []);
  const shibas = useMemo(
    () => new Array(40).fill(null).map((_, i) => ({
      position: [i < 5 ? 0 : viewport.width / 2 - Math.random()
        * viewport.width, 40 - Math.random() * 40, i < 5 ? 26 : 10 - Math.random() * 20],
      factor: 0.1 + Math.random(),
      direction: Math.random() < 0.5 ? -1 : 1,
      rotation: [Math.sin(Math.random())
        * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI],
    })),
    [],
  );

  // Render-loop
  useFrame(() => {
    shibas.forEach((data, i) => {
      const modifedData = data;
      const t = clock.getElapsedTime();
      modifedData.position[1] -= (modifedData.factor / 5) * modifedData.direction;
      if (modifedData.direction === 1
        ? modifedData.position[1] < -50 : modifedData.position[1] > 50) {
        modifedData.position = [i < 5 ? 0 : viewport.width / 2 - Math.random()
          * viewport.width, 50 * modifedData.direction, modifedData.position[2]];
      }
      const { position, rotation, factor } = data;
      dummy.position.set(position[0], position[1], position[2]);
      dummy.rotation.set(
        rotation[0] + t * factor, rotation[1] + t * factor, rotation[2] + t * factor,
      );
      dummy.scale.set(4 + factor, 4 + factor, 4 + factor);
      dummy.updateMatrix();
      model.current.setMatrixAt(i, dummy.matrix);
    });
    model.current.instanceMatrix.needsUpdate = true;
    // Render env to fbo
    gl.autoClear = false;
    camera.layers.set(1);
    gl.setRenderTarget(envFbo);
    gl.render(scene, camera);
    // Render cube backfaces to fbo
    camera.layers.set(0);
    model.current.material = backfaceMaterial;
    gl.setRenderTarget(backfaceFbo);
    gl.clearDepth();
    gl.render(scene, camera);
    // Render env to screen
    camera.layers.set(1);
    gl.setRenderTarget(null);
    gl.render(scene, camera);
    gl.clearDepth();
    // Render cube with refraction material to screen
    camera.layers.set(0);
    model.current.material = refractionMaterial;
    gl.render(scene, camera);
  }, 1);

  return (
    <instancedMesh ref={model} args={[null, null, shibas.length]}>
      <bufferGeometry attach="geometry" {...mesh.geometry} />
      <meshBasicMaterial attach="material" />
    </instancedMesh>
  );
}

function DiamondShibasPage() {
  return (
    <>
      <Head>
        <title>Diamond Shibas Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <RootComponent>
        <Canvas camera={{ position: [0, 0, 30] }}>
          <Suspense fallback={<Loading />}>
            <Background />
            <BunchOfShibas />
            {/* <Car url="/lambo/optimized-scene.gltf" /> */}
          </Suspense>
        </Canvas>
      </RootComponent>
    </>
  );
}

export default DiamondShibasPage;
