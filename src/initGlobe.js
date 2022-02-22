import {
  Color3,
  MeshBuilder,
  Space,
  StandardMaterial,
  Texture,
  Vector3
} from '@babylonjs/core'

export default function initGlobe(
  globe,
  radius,
  texture,
  pointDiameter,
  pointHeight,
  pointSegments,
  pointColor
) {
  return new Promise((resolve, reject) => {
    const center = globe.getAbsolutePosition()
    const radian = Math.PI / 180
    const pointRenderTreshold = 50

    // Material of points
    const material = new StandardMaterial('PointsMaterial')
    material.emissiveColor = Color3.White()
    material.freeze()

    // Source mesh
    const mesh = MeshBuilder.CreateCylinder('BasePoint', {
      diameter: pointDiameter,
      height: pointHeight,
      tessellation: pointSegments
    })
    mesh.material = new StandardMaterial('PointsMaterial')
    mesh.material.emissiveColor = Color3.White()
    mesh.position.y = -radius
    mesh.registerInstancedBuffer('color', 3)
    mesh.instancedBuffers.color = new Color3.FromHexString(pointColor)

    // Optional optiomization tools
    mesh.doNotSyncBoundingInfo = true
    mesh.convertToUnIndexedMesh()
    mesh.freezeWorldMatrix()
    mesh.setEnabled(false)

    // Load map texture
    const pointsTexture = new Texture(texture)

    // Render point instances
    Texture.WhenAllReady([pointsTexture], function () {
      pointsTexture.readPixels().then((pixels) => {
        for (let i = 0; i < pixels.length; i++) {
          if (Number.isInteger(i / 4) && pixels[i] > pointRenderTreshold) {
            const x = ((i / 4) * 2.25 - 270) * radian
            const y = ((i / -640) * 2.25 - 90) * radian
            const point = mesh.createInstance('p' + i / 4)
            point.parent = globe
            point.position = new Vector3(
              Math.cos(y) * Math.cos(x) * radius,
              Math.sin(y) * radius,
              Math.cos(y) * Math.sin(x) * radius
            )
            point.lookAt(center)
            point.setPivotPoint(new Vector3(0, pointHeight / 2, 0))
            point.rotate(new Vector3(1, 0, 0), Math.PI / 2, Space.LOCAL)
            // point.freezeWorldMatrix()
          }
        }

        resolve()
      })
    })
  })
}
