
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const GlossyCircle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.2;
    
    // Setup renderer with alpha and antialias
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true 
    });
    renderer.setSize(120, 120);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create circle geometry
    const geometry = new THREE.CircleGeometry(1, 64);
    
    // Create shader material with glossy gradient and inner glow
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(120, 120) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        varying vec2 vUv;
        
        void main() {
          vec2 fragCoord = vUv * iResolution;
          float mr = min(iResolution.x, iResolution.y);
          vec2 uv = (fragCoord * 2.0 - iResolution) / mr;
          
          float d = -iTime * 0.5;
          float a = 0.0;
          for (float i = 0.0; i < 8.0; ++i) {
            a += cos(i - d - a * uv.x);
            d += sin(uv.y * i + a);
          }
          d += iTime * 0.5;
          vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
          col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);
          
          // Add inner glow
          float dist = length(uv);
          float glow = smoothstep(0.8, 1.0, dist);
          vec3 glowColor = vec3(0.5, 0.8, 1.0);
          col = mix(col, col + glowColor, glow * 0.5);
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });
    
    // Create mesh from geometry and material
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.iTime.value += 0.01;
      circle.position.y = Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const { current } = containerRef;
      if (!current) return;
      renderer.setSize(120, 120);
      material.uniforms.iResolution.value = new THREE.Vector2(120, 120);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 right-8 w-[120px] h-[120px] z-[9999] rounded-full overflow-hidden"
      style={{
        filter: 'drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))',
        animation: 'pulse 3s infinite',
        opacity: 1,
        willChange: 'transform'
      }}
    />
  );
};
