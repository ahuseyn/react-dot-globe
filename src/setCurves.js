import {
  Color3,
  Curve3,
  MeshBuilder,
  Vector3,
  VertexBuffer
} from '@babylonjs/core'
import { compareArray, controlPoints, polarToCartesian } from './helpers'

export default function setCurves(
  scene,
  globe,
  radius,
  curves = [],
  prevCurves = []
) {
  const removed = compareArray(prevCurves, curves, 'name')
  const added = compareArray(curves, prevCurves, 'name')
  const updated = curveUpdateCheck(curves, prevCurves, 'color')

  if (added.length > 0) {
    init(scene, globe, radius, added)
  }
  if (removed.length > 0) {
    clear(scene, removed)
  }
  if (updated.length > 0) {
    update(scene, updated)
  }
}

// Check if curve updated
const curveUpdateCheck = (curr, prev, key) =>
  curr.filter((x) => prev.some((y) => y.name === x.name && y[key] !== x[key]))

// Update curves
function update(scene, curves) {
  for (let x = 0; x < curves.length; x++) {
    scene.getMeshByName(curves[x].name).color = new Color3.FromHexString(
      curves[x].color
    )
  }
}

// Init curves
function init(scene, globe, radius, curves) {
  const meshes = globe.getChildren()

  for (let x = 0; x < curves.length; x++) {
    const target1 = polarToCartesian(
      curves[x].point1[0],
      curves[x].point1[1],
      radius
    )

    const target2 = polarToCartesian(
      curves[x].point2[0],
      curves[x].point2[1],
      radius
    )

    const cPoint1 = meshes.reduce((prev, next) => {
      if (prev.position && next.position) {
        return Vector3.Distance(target1, next.position) <=
          Vector3.Distance(target1, prev.position)
          ? next
          : prev
      }
    })

    const cPoint2 = meshes.reduce((prev, next) => {
      if (prev.position && next.position) {
        return Vector3.Distance(target2, next.position) <=
          Vector3.Distance(target2, prev.position)
          ? next
          : prev
      }
    })

    build(
      cPoint1.position,
      cPoint2.position,
      5,
      { name: curves[x].name, type: curves[x].type, color: curves[x].color },
      scene,
      curves[x].segments,
      curves[x].animationSpeed
    )
  }
}

// Clear curves
function clear(scene, curves) {
  for (let x = 0; x < curves.length; x++) {
    const curve = scene.getMeshByName(curves[x].name)
    const pointsRaw = curve.getVerticesData(VertexBuffer.PositionKind)
    const points = []

    for (let x = 0; x < pointsRaw.length / 3; x++) {
      points.push(Vector3.FromArray(pointsRaw, x * 3))
    }

    animate(
      points,
      curve,
      curves[x].name,
      curves[x].animationSpeed,
      curves[x].segments,
      curves[x].clearAnimation
    )
  }
}

// Builds single curve
function build(v2, v1, rad, options, scene, segments, animationSpeed) {
  const controls = controlPoints(v1, v2, rad, scene)
  const points = Curve3.CreateCubicBezier(
    v1,
    controls[0],
    controls[1],
    v2,
    segments
  ).getPoints()

  const curve = MeshBuilder.CreateLines(options.name, {
    points: Array.from({ length: points.length }, () => points[0]),
    updatable: true
  })

  curve.doNotSyncBoundingInfo = true
  curve.freezeWorldMatrix()

  animate(points, curve, options.name, animationSpeed, segments, 'init')

  curve.color = new Color3.FromHexString(options.color)
}

// Animates single curve
function animate(points, curve, name, speed, segments, type) {
  const length = points.length

  for (let i = 1; i < points.length; i++) {
    setTimeout(() => {
      curve = MeshBuilder.CreateLines(name, {
        points: animationSteps(points, type, length, i),
        instance: curve
      })

      if (type !== 'init' && i === length - 1) {
        return curve.dispose()
      }
    }, (speed / segments) * i)
  }
}

// Animation types
function animationSteps(points, type, len, i) {
  switch (type) {
    case 'init':
      return points
        .slice(0, i)
        .concat(Array.from({ length: len - i }, () => points[i]))
    case 'backward':
      return points
        .slice(0, -i)
        .concat(Array.from({ length: len + i }, () => points[len - 1 - i]))
    case 'forward':
      return points.slice(-(len - i), len)
  }
}
