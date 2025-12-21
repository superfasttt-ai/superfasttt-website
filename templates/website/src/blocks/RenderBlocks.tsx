import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AnimationBlock } from '@/blocks/Animation/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { CtaModernBlock } from '@/blocks/CtaModern/Component'
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
  featureGrid: FeatureGridBlock,
  formBlock: FormBlock,
  heroModern: HeroModernBlock,
  logoCloud: LogoCloudBlock,
  mediaBlock: MediaBlock,
  productShowcase: ProductShowcaseBlock,
  sectorCards: SectorCardsBlock,
  statsSection: StatsSectionBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
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
