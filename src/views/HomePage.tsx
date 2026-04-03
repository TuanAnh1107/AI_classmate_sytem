import { useEffect, type CSSProperties } from 'react'
import type { HomePageViewModel } from '../models/homePageModel'
import { AnnouncementsSection } from './home/AnnouncementsSection'
import { HeroSection } from './home/HeroSection'
import { HomeFooter } from './home/HomeFooter'
import { HomeHeader } from './home/HomeHeader'

type HomePageProps = {
  model: HomePageViewModel
}

export function HomePage({ model }: HomePageProps) {
  const assetBaseUrl = import.meta.env.BASE_URL
  const pageStyle = {
    '--school-logo-url': `url(${assetBaseUrl}school-brand/logo-hust.jpg)`,
    '--hero-image-url': `url(${assetBaseUrl}school-brand/campus-hero.jpeg)`,
  } as CSSProperties

  useEffect(() => {
    document.documentElement.classList.add('reveal-ready')

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -36px 0px',
      },
    )

    targets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${index * 70}ms`)
      observer.observe(target)
    })

    const hero = document.querySelector<HTMLElement>('.hero-banner')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId = 0

    const updateHeroDepth = () => {
      if (!hero || prefersReducedMotion) {
        return
      }

      const scrollTop = window.scrollY
      const backgroundShift = Math.min(26, scrollTop * 0.08)
      const overlayShift = Math.min(14, scrollTop * 0.05)

      hero.style.setProperty('--hero-shift', `${backgroundShift}px`)
      hero.style.setProperty('--hero-overlay-shift', `${overlayShift}px`)
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(updateHeroDepth)
    }

    updateHeroDepth()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)

      if (hero) {
        hero.style.removeProperty('--hero-shift')
        hero.style.removeProperty('--hero-overlay-shift')
      }

      document.documentElement.classList.remove('reveal-ready')
    }
  }, [])

  return (
    <div className="home-page" style={pageStyle}>
      <HomeHeader
        utilityBar={model.utilityBar}
        brandName={model.brandName}
        navItems={model.navItems}
        loginLink={model.loginLink}
      />

      <main className="home-page-main">
        <HeroSection hero={model.hero} />
        <AnnouncementsSection announcements={model.announcements} sidePanels={model.sidePanels} />
      </main>

      <HomeFooter footer={model.footer} />
    </div>
  )
}
