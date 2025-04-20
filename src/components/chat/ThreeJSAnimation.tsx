
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeJSAnimationProps {
  isOpen: boolean;
}

export const ThreeJSAnimation = ({ isOpen }: ThreeJSAnimationProps) => {
  const glossyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!glossyContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 1.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });

    const size = isOpen ? 50 : 120;
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    glossyContainerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.CircleGeometry(1, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size, size) }
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
          
          float dist = length(uv);
          float glow = smoothstep(0.75, 1.0, dist);
          vec3 glowColor = vec3(0.5, 0.8, 1.0);
          col = mix(col, col + glowColor, glow * 0.75);
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });

    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.iTime.value += 0.01;
      circle.position.y = Math.sin(Date.now() * 0.001) * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newSize = isOpen ? 50 : 120;
      renderer.setSize(newSize, newSize);
      material.uniforms.iResolution.value = new THREE.Vector2(newSize, newSize);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (glossyContainerRef.current && glossyContainerRef.current.contains(renderer.domElement)) {
        glossyContainerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
    };
  }, [isOpen]);

  return <div ref={glossyContainerRef} className="w-full h-full rounded-full overflow-hidden" />;
};
