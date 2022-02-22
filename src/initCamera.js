import { ArcRotateCamera, Vector3 } from '@babylonjs/core'
export default function initCamera(
  scene,
  position,
  minZoom,
  maxZoom,
  zoomSpeed
) {
  const camera = new ArcRotateCamera('Camera', 0, 0, 5, Vector3.Zero(), scene)
  camera.setTarget(Vector3.Zero())

  const canvas = scene.getEngine().getRenderingCanvas()
  camera.attachControl(canvas, true)
  camera.setPosition(new Vector3(...position))
  camera.lowerRadiusLimit = minZoom
  camera.upperRadiusLimit = maxZoom
  camera.wheelPrecision = zoomSpeed
}
