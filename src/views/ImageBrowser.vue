<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { PlateFlaw } from '@/models/PlateFlaw'

const plateFlaws = ref(new Array<PlateFlaw>())
const currentFlaw = ref()
const filteredFlaws = ref(new Array<PlateFlaw>())
const filterText = ref('')
const getListing = async () => {
  const response = await axios.get('/Pictures/Stamps/Plate%20Flaws/DDR/image-list.json', {
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
}

const filter = () => {
  filteredFlaws.value = plateFlaws.value.filter((item: PlateFlaw) => {
    return item.name.toLowerCase().includes(filterText.value.toLowerCase())
  })
}

const clearFilter = () => {
  filterText.value = ''
  filteredFlaws.value = plateFlaws.value
}

onMounted(async () => {
  plateFlaws.value = await getListing()
  filteredFlaws.value = plateFlaws.value
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
            @change="filter()"
          />
          <button @click="clearFilter()" class="p-1 px-2 bg-gray-500 text-white ml-1 rounded">
            X
          </button>
        </div>
        <div class="overflow-y-auto flex flex-col border">
          <li v-for="flaw in filteredFlaws" :key="flaw.name" class="list-none">
            <span
              @click="showFlaw(flaw)"
              :class="`${
                flaw === currentFlaw ? 'font-bold bg-green-500 text-white' : ''
              } hover:bg-blue-500 hover:text-white w-full flex p-2 active:bg-blue-700 text-sm`"
              >{{ flaw.name }}</span
            >
          </li>
        </div>
      </div>

      <div class="w-full flex-grow">
        <div class="flex flex-col overflow-y-hidden w-full h-full bg-gray-900">
          <div class="bg-white p-2 text-sm hidden md:flex" v-if="currentFlaw">
            <span class="font-bold">Filepath:</span> {{ currentFlaw.path }}
          </div>
          <div class="flex min-h-[min-content] align-middle justify-center m-auto bg-transparent">
            <img
              class="max-h-[100%] max-w-[100%]"
              v-if="currentFlaw"
              :src="`/Pictures/Stamps/Plate%20Flaws/DDR/${currentFlaw.path}`"
            />
            <span v-if="!currentFlaw" class="text-white">No image selected</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
