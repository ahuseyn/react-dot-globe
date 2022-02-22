import { Color3, Tags, Vector3 } from '@babylonjs/core'
import { polarToCartesian } from './helpers'

export default function setMarkers(
  scene,
  globe,
  radius,
  markers,
  diameter,
  height,
  color
) {
  const meshes = globe.getChildren()
  const oldMarkers = scene.getMeshesByTags('marked')

  oldMarkers.forEach((item) => {
    item.instancedBuffers.color = new Color3.FromHexString(color)
    item.scaling = new Vector3(1, 1, 1)
    item.freezeWorldMatrix()
    Tags.RemoveTagsFrom(item, 'marked')
  })

  for (let x = 0; x < markers.length; x++) {
    const marker = markers[x]
    const target = polarToCartesian(
      marker.coordinates[0],
      marker.coordinates[1],
      radius
    )

    const cPoint = meshes.reduce((prev, next) => {
      if (prev.position && next.position) {
        return Vector3.Distance(target, next.position) <=
          Vector3.Distance(target, prev.position)
          ? next
          : prev
      }
    })

    if (cPoint) {
      cPoint.unfreezeWorldMatrix()
      cPoint.name = marker.name
      cPoint.instancedBuffers.color = new Color3.FromHexString(marker.color)
      cPoint.scaling.x = marker.diameter / diameter
      cPoint.scaling.y = marker.height / height
      cPoint.scaling.z = marker.diameter / diameter

      Tags.AddTagsTo(cPoint, 'marked')
    }
  }
}
