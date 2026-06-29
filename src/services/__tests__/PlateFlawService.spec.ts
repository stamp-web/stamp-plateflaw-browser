import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { PlateFlawService, BASE_IMAGE_ROOT } from '../PlateFlawService'

vi.mock('axios')

describe('PlateFlawService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getBaseImageRoot', () => {
    it('should return the correct base image root', () => {
      expect(PlateFlawService.getBaseImageRoot()).toBe(BASE_IMAGE_ROOT)
    })
  })

  describe('getImageUrl', () => {
    it('should construct the correct image URL', () => {
      const collection = 'DDR'
      const path = '123-some-flaw.png'
      const expected = `${BASE_IMAGE_ROOT}/${collection}/${path}`
      expect(PlateFlawService.getImageUrl(collection, path)).toBe(expected)
    })
  })

  describe('getCollections', () => {
    it('should fetch collection names', async () => {
      const mockCollections = ['DDR', 'FDR', 'Saar']
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockCollections })

      const result = await PlateFlawService.getCollections()

      expect(axios.get).toHaveBeenCalledWith(`${BASE_IMAGE_ROOT}/plate-flaws.json`, {
        headers: { Accept: 'application/json' }
      })
      expect(result).toEqual(mockCollections)
    })
  })

  describe('getListing', () => {
    it('should fetch, parse and sort listings numerically', async () => {
      const mockData = [
        'DDR/10 a-flaw.png',
        'DDR/2 b-flaw.png',
        'DDR/1 c-flaw.png'
      ]
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData })

      const result = await PlateFlawService.getListing('DDR')

      expect(axios.get).toHaveBeenCalledWith(`${BASE_IMAGE_ROOT}/DDR/image-list.json`, {
        headers: { Accept: 'application/json' }
      })

      expect(result).toHaveLength(3)
      // Sorted numerically by leading number: 1, 2, 10
      expect(result[0].name).toBe('1 c-flaw.png')
      expect(result[1].name).toBe('2 b-flaw.png')
      expect(result[2].name).toBe('10 a-flaw.png')
    })

    it('should handle sorting correctly when split by hyphens or spaces', async () => {
      const mockData = [
        'DDR/12-flaw.png',
        'DDR/3 flaw.png'
      ]
      vi.mocked(axios.get).mockResolvedValueOnce({ data: mockData })

      const result = await PlateFlawService.getListing('DDR')

      expect(result[0].name).toBe('3 flaw.png')
      expect(result[1].name).toBe('12-flaw.png')
    })
  })
})
