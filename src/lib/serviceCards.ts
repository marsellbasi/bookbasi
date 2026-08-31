import type {HomepageServiceCard} from '@/types/content'

export function getVisibleServiceCards(cards: HomepageServiceCard[]): HomepageServiceCard[] {
  return cards.filter((card) => card.isActive === true)
}
