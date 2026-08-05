'use client'

import {useTranslations} from 'next-intl'
import {TypedText} from './typed-text'
import {siteContent} from '@/messages/site-content'

export function GlobalProfile(){
  const profile=useTranslations('Profile')
  return <aside className="global-profile scene-item">
    <p className="global-profile__signature"><TypedText text={profile('signature')}/></p>
    <p className="global-profile__introduction"><TypedText text={profile('introduction')}/></p>
    <a className="global-profile__contact" href={siteContent.contacts.linkedin} target="_blank" rel="noreferrer"><TypedText text={profile('cta')}/><span aria-hidden="true">↗</span></a>
  </aside>
}
