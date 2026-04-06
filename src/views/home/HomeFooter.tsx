import type { FooterModel } from '../../models/shared/portal.types'
import { PortalFooter } from '../components/shared/PortalFooter'

type HomeFooterProps = {
  footer: FooterModel
}

export function HomeFooter({ footer }: HomeFooterProps) {
  return <PortalFooter footer={footer} />
}

