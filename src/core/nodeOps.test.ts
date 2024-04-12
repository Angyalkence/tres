import { beforeAll, describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { Mesh, Scene } from 'three'
import type { TresObject } from '../types'
import { nodeOps as getNodeOps } from './nodeOps'
import { extend } from './catalogue'

let nodeOps = getNodeOps()

describe('nodeOps', () => {
  beforeAll(() => {
    // Setup
    extend(THREE)
    nodeOps = getNodeOps()
  })
  describe('createElement', () => {
    it('creates an instance with given tag', async () => {
    // Setup
      const tag = 'TresMesh'
      const props = { args: [] }

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.isObject3D).toBeTruthy()
      expect(instance).toBeInstanceOf(Mesh)
    })

    it('creates an instance with given tag and props', async () => {
    // Setup
      const tag = 'TresTorusGeometry'
      const props = { args: [10, 3, 16, 100] }

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.parameters.radius).toBe(10)
      expect(instance?.parameters.tube).toBe(3)
      expect(instance?.parameters.radialSegments).toBe(16)
      expect(instance?.parameters.tubularSegments).toBe(100)
    })

    it.skip('creates an camera instance', async () => {
    // Setup
      const tag = 'TresPerspectiveCamera'
      const props = { args: [75, 2, 0.1, 5] }

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.isCamera).toBeTruthy()
      expect(instance).toBeInstanceOf(THREE.PerspectiveCamera)
    })

    it.skip('logs a warning if the camera doesnt have a position', async () => {
    // Setup
      const tag = 'TresPerspectiveCamera'
      const props = { args: [75, 2, 0.1, 5] }

      // Spy
      const consoleWarnSpy = vi.spyOn(console, 'warn')
      consoleWarnSpy.mockImplementation(() => { })

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.isCamera).toBeTruthy()
      expect(instance).toBeInstanceOf(THREE.PerspectiveCamera)
      expect(consoleWarnSpy).toHaveBeenCalled()
    })

    it('adds material with "attach" property if instance is a material', () => {
    // Setup
      const tag = 'TresMeshStandardMaterial'
      const props = { args: [] }

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.isMaterial).toBeTruthy()
      expect(instance?.attach).toBe('material')
    })

    it('adds attach geometry property if instance is a geometry', () => {
    // Setup
      const tag = 'TresTorusGeometry'
      const props = { args: [] }

      // Test
      const instance = nodeOps.createElement(tag, undefined, undefined, props)

      // Assert
      expect(instance?.isBufferGeometry).toBeTruthy()
      expect(instance?.attach).toBe('geometry')
    })
  })

  describe('insert', () => {
    it('inserts child into parent', async () => {
    // Setup
      const parent = new Scene()
      parent.__tres = {
        root: {
          registerCamera: () => { },
          registerObjectAtPointerEventHandler: () => { },
        },
      }
      const child = new Mesh()

      child.__tres = {
        root: null,
      }

      // Fake vnodes
      child.__vnode = {
        type: 'TresMesh',
      }

      // Test
      nodeOps.insert(child, parent, null)

      // Assert
      expect(parent.children.includes(child)).toBeTruthy()
    })
  })

  describe('remove', () => {
    it.skip('removes child from parent', async () => {
    // Setup
      const parent = new Scene() as unknown as TresObject
      const child = new Mesh() as unknown as TresObject

      // Fake vnodes
      child.__vnode = {
        type: 'TresMesh',
      }
      nodeOps.insert(child, parent)

      // Test
      nodeOps.remove(child)

      // Assert
      expect(!parent.children.includes(child)).toBeTruthy()
    })
  })

  describe('patchProp', () => {
    it('patches property of node', async () => {
    // Setup
      const node = nodeOps.createElement('Mesh')!
      const prop = 'visible'
      const nextValue = false

      // Test
      nodeOps.patchProp(node, prop, null, nextValue)

      // Assert
      expect(node.visible === nextValue)
    })

    it('patches/traverses pierced props', async () => {
    // Setup
      const node = nodeOps.createElement('Mesh')!
      const prop = 'position-x'
      const nextValue = 5

      // Test
      nodeOps.patchProp(node, prop, null, nextValue)

      // Assert
      expect(node.position.x === nextValue)
    })

    it('does not patch/traverse pierced props of existing dashed properties', async () => {
    // Setup
      const node = nodeOps.createElement('Mesh')!
      const prop = 'cast-shadow'
      const nextValue = true

      // Test
      nodeOps.patchProp(node, prop, null, nextValue)

      // Assert
      expect(node.castShadow === nextValue)
    })

    it('preserves ALL_CAPS_CASE in pierced props', () => {
    // Issue: https://github.com/Tresjs/tres/issues/605
      const { createElement, patchProp } = nodeOps
      const node = createElement('TresMeshStandardMaterial', undefined, undefined, {})!
      const allCapsKey = 'STANDARD'
      const allCapsUnderscoresKey = 'USE_UVS'
      const allCapsValue = 'hello'
      const allCapsUnderscoresValue = 'goodbye'

      patchProp(node, `defines-${allCapsKey}`, null, allCapsValue)
      patchProp(node, `defines-${allCapsUnderscoresKey}`, null, allCapsUnderscoresValue)

      expect(node.defines[allCapsKey]).equals(allCapsValue)
      expect(node.defines[allCapsUnderscoresKey]).equals(allCapsUnderscoresValue)
    })
  })

  describe('parentNode', () => {
    it('returns parent of a node', async () => {
    // Setup
      const parent: TresObject = new Scene()
      const child: TresObject = nodeOps.createElement('Mesh')!
      parent.children.push(child)
      child.parent = parent

      // Test
      const parentNode = nodeOps.parentNode(child)

      // Assert
      expect(parentNode === parent)
    })
  })
})
