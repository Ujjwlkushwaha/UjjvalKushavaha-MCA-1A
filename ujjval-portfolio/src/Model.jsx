import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Static 3D model: rendered once (and on resize), no animation loop.
export default function Model() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, box = cv.parentElement
    const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const S = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    S.add(new THREE.HemisphereLight(0xfffbf1, 0x8c7c69, 1))
    const l1 = new THREE.PointLight(0xd66a48, 1.8, 40); l1.position.set(-5, 3, 6); S.add(l1)
    const l2 = new THREE.PointLight(0x8b9b78, 1.35, 40); l2.position.set(5, -3, 6); S.add(l2)
    const g = new THREE.Group(); g.rotation.set(0.45, -0.5, 0.1); S.add(g)
    g.add(
      new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, 0.48, 240, 36, 2, 3),
        new THREE.MeshPhysicalMaterial({ color: 0xb94d32, metalness: 0.22, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 })),
      new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1),
        new THREE.MeshBasicMaterial({ color: 0x39362f, wireframe: true, transparent: true, opacity: 0.13 })),
    )
    ;[[0xd66a48, 2.9, 0.9], [0x8b9b78, -2.8, -1.1]].forEach(([c, x, y]) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), new THREE.MeshStandardMaterial({ color: c, roughness: 0.3 }))
      b.position.set(x, y, 0.5); S.add(b)
    })
    const draw = () => {
      const w = box.clientWidth, h = box.clientHeight, a = w / h
      R.setSize(w, h, false); cam.aspect = a
      cam.position.z = Math.max(8.2, 6.6 / (2 * Math.tan((38 / 2) * Math.PI / 180) * a))
      cam.updateProjectionMatrix(); R.render(S, cam)
    }
    draw(); window.addEventListener('resize', draw)
    return () => {
      window.removeEventListener('resize', draw)
      S.traverse((object) => {
        if (!object.isMesh) return
        object.geometry.dispose()
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
        else object.material.dispose()
      })
      R.dispose()
    }
  }, [])
  return <canvas ref={ref} className="model" aria-label="3D torus knot" />
}
