import React, { memo } from 'react'
import { Logo } from '../logo/logo'
import Styles from './styles.scss'

const LoginHeaderComponent: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo />
      <h1>4Dev - Enquetes para Programadores</h1>
    </header>
  )
}

export const LoginHeader = memo(LoginHeaderComponent)
