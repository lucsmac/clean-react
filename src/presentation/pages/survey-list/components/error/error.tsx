import React, { useContext } from 'react'
import { SurveyContext } from '..'
import Styles from './error-styles.scss'

const Error: React.FC = () => {
  const { state, setState } = useContext(SurveyContext)
  const reload = (): void => {
    setState({ surveys: [], error: '', reload: !state.reload })
  }

  return (
    <div className={Styles.errorWrap}>
      <span data-testid="error">{state.error}</span>
      <button onClick={reload} data-testid="reload">Recarregar</button>
    </div>
  )
}

export default Error
