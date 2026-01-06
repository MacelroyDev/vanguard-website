'use client'

import { view } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { SkinViewer } from 'skinview3d'
import * as THREE from 'three'

type Props = {
	skinUrl: string
}

export default function MinecraftSkinViewer({ skinUrl }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!canvasRef.current) return

		const viewer = new SkinViewer({
			canvas: canvasRef.current,
			width: 150,
			height: 200,
		})

		// Camera (typed)
		viewer.camera.position.set(0, 20, 40)

		// Lighting (typed, TS-safe)
		const light = new THREE.DirectionalLight(0xffffff, 1)
		light.position.set(0, 20, 20)
		viewer.scene.add(light)

		// Animation (typed, TS-safe)
		viewer.autoRotate = true;
		//viewer.animation = new skinview3d.IdleAnimation();

		viewer.controls.enablePan = false;
		viewer.controls.enableZoom = false;
		viewer.controls.enableRotate = false;

		// Load skin with auto Steve/Alex detection
		viewer.loadSkin(skinUrl, {
			model: 'auto-detect',
		})

		return () => {
			viewer.dispose()
		}
	}, [skinUrl])

	return (
		<canvas
			ref={canvasRef}
			className="mx-auto"
			style={{ imageRendering: 'pixelated' }}
		/>
	)
}
