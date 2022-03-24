import React, { useContext } from 'react'
import { Spinner } from '../spinner/spinner'
import Styles from './styles.scss'
import Context from '@/presentation/contexts/form/form-context'

export const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context)

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {state.isLoading && <Spinner className={Styles.spinner} />}
      {errorState.errorMessage && <span className={Styles.error}>{errorState.errorMessage}</span>}
    </div>
  )
}
