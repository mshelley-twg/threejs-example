import * as THREE from 'three'

const createCamera = () => {
  return new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
}

const createRenderer = ({ clearColor = 0x000000 }) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(clearColor)

  document.body.appendChild(renderer.domElement)

  return renderer
}

const createCube = (width, height, depth, meshProps) => {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshBasicMaterial(meshProps)

  return new THREE.Mesh(geometry, material)
}

class Game {
  constructor () {
    this.renderer = createRenderer({ clearColor: 0x336699 })
    this.scene = new THREE.Scene()
    this.camera = createCamera()
    this.cube = createCube(1, 1, 1, { color: 0x888888 })

    this.loop = this.loop.bind(this)
  }

  start () {
    this.createScene()
    this.loop()
  }

  createScene () {
    this.scene.add(this.cube)
    this.camera.position.z = 5
  }

  loop () {
    window.requestAnimationFrame(this.loop)

    this.update()
    this.render()
  }

  update () {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}

const game = new Game()
game.start()
