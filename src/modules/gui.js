import GUI from 'lil-gui'
import parameters from './parameters'

let createGui = ({ onFinishChange } = {}) => {
	let gui = new GUI()

	gui.add(parameters, 'count').min(30000).max(300000).step(1e2).name('count (!)')
	gui.add(parameters, 'radius').min(2).max(8).step(0.01)
	gui.add(parameters, 'branches').min(2).max(10).step(1)
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
