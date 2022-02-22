import { Vector3 } from '@babylonjs/core'

export function controlPoints(p1, p2) {
  const np1 = Vector3.Zero()
  const np2 = Vector3.Zero()

  Vector3.SlerpToRef(p1, p2, 0.3, np1)
  Vector3.SlerpToRef(p1, p2, 0.7, np2)

  np1.scaleInPlace(harvesine(p1, p2))
  np2.scaleInPlace(harvesine(p1, p2))

  return [np1, np2]
}

export const polarToCartesian = (lat, lon, rad) => {
  const dlat = (lat * Math.PI) / 180
  const dlon = (lon * Math.PI) / -180
  const x = Math.cos(dlat) * Math.sin(dlon) * rad
  const y = Math.sin(dlat) * rad
  const z = Math.cos(dlat) * Math.cos(dlon) * rad

  return new Vector3(x, y, z)
}

export const compareArray = (prev, curr, key) =>
  prev.filter((x) => !curr.some((y) => y[key] === x[key]))

// Source: https://answers.unity.com/questions/272194/calcualte-the-arc-distance-between-2-points-on-a-s.html
const harvesine = (v1, v2) =>
  Math.acos(Vector3.Dot(v1.normalizeToNew(), v2.normalizeToNew())) / 2.2 + 1
