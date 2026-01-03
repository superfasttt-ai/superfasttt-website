import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AnimationBlock } from '@/blocks/Animation/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaModernBlock } from '@/blocks/CtaModern/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HeroModernBlock } from '@/blocks/HeroModern/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ProductShowcaseBlock } from '@/blocks/ProductShowcase/Component'
import { SectorCardsBlock } from '@/blocks/SectorCards/Component'
import { StatsSectionBlock } from '@/blocks/StatsSection/Component'

const blockComponents = {
  animation: AnimationBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  ctaModern: CtaModernBlock,
  faq: FAQBlock,
  featureGrid: FeatureGridBlock,
  formBlock: FormBlock,
  heroModern: HeroModernBlock,
  logoCloud: LogoCloudBlock,
  mediaBlock: MediaBlock,
  productShowcase: ProductShowcaseBlock,
  sectorCards: SectorCardsBlock,
  statsSection: StatsSectionBlock,
}

// Blocs qui gerent leur propre fond (pas d'alternance)
const selfStyledBlocks = ['heroModern', 'ctaModern', 'cta']

// Blocs qui doivent recevoir une prop backgroundStyle pour l'alternance
const alternatingBlocks = [
  'featureGrid',
  'productShowcase',
  'sectorCards',
  'statsSection',
  'faq',
  'content',
  'archive',
  'logoCloud',
]

// Blocs qui supportent le fond sombre (primary)
const darkCapableBlocks = ['featureGrid', 'sectorCards', 'statsSection']

// Pattern de fond pour creer un rythme visuel: white -> muted -> white -> dark
const backgroundPattern: Array<'white' | 'muted' | 'dark'> = ['white', 'muted', 'white', 'dark']

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    // Calculer l'alternance en ignorant les blocs self-styled
    let alternateIndex = 0

    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Determiner le style de fond pour les blocs alternants
              const shouldAlternate = alternatingBlocks.includes(blockType)
              const canBeDark = darkCapableBlocks.includes(blockType)

              let backgroundStyle: 'white' | 'muted' | 'dark' | undefined

              if (shouldAlternate) {
                const patternStyle = backgroundPattern[alternateIndex % backgroundPattern.length]
                // Si le pattern suggere 'dark' mais le bloc ne le supporte pas, utiliser 'muted'
                backgroundStyle = patternStyle === 'dark' && !canBeDark ? 'muted' : patternStyle
                alternateIndex++
              }

              // Les blocs hero et CTA gerent leur propre espacement
              const isSelfStyled = selfStyledBlocks.includes(blockType)

              return (
                <div className={isSelfStyled ? '' : 'my-16'} key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} backgroundStyle={backgroundStyle} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
