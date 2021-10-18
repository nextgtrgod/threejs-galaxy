import { Pane } from 'tweakpane'
import parameters from './parameters'

let createGui = () => {
	let gui = new Pane()
	let folder = gui.addFolder({ title: 'Parameters' })
	
	folder.addInput(parameters, 'count', { min: 1000, max: 1000000, step: 100 })
	folder.addInput(parameters, 'size', { min: 0.001, max: 0.1, step: 0.001 })
	folder.addInput(parameters, 'radius', { min: 0.01, max: 20, step: 0.01 })
	folder.addInput(parameters, 'branches', { min: 2, max: 20, step: 1 })
	folder.addInput(parameters, 'spin', { min: -5, max: 5, step: 0.001 })
	folder.addInput(parameters, 'randomness', { min: 0, max: 2, step: 0.001, label: 'random' })
	folder.addInput(parameters, 'randomnessPower', { min: 1, max: 10, step: 0.001, label: 'rndPower' })
	folder.addSeparator()
	folder.addInput(parameters, 'innerColor', { label: 'inner' })
	folder.addInput(parameters, 'outerColor', { label: 'outer' })

	return gui
}

export { createGui }
