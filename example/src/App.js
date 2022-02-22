import React, { useState } from 'react'
import ReactDotGlobe from 'react-dot-globe'
import * as cities from './places/cities'

const RenderItems = ({ items, title, onClear }) => (
  <>
    <div className='item'>
      <span className='heading'>Active {title}:</span>
      <span>{items.length}</span>
    </div>

    <ul className='list'>
      {items.map((item) => (
        <li className='item' key={item.name}>
          <b>{item.name}</b>
          <b className='clickable' onClick={() => onClear(item.name)}>
            x
          </b>
        </li>
      ))}
    </ul>
  </>
)

export const App = () => {
  const [markerPick, setMarkerPick] = useState('')
  const [curvePick, setCurvePick] = useState({ from: '', to: '' })

  const [markers, setMarkers] = useState([])
  const [mounted, setMounted] = useState(true)

  const [curves, setCurves] = useState([])
  const [speed, setSpeed] = useState(0)

  const addMarker = () => {
    setMarkers([
      ...markers,
      {
        name: markerPick,
        coordinates: cities[markerPick],
        color: '#e74c3c',
        height: 0.5,
        diameter: 0.1
      }
    ])
    setMarkerPick('')
  }

  const addCurve = () => {
    setCurves([
      ...curves,
      {
        point1: cities[curvePick.to],
        point2: cities[curvePick.from],
        name: `From ${curvePick.from} to ${curvePick.to}`,
        color: '#f39c12',
        segments: 30,
        animationSpeed: 1000,
        clearAnimation: 'forward' // backward
      }
    ])
    setCurvePick({ from: '', to: '' })
  }

  const removeCurve = (name) =>
    setCurves(curves.filter((item) => item.name !== name))

  const removeMarker = (name) =>
    setMarkers(markers.filter((item) => item.name !== name))

  const renderControls = () => (
    <>
      <label className='mb15'>Add city marker:</label>
      <select
        className='mb5'
        value={markerPick}
        onChange={(e) => setMarkerPick(e.target.value)}
      >
        <option value='' disabled>
          Select
        </option>
        {Object.keys(cities)
          .sort()
          .map((item) => (
            <option key={item}>{item}</option>
          ))}
      </select>
      <button className='random' onClick={addMarker}>
        Add marker
      </button>
      <div className='divider' />
      <label className='mb15'>Add curve:</label>
      <div className='mb5' style={{ display: 'flex', flexDirection: 'row' }}>
        <select
          id={'curveFrom'}
          value={curvePick.from}
          onChange={(e) => setCurvePick({ ...curvePick, from: e.target.value })}
        >
          <option value='' disabled>
            From
          </option>
          {Object.keys(cities)
            .sort()
            .map((item) => (
              <option key={item}>{item}</option>
            ))}
        </select>
        <div style={{ margin: '5px' }} />
        <select
          id={'curveTo'}
          value={curvePick.to}
          onChange={(e) => setCurvePick({ ...curvePick, to: e.target.value })}
        >
          <option value='' disabled>
            To
          </option>
          {Object.keys(cities)
            .sort()
            .map((item) => (
              <option key={item}>{item}</option>
            ))}
        </select>
      </div>
      <button className='random' onClick={addCurve}>
        Add curve
      </button>
    </>
  )

  return (
    <main>
      <section className='content'>
        {mounted ? (
          <ReactDotGlobe
            dotColor={'#ecf0f1'}
            backgroundColor={'#2c3e50'}
            globeRotationAxis={[0, 1, 0]}
            markers={markers}
            curves={curves}
            globeRotationSpeed={speed / (60 * 60)}
          />
        ) : null}
      </section>
      <section className='sidebar'>
        <h1 className='title'>React .globe</h1>
        <p className='info'>
          Highly customizable Dot Globe component for React. Inspired by
          GitHub's globe, uses Babylon.js under the hood.
        </p>
        <div className='divider ' />
        {renderControls()}
        <div className='divider' />
        <RenderItems
          items={markers}
          title='markers'
          onClear={(item) => removeMarker(item)}
        />
        <div className='divider line' />
        <RenderItems
          items={curves}
          title='curves'
          onClear={(item) => removeCurve(item)}
        />
        <div className='divider line' />
        <div className='item'>
          <span>Rotation speed:</span>
          <div>
            <span
              className='clickable box'
              onClick={() => setSpeed(speed + 10)}
            >
              +
            </span>
            <span className='ml15'>{speed}</span>
            <span
              className='clickable box ml15'
              onClick={() => setSpeed(speed - 10)}
            >
              -
            </span>
          </div>
        </div>
        <div className='divider' />
        <button className='random' onClick={() => setMounted(!mounted)}>
          {mounted ? 'Unmount' : 'Mount'}
        </button>

        <p className='credits'>
          2021 - Crafted by{' '}
          <a href='https://github.com/ahuseyn/' target='_blank'>
            ahuseyn
          </a>{' '}
          - MIT license
        </p>
      </section>
    </main>
  )
}

export default App
