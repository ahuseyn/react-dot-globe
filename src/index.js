import {
  Color3,
  Engine,
  Scene,
  Space,
  TransformNode,
  Vector3
} from '@babylonjs/core'
import React from 'react'
import mapTexture from './assets/map.png'
import initCamera from './initCamera'
import initGlobe from './initGlobe'
import setCurves from './setCurves'
import setMarkers from './setMarkers'

export default class ReactDotGlobe extends React.PureComponent {
  constructor(props) {
    super(props)

    this.radius = 5
    this.canvas = React.createRef()
  }

  componentDidMount() {
    if (this.canvas.current) {
      this.engine = new Engine(this.canvas.current)
      this.scene = new Scene(this.engine)
      this.scene.clearColor = new Color3.FromHexString(
        this.props.backgroundColor
      )
      this.scene.blockMaterialDirtyMechanism = true
      this.scene.autoClearDepthAndStencil = false
      this.scene.freeActiveMeshes()
      this.scene.onPointerUp = this.props.onClick

      this.globe = new TransformNode('Globe', this.scene)

      // Initialize camera and globe
      if (this.scene.isReady()) {
        initCamera(
          this.scene,
          this.props.cameraPosition,
          this.props.cameraMinZoom,
          this.props.cameraMaxZoom,
          this.props.cameraZoomSpeed
        )

        initGlobe(
          this.globe,
          this.radius,
          this.props.globeTexture,
          this.props.dotDiameter,
          this.props.dotHeight,
          this.props.dotSegments,
          this.props.dotColor
        ).then(() => {
          if (this.props.markers.length > 0) {
            setMarkers(
              this.scene,
              this.globe,
              this.radius,
              this.props.markers,
              this.props.dotDiameter,
              this.props.dotHeight,
              this.props.dotColor
            )
          }
          if (this.props.curves.length > 0) {
            setCurves(this.scene, this.globe, this.radius, this.props.curves)
          }
        })
      } else {
        this.scene.onReadyObservable.addOnce((scene) => {
          initCamera(
            scene,
            this.props.cameraPosition,
            this.props.cameraMinZoom,
            this.props.cameraMaxZoom,
            this.props.zoomSpeed
          )
          initGlobe(
            this.globe,
            this.radius,
            this.props.globeTexture,
            this.props.dotDiameter,
            this.props.dotHeight,
            this.props.dotSegments,
            this.props.dotColor
          )
        })
      }

      // Run engine
      this.engine.runRenderLoop(() => {
        this.globe.rotate(
          new Vector3(...this.props.globeRotationAxis),
          this.props.globeRotationSpeed,
          Space.LOCAL
        )

        this.scene.render()
      })

      // Resize scene on window resize
      this.resize = () => this.scene.getEngine().resize()

      if (window) {
        window.addEventListener('resize', this.resize)
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.markers !== this.props.markers) {
      setMarkers(
        this.scene,
        this.globe,
        this.radius,
        this.props.markers,
        this.props.dotDiameter,
        this.props.dotHeight,
        this.props.dotColor
      )
    }
    if (prevProps.curves !== this.props.curves) {
      setCurves(
        this.scene,
        this.globe,
        this.radius,
        this.props.curves,
        prevProps.curves
      )
    }
  }

  componentWillUnmount() {
    this.scene.getEngine().dispose()

    if (window) {
      window.removeEventListener('resize', this.resize)
    }
  }

  render() {
    return <canvas ref={this.canvas} className={this.props.className} />
  }
}

ReactDotGlobe.defaultProps = {
  className: 'dotGlobe',
  backgroundColor: '#040d50',
  cameraPosition: [-6, 10, -10],
  cameraMinZoom: 10,
  cameraMaxZoom: 500,
  cameraZoomSpeed: 100,
  globeTexture: require(`./${mapTexture}`),
  globeRotationAxis: [0, 1, 0],
  globeRotationSpeed: 0,
  dotDiameter: 0.05,
  dotHeight: 0.01,
  dotSegments: 8,
  dotColor: '#f59c1a',
  markers: [],
  curves: [],
  onClick: () => {}
}
