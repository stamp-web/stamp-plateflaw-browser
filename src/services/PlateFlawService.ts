import axios from 'axios'
import { PlateFlaw } from '@/models/PlateFlaw'

export const BASE_IMAGE_ROOT = '/Pictures/Stamps/Plate%20Flaws'

export class PlateFlawService {
  static getBaseImageRoot(): string {
    return BASE_IMAGE_ROOT
  }

  static getImageUrl(collection: string, path: string): string {
    return `${BASE_IMAGE_ROOT}/${collection}/${path}`
  }

  static async getCollections(): Promise<string[]> {
    const response = await axios.get(`${BASE_IMAGE_ROOT}/plate-flaws.json`, {
      headers: { Accept: 'application/json' }
    })
    return response.data
  }

  static async getListing(collection: string): Promise<PlateFlaw[]> {
    const response = await axios.get(`${BASE_IMAGE_ROOT}/${collection}/image-list.json`, {
      headers: { Accept: 'application/json' }
    })
    const data = response.data
    const values: PlateFlaw[] = []
    if (Array.isArray(data)) {
      data.forEach((s: string) => {
        values.push(PlateFlaw.fromString(s))
      })
    }
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
}
