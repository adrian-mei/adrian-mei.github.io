import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';

// Helper to create star texture
const createStarTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

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

    // Central Hub - "Reactor Core"
    const hubGroup = new THREE.Group();
    scene.add(hubGroup);

    // Inner Core (Dense, fast spinning)
    const innerHubGeometry = new THREE.IcosahedronGeometry(1.5, 1);
    const innerHubMaterial = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.8 });
    const innerHub = new THREE.Mesh(innerHubGeometry, innerHubMaterial);
    hubGroup.add(innerHub);

    // Outer Shell (Larger, slow spinning)
    const outerHubGeometry = new THREE.IcosahedronGeometry(2.8, 0);
    const outerHubMaterial = new THREE.MeshBasicMaterial({ color: 0x1e40af, wireframe: true, transparent: true, opacity: 0.3 });
    const outerHub = new THREE.Mesh(outerHubGeometry, outerHubMaterial);
    hubGroup.add(outerHub);

    const nodes: { group: THREE.Group; meshA: THREE.Mesh; meshB: THREE.Mesh; angle: number; radius: number }[] = [];
    const nodeColors = [0x8b5cf6, 0x06b6d4, 0x10b981, 0xf59e0b];
    
    // Shape library for transformation
    const nodeGeometries = [
        new THREE.TetrahedronGeometry(1.2, 0),
        new THREE.BoxGeometry(1.5, 1.5, 1.5),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.IcosahedronGeometry(1.2, 0),
        new THREE.ConeGeometry(0.8, 1.5, 4) // Pyramidal
    ];

    // State tracking for each node
    const nodeStates = Array(4).fill(0).map(() => ({
        lastPhase: 0,
        geometryIndex: 0,
        morphProgress: 0,
        isMorphing: false
    }));
    
    for (let i = 0; i < 4; i++) {
      const group = new THREE.Group();
      
      // Mesh A (Current Shape)
      const geometryA = nodeGeometries[0];
      const materialA = new THREE.MeshBasicMaterial({ color: nodeColors[i], wireframe: true, transparent: true, opacity: 1 });
      const meshA = new THREE.Mesh(geometryA, materialA);
      
      // Mesh B (Next Shape - initially hidden)
      const geometryB = nodeGeometries[0];
      const materialB = new THREE.MeshBasicMaterial({ color: nodeColors[i], wireframe: true, transparent: true, opacity: 0 });
      const meshB = new THREE.Mesh(geometryB, materialB);
      
      group.add(meshA);
      group.add(meshB);

      const angle = (i / 4) * Math.PI * 2;
      const radius = 10;
      group.position.x = Math.cos(angle) * radius;
      group.position.z = Math.sin(angle) * radius;
      group.position.y = Math.sin(i) * 2;
      
      scene.add(group);
      nodes.push({ group, meshA, meshB, angle, radius });
    }

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, opacity: 0.15, transparent: true });
    const lines: THREE.Line[] = [];
    const lightningBolts: THREE.Line[] = [];
    const lightningMaterials: THREE.LineBasicMaterial[] = [];

    // External Solar System
    const solarSystemGroup = new THREE.Group();
    scene.add(solarSystemGroup);

    // 1. Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starPositions = new Float32Array(starCount * 3);
    
    for(let i = 0; i < starCount; i++) {
        const r = 40 + Math.random() * 60; // Distant shell
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starTexture = createStarTexture();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        map: starTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    solarSystemGroup.add(starField);

    // 2. Distant Planets
    const planets: { mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number }[] = [];
    const planetGeometries = [
        new THREE.IcosahedronGeometry(2, 1),
        new THREE.TorusGeometry(1.5, 0.4, 8, 20),
        new THREE.SphereGeometry(1.8, 8, 8)
    ];

    for(let i = 0; i < 3; i++) {
        const radius = 30 + i * 15;
        const geometry = planetGeometries[i];
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x4b5563, // Darker grey/blue
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const planet = new THREE.Mesh(geometry, material);
        
        // Initial position
        const angle = Math.random() * Math.PI * 2;
        planet.position.x = Math.cos(angle) * radius;
        planet.position.z = Math.sin(angle) * radius;
        
        solarSystemGroup.add(planet);
        
        // Add orbit ring
        const ringGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x3b82f6, 
            transparent: true, 
            opacity: 0.1,
            side: THREE.DoubleSide 
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        solarSystemGroup.add(ring);

        planets.push({ mesh: planet, orbitRadius: radius, speed: 0.002 / (i + 1), angle });
    }

    nodes.forEach((node, i) => {
      // Create structural line
      const points = [hubGroup.position, node.group.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);

      // Create lightning bolt with unique material
      const boltMaterial = new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 2 });
      const boltGeometry = new THREE.BufferGeometry();
      const bolt = new THREE.Line(boltGeometry, boltMaterial);
      scene.add(bolt);
      lightningBolts.push(bolt);
      lightningMaterials.push(boltMaterial);
    });

    camera.position.z = 14;
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
      
      // Animate Hub
      hubGroup.rotation.y += 0.002; // Slowly rotate entire group
      innerHub.rotation.x -= 0.02;  // Fast counter-rotation
      innerHub.rotation.z += 0.01;
      outerHub.rotation.y += 0.005; // Slow shell rotation

      // Pulse Inner Core
      // Check if ANY node is in Phase 0 (Sending)
      // Since phase depends on `i`, multiple might be sending?
      // Let's just pulse continuously but intensify based on global time for "heartbeat"
      const pulseScale = 1 + Math.sin(time * 5) * 0.05;
      innerHub.scale.set(pulseScale, pulseScale, pulseScale);
      
      nodes.forEach((node, i) => {
        node.angle += 0.005;
        node.group.position.x = Math.cos(node.angle) * node.radius;
        node.group.position.z = Math.sin(node.angle) * node.radius;
        node.group.position.y = Math.sin(time + i) * 2;
        
        // Rotate the meshes inside the group
        node.meshA.rotation.x += 0.01;
        node.meshA.rotation.y += 0.01;
        node.meshB.rotation.x += 0.01;
        node.meshB.rotation.y += 0.01;
        
        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        node.group.scale.set(scale, scale, scale);

        // Update structural line position
        const line = lines[i];
        const points = [hubGroup.position, node.group.position];
        line.geometry.setFromPoints(points);

        // Update lightning bolt
        const bolt = lightningBolts[i];
        const material = lightningMaterials[i];
        
        // Cycle logic for "Call and Response"
        // 3 Phases: 0=Hub->Node, 1=Morph, 2=Node->Hub
        const cycleSpeed = 2.0;
        const cycleTime = time * cycleSpeed + i;
        const phase = Math.floor(cycleTime) % 3; 
        const linearProgress = cycleTime % 1;
        
        // Shape Shifting Logic
        // Trigger Morph at start of Phase 1 (after receiving signal in Phase 0)
        const nodeState = nodeStates[i];
        if (phase === 1 && nodeState.lastPhase === 0) {
            // Trigger morph
            const nextIndex = (nodeState.geometryIndex + 1) % nodeGeometries.length;
            
            // Prepare Mesh B for morphing in
            node.meshB.geometry = nodeGeometries[nextIndex];
            (node.meshB.material as THREE.MeshBasicMaterial).opacity = 0;
            
            nodeState.isMorphing = true;
            nodeState.morphProgress = 0;
            nodeState.geometryIndex = nextIndex;
        }
        nodeState.lastPhase = phase;

        // Handle Morph Animation
        if (nodeState.isMorphing) {
            nodeState.morphProgress += 0.03; // Slightly faster to complete within phase
            
            if (nodeState.morphProgress >= 1) {
                // Morph complete
                nodeState.isMorphing = false;
                nodeState.morphProgress = 0;
                
                // Swap: Mesh A becomes the new shape, Mesh B resets
                node.meshA.geometry = node.meshB.geometry;
                (node.meshA.material as THREE.MeshBasicMaterial).opacity = 1;
                (node.meshB.material as THREE.MeshBasicMaterial).opacity = 0;
            } else {
                // Interpolate Opacity
                // Smoothstep for smoother visual
                const t = nodeState.morphProgress;
                const alpha = t * t * (3 - 2 * t);
                
                (node.meshA.material as THREE.MeshBasicMaterial).opacity = 1 - alpha;
                (node.meshB.material as THREE.MeshBasicMaterial).opacity = alpha;
                
                // Add extra spin during morph
                node.meshA.rotation.y += 0.1;
                node.meshB.rotation.y += 0.1;
                
                // Slight scale pop
                const morphScale = 1 + Math.sin(t * Math.PI) * 0.3;
                node.meshB.scale.set(morphScale, morphScale, morphScale);
            }
        }
        
        // Lightning Bolt Animation
        // Only active in Phase 0 and Phase 2
        const shotDuration = 0.8;
        let progress = 0;
        
        let isActive = false;
        let startPos = new THREE.Vector3();
        let endPos = new THREE.Vector3();

        if (phase === 0) {
            // Hub -> Node
            isActive = true;
            material.color.setHex(0x60a5fa); // Hub Blue
            startPos.copy(hubGroup.position);
            endPos.copy(node.group.position);
            
            // Intensify Hub Pulse when sending
            const sendPulse = 1 + Math.sin(time * 20) * 0.1;
            innerHub.scale.set(sendPulse, sendPulse, sendPulse);
            
        } else if (phase === 2) {
            // Node -> Hub
            isActive = true;
            material.color.setHex(nodeColors[i]); // Node Color
            startPos.copy(node.group.position);
            endPos.copy(hubGroup.position);
        } else {
            // Phase 1: Morphing (No lightning)
            isActive = false;
        }

        if (isActive && linearProgress < shotDuration) {
            progress = linearProgress / shotDuration;
            // Easing for impact (fast start, slow end looks more like projectile, linear is fine for beam)
            // Let's keep it linear but fast.
            
            // Calculate tip of the bolt
            const tipPos = new THREE.Vector3().copy(startPos).lerp(endPos, progress);
            
            const lightningPoints = [];
            const segments = 12;
            const spread = 0.3; 
            
            lightningPoints.push(startPos);
            
            // Only generate points if we have length
            if (progress > 0.05) {
                for (let j = 1; j < segments; j++) {
                    const alpha = j / segments;
                    const point = new THREE.Vector3().copy(startPos).lerp(tipPos, alpha);
                    
                    // Jitter
                    point.x += (Math.random() - 0.5) * spread;
                    point.y += (Math.random() - 0.5) * spread;
                    point.z += (Math.random() - 0.5) * spread;
                    
                    lightningPoints.push(point);
                }
            }
            lightningPoints.push(tipPos);
            bolt.geometry.setFromPoints(lightningPoints);
            bolt.visible = true;
        } else {
            // Gap between shots
            bolt.visible = false;
        }
      });
      
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 3 - camera.position.y + 5) * 0.05;
      camera.lookAt(scene.position);
      
      // Animate Solar System
      starField.rotation.y += 0.0005; // Slowly rotate stars
      
      planets.forEach(p => {
          p.angle += p.speed;
          p.mesh.position.x = Math.cos(p.angle) * p.orbitRadius;
          p.mesh.position.z = Math.sin(p.angle) * p.orbitRadius;
          p.mesh.rotation.y += 0.01; // Rotate planet itself
      });

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
