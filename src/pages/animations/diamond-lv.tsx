import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
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
  VideoTexture,
  WebGLRenderTarget,
} from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
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
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.id = 'backgroundVideo';
    vid.src = '/shaq wiggle.mp4';
    vid.muted = true;
    vid.autoplay = true;
    vid.loop = true;
    vid.play();
    return vid;
  });

  const texture = new VideoTexture(video);

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
    <>
      <mesh ref={meshRef} scale={[adaptedWidth, adaptedHeight, 1]}>
        <planeBufferGeometry attach="geometry" />
        <meshBasicMaterial attach="material" map={texture} depthTest={false} />
      </mesh>
    </>

  );
}

function BunchofLVs() {
  const {
    size, viewport, gl, scene, camera, clock,
  } = useThree();
  const model = useRef<InstancedMesh>();
  const gltf = useLoader<any, any>(GLTFLoader, '/LV.glb');

  const geometries = [
    gltf.nodes.CarWrap.geometry,
    gltf.nodes.CardBody.geometry,
    gltf.nodes.Hubcaps.geometry,
    gltf.nodes.Tires.geometry,
    gltf.nodes.Trims.geometry,
  ];

  const filteredGeos = geometries.map((geometry) => {
    const modifiedGeo = geometry;
    if (modifiedGeo.attributes.tangent) {
      delete modifiedGeo.attributes.tangent;
    }
    return modifiedGeo;
  });

  const mainGeo = BufferGeometryUtils.mergeBufferGeometries(filteredGeos, false);

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
  const lvArray = useMemo(
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
    lvArray.forEach((data, i) => {
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
      dummy.scale.set(2 + factor, 2 + factor, 2 + factor);
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
    <instancedMesh ref={model} args={[null, null, lvArray.length]}>
      <bufferGeometry attach="geometry" {...mainGeo} />
      <meshBasicMaterial attach="material" />
    </instancedMesh>
  );
}

function DiamondLVPage() {
  return (
    <>
      <Head>
        <title>Diamond LV Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <RootComponent>
        <Canvas camera={{ position: [0, 0, 30] }}>
          <ambientLight intensity={0} />
          <Suspense fallback={<Loading />}>
            <Background />
            <BunchofLVs />
            {/* <Car url="/lambo/optimized-scene.gltf" /> */}
          </Suspense>
        </Canvas>
      </RootComponent>
    </>
  );
}

export default DiamondLVPage;
