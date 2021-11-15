import GUI from 'lil-gui'
import parameters from './parameters'

let createGui = ({ onFinishChange } = {}) => {
	let gui = new GUI()

	gui.add(parameters, 'count').min(1000).max(1000000).step(100)
	gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001)
	gui.add(parameters, 'radius').min(0.01).max(20).step(0.01)
	gui.add(parameters, 'branches').min(2).max(20).step(1)
	gui.add(parameters, 'spin').min(-5).max(5).step(0.001)
	gui.add(parameters, 'randomness').min(0).max(2).step(0.001)
	gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001)
	gui.addColor(parameters, 'innerColor')
	gui.addColor(parameters, 'outerColor')

	if (onFinishChange) {
		gui.controllers.forEach(controller => {
			controller.onFinishChange(onFinishChange)
		})
	}

	return gui
}

export { createGui }
