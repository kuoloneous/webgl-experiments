import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { AnimationAction, AnimationMixer, MathUtils } from 'three';

const MODEL_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';

const LoadingScreen = styled.div`
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
`;

function CharacterPage() {
  const divRef = useRef<HTMLDivElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);
  const backgroundColor = 0xf1f1f1;

  let scene;
  let renderer;
  let camera;
  let model; // Our character
  let neck; // Reference to the neck bone in the skeleton
  let waist; // Reference to the waist bone in the skeleton
  let mixer: AnimationMixer; // THREE.js animations mixer
  let idle: AnimationAction; // Idle, the default state our character returns to
  const clock = new THREE.Clock(); // Used for anims, which run to a clock instead of frame rate

  useEffect(() => {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    divRef.current.appendChild(renderer.domElement);

    // Camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 30;
    camera.position.x = 0;
    camera.position.y = -3;

    // 3D Model
    const stacy_txt = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
    stacy_txt.flipY = false; // we flip the texture so that its the right way up
    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true,
    });

    const loader = new GLTFLoader();

    loader.load(
      MODEL_URL,
      (gltf: GLTF): void => {
        model = gltf.scene;
        const fileAnimations = gltf.animations;

        model.traverse((object) => {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            object.material = stacy_mtl;
          }
          // Reference the neck and waist bones
          if (object.isBone && object.name === 'mixamorigNeck') {
            neck = object;
          }
          if (object.isBone && object.name === 'mixamorigSpine') {
            waist = object;
          }
        });
        model.scale.set(7, 7, 7);
        model.position.y = -11;

        scene.add(model);

        // Loading Screen
        if (loadingScreenRef.current) {
          loadingScreenRef.current.remove();
        }

        // Animation
        mixer = new THREE.AnimationMixer(model);
        const idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'idle');

        // adding in splices for mouse move
        idleAnim.tracks.splice(3, 3);
        idleAnim.tracks.splice(9, 3);

        idle = mixer.clipAction(idleAnim);
        idle.play();
      },
      undefined, // We don't need this function
      (error: ErrorEvent): void => {
        console.error(error);
      },
    );

    // Add lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    const d = 8.25;
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xeeeeee,
      shininess: 0,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);

    // Circle
    const geometry = new THREE.SphereGeometry(8, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x9bffaf }); // 0xf2ce2e
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = -15;
    sphere.position.y = -2.5;
    sphere.position.x = -0.25;
    scene.add(sphere);

    const animate = () => {
      // Idle Animation
      if (mixer) {
        mixer.update(clock.getDelta());
      }

      // Resizing Check
      if (resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvasPixelWidth = canvas.width / window.devicePixelRatio;
    const canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function handleOnMouseMove(event: any): void {
    const mouseEvent = event as MouseEvent;
    const mousecoords = getMousePos(mouseEvent);

    if (neck && waist) {
      moveJoint(mousecoords, neck, 50);
      moveJoint(mousecoords, waist, 30);
    }
  }

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }

  function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0;
    let dy = 0;
    let xdiff;
    let xPercentage;
    let ydiff;
    let yPercentage;

    const w = { x: window.innerWidth, y: window.innerHeight };

    // Left (Rotates neck left between 0 and -degreeLimit)

    // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
      // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x;
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100;
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1;
    }
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      // Note that I cut degreeLimit in half when she looks up
      dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }

    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }

  function moveJoint(mouse, joint, degreeLimit) {
    const degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
    joint.rotation.y = MathUtils.degToRad(degrees.x);
    joint.rotation.x = MathUtils.degToRad(degrees.y);
  }

  return (
    <>
      <Head>
        <title>Character Test</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <LoadingScreen ref={loadingScreenRef}>
        <CircularProgress />
      </LoadingScreen>
      <div ref={divRef} onMouseMove={handleOnMouseMove} />
    </>
  );
}

export default CharacterPage;
