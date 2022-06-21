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
    <div
      className={Styles.inputWrap}
      data-testid={`${props.name}-wrap`}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        placeholder=" "
        title={error}
        data-testid={props.name}
        readOnly
        onFocus={enableInput}
        onChange={handleChange}
        id={`input-${props.name}`}
      />
      <label
        data-testid={`${props.name}-label`}
        title={error}
        htmlFor={`input-${props.name}`}
      >
        {props.placeholder}
      </label>
    </div>
  )
}
