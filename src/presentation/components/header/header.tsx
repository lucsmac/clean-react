import React, { memo } from 'react'
import { Logo } from '@/presentation/components'
import Styles from './header-styles.scss'

const HeaderComponent = () => {
  return (
    <div className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Lucas</span>
          <a href="#">Sair</a>
        </div>
      </div>
    </div>
  )
}

export const Header = memo(HeaderComponent)
