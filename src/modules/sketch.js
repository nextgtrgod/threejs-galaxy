import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from '../shaders/galaxy/vertex.glsl?raw'
import fragment from '../shaders/galaxy/fragment.glsl?raw'
import Clock from './clock.js'
import parameters from './parameters'

const clock = new Clock(false)

let W = window.innerWidth
let H = window.innerHeight
let dpr = parseInt((new URL(document.location)).searchParams.get('dpr')) || window.devicePixelRatio
let rafId = 0
let startTime = 30

export default class Sketch {
	constructor({ canvas }) {
		this.canvas = canvas

		this.init()
		this.generate()
	}

	init() {
		this.scene = new THREE.Scene()

		this.camera = new THREE.PerspectiveCamera(75, W / H, 1, 50)
		this.camera.position.x = 3
		this.camera.position.y = 1.75
		this.camera.position.z = 5
		this.scene.add(this.camera)

		this.controls = new OrbitControls(this.camera, this.canvas)
		this.controls.enableDamping = true

		if (import.meta.env.PROD) {
			this.controls.minDistance = 5
			this.controls.maxDistance = 20
		}

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			powerPreference: 'high-performance',
		})
		this.renderer.setSize(W, H)
		this.renderer.setPixelRatio(dpr)

		window.addEventListener('resize', this.setSize.bind(this))
	}

	setSize() {
		W = window.innerWidth
		H = window.innerHeight

		this.camera.aspect = W / H
		this.camera.updateProjectionMatrix()

		this.renderer.setSize(W, H)
		this.renderer.setPixelRatio(dpr)
	}

	generate() {
		if (this.galaxy) {
			this.galaxy.geometry.dispose()
			this.galaxy.material.dispose()
			this.scene.remove(this.galaxy)
		}
	
		const geometry = new THREE.BufferGeometry()
		const positions = new Float32Array(parameters.count * 3)
		const colors = new Float32Array(parameters.count * 3)
		const scales = new Float32Array(parameters.count * 1)
		const randomness = new Float32Array(parameters.count * 3)
	
		const innerColor = new THREE.Color(parameters.innerColor)
		const outerColor = new THREE.Color(parameters.outerColor)

		for (let i = 0; i < parameters.count; i++) {
	
			const i3 = i * 3

			// position
			const radius = Math.random() * parameters.radius

			const branchAngle = (i % parameters.branches) / parameters.branches * 2 * Math.PI
	
			const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
			const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
			const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
	
			positions[i3 + 0] = Math.cos(branchAngle) * radius
			positions[i3 + 1] = 0
			positions[i3 + 2] = Math.sin(branchAngle) * radius
	
			randomness[i3 + 0] = randomX
			randomness[i3 + 1] = randomY
			randomness[i3 + 2] = randomZ

			// color
			const mixedColor = innerColor.clone()
			mixedColor.lerp(outerColor, radius / parameters.radius)
	
			colors[i3 + 0] = mixedColor.r
			colors[i3 + 1] = mixedColor.g
			colors[i3 + 2] = mixedColor.b

			scales[i] = Math.random()
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
		geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
		geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
	
		const material = new THREE.ShaderMaterial({
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
			vertexShader: vertex,
			fragmentShader: fragment,
			uniforms: {
				uTime: { value: startTime },
				uSize: { value: 16 * this.renderer.getPixelRatio() },
			},
		})
	
		this.galaxy = new THREE.Points(geometry, material)
		this.scene.add(this.galaxy)
	}

	animate() {
		rafId = requestAnimationFrame(this.animate.bind(this))
		const elapsedTime = clock.getElapsedTime()

		this.galaxy.material.uniforms.uTime.value = startTime + elapsedTime
		// this.galaxy.rotation.y = -elapsedTime * 0.33

		this.draw()
	}

	draw() {
		this.controls.update()
		this.renderer.render(this.scene, this.camera)
	}

	start() {
		clock.resume()
		this.animate()
	}

	stop() {
		clock.pause()
		cancelAnimationFrame(rafId)
	}

	restart() {
		this.stop()
		this.generate()
		this.start()
	}
}