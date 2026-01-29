<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { PlateFlaw } from '@/models/PlateFlaw'

const plateFlaws = ref(new Array<PlateFlaw>())
const currentFlaw = ref<PlateFlaw | undefined>()
const filterText = ref('')
const imagePane = ref()
const imageSize = ref({
  width: 0,
  height: 0
})
const showOnlyUnknown = ref(false)

const IMAGE_ROOT = '/Pictures/Stamps/Plate%20Flaws/DDR'

let observer: ResizeObserver

const getListing = async () => {
  const response = await axios.get(`${IMAGE_ROOT}/image-list.json`, {
    headers: { Accept: 'application/json' }
  })
  const data = response.data
  const values = new Array<PlateFlaw>()
  data.forEach((s: string) => {
    values.push(PlateFlaw.fromString(s))
  })
  values.sort((a, b) => {
    const nameA = parseInt(a.name.split(/[\s-]+/)[0])
    const nameB = parseInt(b.name.split(/[\s-]+/)[0])
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
  return values
}

const showFlaw = (flaw: PlateFlaw) => {
  currentFlaw.value = flaw
  calculateSize(imagePane.value)
}

const filteredFlaws = computed(() => {
  const searchText = filterText.value.toLowerCase()
  return plateFlaws.value.filter((item) => {
    if (showOnlyUnknown.value && !item.isUnknown) return false
    return item.name.toLowerCase().includes(searchText)
  })
})

const handleKey = (event: KeyboardEvent) => {
  const flaw = currentFlaw.value
  if (!flaw) return
  let dir = 0
  const index = filteredFlaws.value.findIndex((item) => item.path === flaw?.path)
  if (event.key === 'ArrowUp') {
    dir = -1
  } else if (event.key === 'ArrowDown') {
    dir = 1
  }
  if (dir > 0 && index < filteredFlaws.value.length - 1) {
    nextTick(() => {
      showFlaw(filteredFlaws.value[index + 1])
    })
  } else if (dir < 0 && index > 0) {
    nextTick(() => {
      showFlaw(filteredFlaws.value[index - 1])
    })
  }
}

const clearFilter = () => {
  filterText.value = ''
}

const calculateSize = async (elem: HTMLDivElement) => {
  imageSize.value.height = Math.max(elem.clientHeight - 32, 0)
  imageSize.value.width = elem.clientWidth
  await nextTick()
  const img = elem.querySelector('img') as HTMLImageElement
  if (img) {
    img.style['maxHeight'] = `${imageSize.value.height}px`
    img.style['maxWidth'] = `${imageSize.value.width}px`
  }
}

onUnmounted(() => {
  if (observer && imagePane.value) {
    observer.unobserve(imagePane.value)
  }
})

onMounted(async () => {
  plateFlaws.value = await getListing()

  observer = new ResizeObserver(() => {
    if (imagePane.value) {
      calculateSize(imagePane.value)
    }
  })
  await nextTick()
  observer.observe(imagePane.value)
})
</script>

<template>
  <div class="flew flex-col w-full overflow-y-hidden flex-grow-0">
    <div
      class="md:h-[50px] h-[2rem] md:p-2 p-1 bg-gray-900 text-gray-100 border-b-2 border-green-500 flex align-middle"
    >
      <img
        alt="logo"
        class="md:w-8 md:h-8 w-6 h-6 mr-1"
        src="../assets/images/stamp-web-64x64.png"
      />
      <h1 class="md:text-2xl text-md truncate">Stamp Web Editor: Plate Flaws</h1>
    </div>
    <div
      class="flex md:flex-row flex-col absolute md:top-[50px] top-[2rem] right-0 left-0 bottom-0 p-2"
    >
      <div
        class="flex flex-col md:w-[350px] md:h-full md:max-h-full w-full max-h-[200px] md:mb-0 mb-2"
      >
        <div class="flex items-center align-middle text-center p-1 mb-1 text-sm">
          Filter:
          <input
            type="text"
            placeholder="Search by"
            class="border ml-2 rounded p-1 text-sm text-black"
            v-model="filterText"
          />
          <button @click="clearFilter" class="p-1 px-2 bg-gray-500 text-white ml-1 rounded">
            ✕
          </button>
        </div>
        <div class="mb-2">
          <label class="ml-2 text-sm">
            <input type="checkbox" v-model="showOnlyUnknown" />
            Only Show Unconfirmed
          </label>
        </div>
        <ul class="overflow-y-auto flex flex-col border p-0">
          <li v-for="flaw in filteredFlaws" :key="flaw.path" class="list-none">
            <button
              @keyup="handleKey($event)"
              @click="showFlaw(flaw)"
              :class="[
                'hover:bg-blue-500 hover:text-white w-full flex p-2 active:bg-blue-700 text-sm',
                {
                  'font-bold bg-green-500 text-white': flaw === currentFlaw
                }
              ]"
            >
              {{ flaw.name }}
            </button>
          </li>
        </ul>
      </div>

      <div class="w-full flex-grow">
        <div class="flex flex-col overflow-y-hidden w-full h-full bg-gray-900" ref="imagePane">
          <div class="bg-white p-2 text-sm hidden md:flex" v-if="currentFlaw">
            <span class="font-bold">Filepath:</span> {{ currentFlaw.path }}
          </div>
          <div class="flex min-h-[min-content] align-middle justify-center m-auto bg-transparent">
            <img
              class="object-scale-down"
              v-if="currentFlaw"
              :src="`${IMAGE_ROOT}/${currentFlaw.path}`"
            />
            <span v-if="!currentFlaw" class="text-white grow"> No image selected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
