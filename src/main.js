import Sketch from './modules/sketch'
import { createGui } from './modules/gui'

let isIframe = (() => {
	try {
		return window.self !== window.top
	} catch (e) {
		return true
	}
})()

let canvas = document.getElementById('scene')
let sketch = new Sketch({ canvas })

if (isIframe) {
	document.body.classList.add('is-iframe')

	sketch.draw()

	let trusted = [
		'http://localhost:8080',
		'https://nextgtrgod.github.io',
	]

	window.addEventListener('message', e => {
		if (!trusted.includes(e.origin)) return
		
		switch (e.data) {
			case 'start':
				sketch.start()
				break;
			case 'stop':
				sketch.stop()
				break;
		}
	})
} else {
	sketch.start()

	let gui = createGui()

	gui.on('change', ({ last }) => {
		if (last) sketch.restart()
	})
}
