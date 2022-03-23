import React, { memo } from 'react'
import { Spinner } from '../spinner/spinner'
import Styles from './styles.scss'

export const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrap}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Credenciais invalidas</span>
    </div>
  )
}
