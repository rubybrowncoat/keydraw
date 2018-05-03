<template>
  <div class="wrapper" :class="currentTheme">
    <div class="content">
      <information />

      <div class="keycler">
        <div class="activity menuItem">
          <span class="txtLabel">SPACEBAR</span>
          {{ currentActivity }}
        </div>
        <div class="assets">
          <div
            :class="[
              'asset',
              'menuItem',
              {
                costly: asset.cost.gt(funds),
                hidden: asset.cost.gt(funds.times(1.5)) && !assets[key],
              },
            ]"
            v-for="(asset, key) in availableAssets"
            :key="key">
            <span class="txtLabel">{{ asset.key }}</span>
            {{ asset.name }}
            <span class="txtLabel">€{{ asset.cost.toString() }}</span>
            <span class="quantity">{{ assets[key] || 0 }}</span>
          </div>
        </div>
        <div class="upgrades">
          <div
            :class="[
              'upgrade',
              'menuItem',
              {
                costly: upgrade.cost.gt(funds),
                hidden:
                  upgrade.cost.gt(funds.times(1.5))
                  || (assets[upgrade.entity] || 0) < (upgrade.count || 0),
              },
            ]"
            v-for="(upgrade, key) in availableUpgrades"
            :key="key">
            <span class="txtLabel">SHIFT + {{ availableAssets[upgrade.entity].key }}</span>
            {{ upgrade.name }}
            <span class="txtLabel">€{{ upgrade.cost.toString() }}</span>
            <span class="description">
              {{ upgrade.description }}
            </span>
          </div>
        </div>
      </div>

      <action-bar kind="generic" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keycler {
  position: relative;

  width: calc(100vw - 100px);
  padding: 84px 0 94px;

  left: 50%;

  transform: translateX(-50%);

  text-transform: uppercase;
  font-size: 22px;

  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.activity {
  display: block;
}

.assets,
.upgrades {
  width: 50%;

  .txtLabel {
    min-width: auto;
  }
}

.assets {
  float: left;

  padding: 20px 10px 0 0;
}

.upgrades {
  float: right;

  padding: 20px 0 0 10px;
}

.asset,
.upgrade {
  display: block;

  margin-bottom: 5px;
  margin-left: 0;

  &.costly {
    opacity: 0.5;
  }

  &.hidden {
    display: none;
  }
}

.asset {
  .quantity {
    float: right;
  }
}

.upgrade {
  height: auto;

  .description {
    display: block;
    font-size: 14px;
    white-space: normal;
  }
}
</style>

<script>
import { mapActions, mapGetters } from 'vuex'

import { findKey as _findKey, isNumber as _isNumber, sampleSize as _sampleSize } from 'lodash-es'

import ActionBar from '~/components/ActionBar'
import Information from '~/components/Keycler/Information'

// TEST
import Decimal from 'decimal.js'
import tileSetImage from '~/tiles/apesmiths/tiles_classic.png'
// import tileSetImage from '~/tiles/apesmiths/tiles_smallest.png'
// import tileSetImage from '~/tiles/apesmiths/tiles_small.png'
// import tileSetImage from '~/tiles/apesmiths/tiles.png'

function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      storage.length !== 0
    )
  }
}
// TEST

import UidGenerator from '~/libs/uid'
const tileUids = UidGenerator('tile-')

import {
  each as _each,
  map as _map,
  isString as _isString,
  isArray as _isArray,
  intersection as _intersection,
  random as _random,
  uniq as _uniq,
  defer as _defer,
  after as _after,
  reject as _reject,
  isEmpty as _isEmpty,
} from 'lodash-es'
// ENDTEST

let loopActive = false
let loopBreak = false

export default {
  transition: 'slide-left',
  components: {
    ActionBar,
    Information,
  },
  data: () => ({
    fps: 1,
  }),
  computed: {
    ...mapGetters('theme', ['currentTheme']),

    ...mapGetters('keycler', [
      'funds',

      'currentActivity',

      'assets',

      'availableAssets',
      'availableUpgrades',
    ]),

    ...mapGetters('keytsh', ['keytshCollapsed']),
  },
  methods: {
    ...mapActions('keycler', ['operationalActivity', 'collectFups', 'buyAsset', 'buyUpgrade']),
    ...mapActions('keytsh', ['toggleKeytshCollapse']),

    keyOperation(evt) {
      if (this.keytshCollapsed) {
        evt.preventDefault()

        switch (evt.key) {
          case 'Backspace': {
            // BACKSPACE
            this.$router.push('/')
            break
          }
          case ' ': {
            // SPACE
            this.operationalActivity()
            break
          }
          default: {
            if (evt.shiftKey || evt.ctrlKey) {
              const assetUid = _findKey(this.availableAssets, ['key', evt.key.toLowerCase()])

              if (assetUid) {
                const upgradeUid = _findKey(this.availableUpgrades, ['entity', assetUid])

                if (upgradeUid) {
                  const upgrade = this.availableUpgrades[upgradeUid]

                  if (upgrade.cost.lte(this.funds)) {
                    this.buyUpgrade(upgradeUid)
                  }
                }
              }
            } else {
              const assetUid = _findKey(this.availableAssets, ['key', evt.key])

              if (assetUid) {
                const asset = this.availableAssets[assetUid]

                if (asset.cost.lte(this.funds)) {
                  this.buyAsset(assetUid)
                }
              }
            }
          }
        }
      }

      switch (evt.key) {
        case '!': {
          this.toggleKeytshCollapse()
          break
        }
      }
    },

    keyNeutralization(evt) {
      if (this.keytshCollapsed) {
        switch (evt.key) {
          case ' ': {
            // SPACE
            evt.preventDefault()
            break
          }
        }
      }
    },

    gameLogic() {
      this.collectFups()
    },

    gameLoop() {
      const interval = 1000 / this.fps

      let then = Date.now()

      const loop = time => {
        if (loopBreak) {
          loopBreak = false

          return
        }

        requestAnimationFrame(loop)

        const now = Date.now()
        const delta = now - then

        if (delta > interval) {
          then = now - delta % interval

          this.gameLogic()
        }
      }

      loopActive = true
      loop()
    },
  },
  beforeMount() {
    window.addEventListener('keyup', this.keyOperation)
    window.addEventListener('keydown', this.keyNeutralization)

    // Testing for magics
    const Matriciotta = (window.Matriciotta = require('../libs/matrix').default)
    const Mapperotta = (window.Mapperotta = require('../libs/map').default)
    const Tilesettolo = (window.Tilesettolo = require('../libs/tileset').default)
    const Distribuzia = (window.Distribuzia = require('../libs/distribution').default)
    const Distribolla = (window.Distribolla = require('../libs/distributionSphere').default)

    const img = new Image()
    img.onload = evt => {
      const tileSize = 3

      const img = evt.target
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = img.width
      canvas.height = img.height

      context.drawImage(img, 0, 0, img.width, img.height)

      document.body.appendChild(canvas)

      console.log(
        img.width,
        img.height,
        (img.width - 3) / 4 + 1,
        (img.height - 3) / 4 + 1,
        context.getImageData
      )

      let tiles = {}
      let orderedTiles = []

      let tileNumber = 0
      for (let widthIterator = 0; widthIterator < img.width / 4; widthIterator += 1) {
        for (let heightIterator = 0; heightIterator < img.height / 4; heightIterator += 1) {
          tileNumber += 1

          const tileContent = context.getImageData(
            widthIterator * 4,
            heightIterator * 4,
            tileSize,
            tileSize
          ).data

          const tilePixels = tileContent.reduce(
            (aggregator, value, index, array) =>
              !(index % 4) ? aggregator.concat([array.slice(index, index + 4)]) : aggregator,
            []
          )

          const tileMatrix = new Matriciotta(tilePixels, tileSize, tileSize)

          if (!tileMatrix.isUniform(new Uint8ClampedArray([255, 255, 255, 255]))) {
            // White Pixel
            const preventionPixel = context.getImageData(
              widthIterator * 4 + 1,
              heightIterator * 4 + 3,
              1,
              1
            ).data
            const prevented =
              preventionPixel.toString() === new Uint8ClampedArray([255, 0, 0, 255]).toString()

            if (!prevented) {
              const rotationPixel = context.getImageData(
                widthIterator * 4 + 3,
                heightIterator * 4,
                1,
                1
              ).data
              const includeRotations =
                rotationPixel.toString() === new Uint8ClampedArray([0, 0, 0, 255]).toString()

              const likelyhoodPixel = context.getImageData(
                widthIterator * 4,
                heightIterator * 4 + 3,
                1,
                1
              ).data
              const likelyhoodProbability = Math.pow(255 - likelyhoodPixel[0], 1)
              // const likelyhoodProbability = 1 - likelyhoodPixel[0] / 255

              const tile = {
                uid: tileUids.generate(),
                matrix: tileMatrix,
                likelyhood: likelyhoodProbability,
                rotated: false,
              }
              tiles[tile.uid] = tile
              orderedTiles.push(tile.uid)

              if (includeRotations) {
                for (var iterator = 1; iterator < 4; iterator += 1) {
                  const rotatedMatrix = tileMatrix.clockwise(iterator)

                  const tile = {
                    uid: tileUids.generate(),
                    matrix: rotatedMatrix,
                    likelyhood: likelyhoodProbability,
                    rotated: true,
                  }
                  tiles[tile.uid] = tile
                  orderedTiles.push(tile.uid)
                }
              }
            }
          }
        }
      }

      // // Make Tile Neighbors
      _each(tiles, (tile, key) => {
        const mapToString = edge => edge.toString()
        const tileEdges = tile.matrix.edges(mapToString)

        tile.neighbors = [[], [], [], []]

        _each(tiles, (subTile, subKey) => {
          const subTileEdges = subTile.matrix.edges(mapToString)

          if (tileEdges[0] === subTileEdges[2]) {
            tile.neighbors[0].push(subKey)
          }

          if (tileEdges[1] === subTileEdges[3]) {
            tile.neighbors[1].push(subKey)
          }

          if (tileEdges[2] === subTileEdges[0]) {
            tile.neighbors[2].push(subKey)
          }

          if (tileEdges[3] === subTileEdges[1]) {
            tile.neighbors[3].push(subKey)
          }
        })
      })
      console.log('donezo edges')

      const tileSet = new Tilesettolo(tiles, orderedTiles)
      // const map = new Mapperotta(112, 84, tileSet)
      const map = new Mapperotta(48, 32, tileSet)

      const localStorageAvailable = storageAvailable('localStorage')

      // // let oldSpheres = false
      // // if (localStorageAvailable) {
      // //   const fromStorage = window.localStorage.getItem('spheres')

      // //   oldSpheres = fromStorage ? JSON.parse(fromStorage) : false
      // // }

      // let tileSetDistributionSpheres
      // // if (!oldSpheres) {
      //   tileSetDistributionSpheres = map.tileSet.ordered.map((tileUid, index, ordered) => {
      //     const tile = map.tileSet.get(tileUid)

      //     console.log(`Sphere: ${index + 1} of ${ordered.length}...`)
      //     const distribolla = new Distribolla(5, 5, map.tileSet, tile)

      //     console.log(distribolla)
      //     stop()

      //     return distribolla
      //   })

      // //   if (localStorageAvailable) {
      // //     const exportedSpheres = tileSetDistributionSpheres.map(sphere => sphere.export())

      // //     window.localStorage.setItem('spheres', JSON.stringify(exportedSpheres))
      // //   }
      // // } else {
      // //   tileSetDistributionSpheres = oldSpheres.map(
      // //     exportedSphere => Distribolla.import(exportedSphere, tileSet)
      // //   )
      // // }

      // map.distributeSet() // Pre-distribution


      // Canvas
      const testCanvas = document.createElement('canvas')
      const testContext = testCanvas.getContext('2d')
      const testWidth = map.columns * 3
      const testHeight = map.rows * 3

      testCanvas.width = testWidth
      testCanvas.height = testHeight

      testCanvas.style.position = 'absolute'
      testCanvas.style.top = '50%'
      testCanvas.style.left = '50%'
      testCanvas.style.transform = 'translate(-50%, -50%)'
      testCanvas.style.zIndex = '3333'
      testCanvas.style.backgroundColor = 'mistyrose'

      document.body.appendChild(testCanvas)


      // // Initial Prints
      // const printTile = (location, tileUid) => {
      //   const tile = tileSet.get(tileUid)
      //   const dataConcatenation = tile.matrix.buffer.reduce((aggregator, array) => {
      //     return [...aggregator, ...array]
      //   }, [])

      //   const imageData = new ImageData(
      //     Uint8ClampedArray.from(dataConcatenation),
      //     tile.matrix.columns,
      //     tile.matrix.rows
      //   )

      //   testContext.putImageData(imageData, location[0] * 3, location[1] * 3)
      // }

      // const mapLocations = map.sequentialBuffer
      // const initialLocations = _sampleSize(mapLocations, (1 / 300 * map.columns * map.rows) >> 0)

      // initialLocations.forEach(location => {
      //   const tileIndex = map.placeTile(location, tileSetDistributionSpheres)

      //   if (_isNumber(tileIndex) && tileIndex >= 0) {
      //     printTile(location, tileIndex)
      //     // console.log(location, map.orderedCreation.length)
      //   }
      // })

      // const generation = () => {
      //   if (map.orderedCreation.length >= map.columns * map.rows) {
      //     return
      //   }

      //   const lowestEntropyLocation = map.lowestEntropy()
      //   const tileIndex = map.placeTile(lowestEntropyLocation, tileSetDistributionSpheres)

      //   if (_isNumber(tileIndex) && tileIndex >= 0) {
      //     printTile(lowestEntropyLocation, tileIndex)
      //     // console.log(lowestEntropyLocation, map.orderedCreation.length)
      //   }

      //   setTimeout(generation, 1)
      // }

      // requestAnimationFrame(generation)
      // return



      const mapLocations = map.sequentialBuffer
      const initialLocations = _sampleSize(mapLocations, 1)

      const orderedCreation = []

      const getOppositeIndex = neighborIndex => {
        return (neighborIndex + 2) % 4
      }

      let plannedLocations = [].concat(initialLocations)

      const neighborIntercept = neighborLocations => {
        const mappedNeighbors = neighborLocations.map((neighborLocation, neighborIndex) => {
          if (neighborLocation) {
            const neighborContent = map.get(neighborLocation)
            const oppositeIndex = getOppositeIndex(neighborIndex)

            if (_isString(neighborContent)) {
              return tileSet.tiles[neighborContent].neighbors[oppositeIndex]
            } else {
              plannedLocations.push(neighborLocation)
            }
          }

          return null
        })

        const withoutEmptyNeighbors = _reject(mappedNeighbors, _isEmpty)
        const intersectedNeighbors = _intersection(...withoutEmptyNeighbors)

        return intersectedNeighbors
      }

      while (plannedLocations.length) {
        const activeLocation = plannedLocations.shift()
        const activeContent = map.get(activeLocation)

        if (!_isString(activeContent)) {
          const neighborLocations = map.getNeighborLocations(activeLocation)
          const withoutEmptyNeighborLocations = _reject(neighborLocations, _isEmpty)

          const intersectedNeighbors = neighborIntercept(neighborLocations)

          let tilePick
          if (intersectedNeighbors.length) {
            tilePick = tileSet.pick(intersectedNeighbors)
          } else {
            tilePick = tileSet.pick()
          }

          map.set(activeLocation, tilePick.uid)
          orderedCreation.push(activeLocation)
        }
      }

      const printage = (index = 0) => () => {
        if (index >= orderedCreation.length) {
          return
        }

        const location = orderedCreation[index]
        const tileUid = map.get(location)
        const tile = tileSet.tiles[tileUid]

        const dataConcatenation = tile.matrix.buffer.reduce((aggregator, array) => {
          return [...aggregator, ...array]
        }, [])

        const imageData = new ImageData(
          Uint8ClampedArray.from(dataConcatenation),
          tile.matrix.columns,
          tile.matrix.rows
        )

        testContext.putImageData(imageData, location[0] * 3, location[1] * 3)

        // requestAnimationFrame(printage(index + 1))
        setTimeout(printage(index + 1), 1)
      }
      requestAnimationFrame(printage())
    }

    img.src = tileSetImage
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyOperation)
    window.removeEventListener('keydown', this.keyNeutralization)
  },
  mounted() {
    if (!loopActive) {
      this.gameLoop()
    }
  },
}
</script>
