import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import parameters from './parameters'

let W = window.innerWidth
let H = window.innerHeight
let dpr = parseInt((new URL(document.location)).searchParams.get('dpr')) || window.devicePixelRatio
let rafId = 0

const TAU = 2 * Math.PI

let geometry = null
let material = null
let points = null

let step = 0

export default class Sketch {
	constructor({ canvas }) {
		this.canvas = canvas

		this.init()
		this.generate()
	}

	init() {
		this.scene = new THREE.Scene()

		this.camera = new THREE.PerspectiveCamera(75, W / H, 1, 100)
		this.camera.position.x = 3
		this.camera.position.y = 2
		this.camera.position.z = 5
		this.scene.add(this.camera)

		this.controls = new OrbitControls(this.camera, this.canvas)
		this.controls.minDistance = 5
		this.controls.maxDistance = 20
		this.controls.enableDamping = true

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
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
		if (points !== null) {
			geometry.dispose()
			material.dispose()
			this.scene.remove(points)
		}
	
		geometry = new THREE.BufferGeometry()
		const positions = new Float32Array(parameters.count * 3)
		const colors = new Float32Array(parameters.count * 3)
	
		const innerColor = new THREE.Color(parameters.innerColor)
		const outerColor = new THREE.Color(parameters.outerColor)
	
		for (let i = 0; i < parameters.count; i++) {
	
			const i3 = i * 3

			// position
			const radius = Math.random() * parameters.radius
			const spinAngle = radius * parameters.spin
			const branchAngle = (i % parameters.branches) / parameters.branches * TAU
	
			const x = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness * radius
			const y = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness * radius
			const z = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness * radius
	
			positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + x
			positions[i3 + 1] = y
			positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + z
	

			// color
			const mixedColor = innerColor.clone()
			mixedColor.lerp(outerColor, radius / parameters.radius)
	
			colors[i3 + 0] = mixedColor.r
			colors[i3 + 1] = mixedColor.g
			colors[i3 + 2] = mixedColor.b
	
		}
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	
		material = new THREE.PointsMaterial({
			size: parameters.size,
			sizeAttenuation: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			vertexColors: true,
		})
	
		points = new THREE.Points(geometry, material)
		this.scene.add(points)
	}

	animate() {
		rafId = requestAnimationFrame(this.animate.bind(this))

		if (points) points.rotation.y = step * .0012

		this.draw()

		step++
	}

	draw() {
		this.controls.update()
		this.renderer.render(this.scene, this.camera)
	}

	start() {
		this.animate()
	}

	stop() {
		cancelAnimationFrame(rafId)
	}

	restart() {
		this.stop()
		this.generate()
		this.start()
	}
}