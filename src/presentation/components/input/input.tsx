import React, { useContext } from 'react'
import Styles from './styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input: React.FC<Props> = (props: Props) => {
  const { errorState, setState } = useContext(Context)
  const error = errorState[props.name]

  const getStatus = (): string => {
    return error ? '🔴' : '✔'
  }

  const getTtitle = (): string => {
    return error
  }

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false
  }

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState(state => ({
      ...state,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <div className={Styles.inputWrap}>
      <input data-testid={props.name} {...props} readOnly onFocus={enableInput} onChange={handleChange} />
      <span data-testid={`${props.name}-status`} title={getTtitle()} className={Styles.inputStatus}>{getStatus()}</span>
    </div>
  )
}
