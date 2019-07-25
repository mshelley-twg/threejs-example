import * as THREE from 'three'

const KEYS = {
  W: 'KeyW',
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD'
}

const CAMERA_DISTANCE_TO_PLAYER = 5
const PLAYER_SPEED = 4

const createRenderer = ({ clearColor = 0x000000 }) => {
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(clearColor)

  document.body.appendChild(renderer.domElement)

  return renderer
}

const createCamera = () => {
  return new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
}

const createCube = (width, height, depth, materialProps) => {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshPhongMaterial(materialProps)

  return new THREE.Mesh(geometry, material)
}

const createLight = (x, y, z, color, intensity) => {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(x, y, z)

  return light
}

class Game {
  constructor () {
    this.renderer = createRenderer({ clearColor: 0x336699 })
    this.scene = new THREE.Scene()
    this.camera = createCamera()
    this.player = createCube(1, 1, 1, { color: 0x888888 })
    this.grid = new THREE.GridHelper(10, 10)
    this.light = createLight(4, 4, 4, 0xFFFFFF, 1)
    this.lastFrameTime = null
    this.keys = {}

    this.loop = this.loop.bind(this)
  }

  start () {
    this.setupEventListeners()
    this.createScene()
    this.loop()
  }

  setupEventListeners () {
    document.addEventListener('keydown', event => {
      this.keys[event.code] = true
    })
    document.addEventListener('keyup', event => {
      this.keys[event.code] = false
    })
  }

  isKeyPressed (key) {
    return this.keys[key] || false
  }

  createScene () {
    this.scene.add(this.grid)
    this.scene.add(this.player)
    this.scene.add(this.light)

    // Camera
    this.camera.position.set(0, 5, 5)
    this.camera.lookAt(0, 0, 0)
  }

  loop (time) {
    // Find how much time has passed since the last frame in seconds
    if (!this.lastFrameTime) {
      this.lastFrameTime = time
    }

    // Convert from ms to s
    const elapsedTime = (time - this.lastFrameTime) / 1000
    this.lastFrameTime = time

    this.update(elapsedTime)
    this.render()

    window.requestAnimationFrame(this.loop)
  }

  update (elapsedTime) {
    // Find the player position on the ground relative to the camera
    // We remove Y so we only move along the grid
    const forwardVector = this.player.position.clone().sub(this.camera.position).setY(0).normalize()
    const rightVector = new THREE.Vector3(forwardVector.z, 0, -forwardVector.x)

    if (this.isKeyPressed(KEYS.W)) {
      this.player.position.add(forwardVector.multiplyScalar(PLAYER_SPEED * elapsedTime))
    }
    if (this.isKeyPressed(KEYS.S)) {
      this.player.position.sub(forwardVector.multiplyScalar(PLAYER_SPEED * elapsedTime))
    }
    if (this.isKeyPressed(KEYS.A)) {
      this.player.position.add(rightVector.multiplyScalar(PLAYER_SPEED * elapsedTime))
    }
    if (this.isKeyPressed(KEYS.D)) {
      this.player.position.sub(rightVector.multiplyScalar(PLAYER_SPEED * elapsedTime))
    }

    // Move the camera to follow the player from a fixed length
    this.camera.lookAt(this.player.position)
    const playerToCameraVector = this.camera.position.clone().sub(this.player.position).setLength(CAMERA_DISTANCE_TO_PLAYER)
    this.camera.position.copy(this.player.position.clone().add(playerToCameraVector))
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}

const game = new Game()
game.start()
