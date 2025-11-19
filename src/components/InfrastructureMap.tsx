import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

const InfrastructureMap = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const isVisible = useIntersectionObserver(mountRef, { threshold: 0.1 });
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDesktop || !mountRef.current || !isVisible) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const hubGeometry = new THREE.OctahedronGeometry(2, 0);
    const hubMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(hub);

    const nodes: { mesh: THREE.Mesh; angle: number; radius: number }[] = [];
    const nodeColors = [0x8b5cf6, 0x06b6d4, 0x10b981, 0xf59e0b];
    
    for (let i = 0; i < 4; i++) {
      const nodeGeometry = new THREE.TetrahedronGeometry(0.8, 0);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: nodeColors[i], wireframe: true });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      const angle = (i / 4) * Math.PI * 2;
      const radius = 8;
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y = Math.sin(i) * 2;
      
      scene.add(node);
      nodes.push({ mesh: node, angle, radius });
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, opacity: 0.3, transparent: true });
    nodes.forEach(node => {
      const points = [hub.position, node.mesh.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });

    camera.position.z = 20;
    camera.position.y = 5;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      time += 0.01;
      
      hub.rotation.x += 0.005;
      hub.rotation.y += 0.005;
      
      nodes.forEach((node, i) => {
        node.angle += 0.005;
        node.mesh.position.x = Math.cos(node.angle) * node.radius;
        node.mesh.position.z = Math.sin(node.angle) * node.radius;
        node.mesh.position.y = Math.sin(time + i) * 2;
        node.mesh.rotation.x += 0.01;
        node.mesh.rotation.y += 0.01;
        
        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        node.mesh.scale.set(scale, scale, scale);
      });
      
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 3 - camera.position.y + 5) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isDesktop, isVisible]);

  if (!isDesktop) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950" />
    );
  }

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default InfrastructureMap;
