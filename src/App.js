import React, { Suspense, useEffect, useRef } from "react";
import "./App.scss";

//Components
import Header from "./components/header";
import {Section} from "./components/section"
import { Canvas, useFrame } from "react-three-fiber";

import { Html, useGLTF } from "@react-three/drei";

//page states
import state from "./components/state";

//intersection observer
import { useInView } from "react-intersection-observer";

const Model = ({path}) => {
  const gltf = useGLTF(path)
  return <primitive object={gltf.scene} dispose={null}/>
}

const Lights = () => {
  return(
    <>
      <ambientLight intensity={.3}/>
      <directionalLight position={[10, 10, 5]} intensity={1}/>
      <directionalLight position={[0, 10, 0]} intensity={1.5}/>
      <spotLight position={[1000, 0, 0]} intensity={1}/>
    </>
  )
}
 
const HTMLContent = ({bgColor,domContent, children, modelPath, position}) => {
  const ref = useRef(null)
  useFrame(() => (ref.current.rotation.y += .01))
  const [refItem, inView] = useInView({
    threshold: 0
  })

  useEffect(() => {
    inView && (document.body.style.background = bgColor)
  }, [inView])

  return(
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <Model path={modelPath}/>
        </mesh>
        <Html portal={domContent} fullscreen> 
          <div className="container" ref={refItem}>
            {children}
          </div>
        </Html>
      </group>
    </Section>
  )
}

export default function App() {
  const domContent = useRef();
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({target: scrollArea.current}), [])
  return (
    <>
      <Header />
      <Canvas camera={{position:[0, 0, 120], fov: 70}}>
      <Lights/>
        <Suspense fallback={null}>
          <HTMLContent  domContent={domContent} modelPath={"/armchairYellow.gltf"} position={250} bgColor={'#f15946'}>
            <div>
              <h1 className="title">Yellow</h1>
            </div>
          </HTMLContent>
          <HTMLContent domContent={domContent} modelPath={"/armchairGreen.gltf"} position={0} bgColor={'#571ec1'}>
            <div>
              <h1 className="title">Green</h1>
            </div>
          </HTMLContent>
          <HTMLContent domContent={domContent} modelPath={"/armchairGray.gltf"} position={-250} bgColor={'#636567'}>
            <div>
              <h1 className="title">Gray</h1>
            </div>
          </HTMLContent>
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll}>
        <div style={{position: "sticky", top: 0}} ref={domContent}></div>
        <div style={{height: `${state.pages * 100}vh` }}></div>
      </div>
    </>
  );
}
