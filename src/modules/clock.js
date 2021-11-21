import * as THREE from 'three'

export default class Clock extends THREE.Clock {
	constructor(autoStart) {
		super(autoStart)

		this.pauseTime = 0
	}

	pause() {
		this.pauseTime = this.elapsedTime
		this.running = false
		this.autoStart = false
	}

	resume() {
		this.oldTime = performance.now()
		this.running = true
	}

	getElapsedTime() {
		this.getDelta()
		return this.elapsedTime
	}
}
