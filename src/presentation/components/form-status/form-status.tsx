import React, { useContext } from 'react'
import { Spinner } from '../spinner/spinner'
import Styles from './styles.scss'
import Context from '@/presentation/contexts/form/form-context'

export const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(Context)

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {errorMessage && <span className={Styles.error}>{errorMessage}</span>}
    </div>
  )
}
