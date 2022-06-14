import React, { useContext } from 'react'
import Styles from './styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input: React.FC<Props> = (props: Props) => {
  const { errorState, setState } = useContext(Context)
  const error = errorState[props.name]

  const getStatus = (): string => error ? '🔴' : '✔'

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
      <input
        {...props}
        placeholder=" "
        data-testid={props.name}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
        id={`input-${props.name}`}
      />
      <label htmlFor={`input-${props.name}`}>
        {props.placeholder}
      </label>
      <span
        data-testid={`${props.name}-status`}
        title={error}
        className={Styles.inputStatus}
      >
        {getStatus()}
      </span>
    </div>
  )
}
