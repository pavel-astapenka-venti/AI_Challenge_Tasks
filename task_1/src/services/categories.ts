import type { Category } from '../types'
import IconEducation from '../components/icons/IconEducation.vue'
import IconPublicSpeaking from '../components/icons/IconPublicSpeaking.vue'
import IconUniversity from '../components/icons/IconUniversity.vue'

const categories: Category[] = [
  { name: 'Education', icon: IconEducation },
  { name: 'Public Speaking', icon: IconPublicSpeaking },
  { name: 'University Partnership', icon: IconUniversity },
]

export function getCategories(): Category[] {
  return categories
}
