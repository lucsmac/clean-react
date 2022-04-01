import React, { useContext } from 'react'
import { Spinner } from '../spinner/spinner'
import Styles from './styles.scss'
import Context from '@/presentation/contexts/form/form-context'

export const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context)

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {state.isLoading && <Spinner className={Styles.spinner} />}
      {errorState.main && <span data-testid="main-error" className={Styles.error}>{errorState.main}</span>}
    </div>
  )
}
