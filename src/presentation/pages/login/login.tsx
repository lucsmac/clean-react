import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type StateProps = {
  isLoading: boolean
  email: string
  password: string
}

type ErrorStateProps = {
  email: string
  password: string
  main: string
}

type Props = {
  validation?: Validation
  authentication?: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState<StateProps>({
    isLoading: false,
    email: '',
    password: ''
  })

  const [errorState, setErrorState] = useState<ErrorStateProps>({
    email: '',
    password: '',
    main: ''
  })

  const hasError = (): boolean => !!errorState.email || !!errorState.password

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (state.isLoading || errorState.email || errorState.password) return

    setState(oldState => ({ ...oldState, isLoading: true }))
    await authentication.auth({
      email: state.email,
      password: state.password
    })
  }

  useEffect(() => {
    setErrorState((prevState) => ({
      ...prevState,
      email: validation.validate('email', state.email)
    }))
  }, [state.email])

  useEffect(() => {
    setErrorState((prevState) => ({
      ...prevState,
      password: validation.validate('password', state.password)
    }))
  }, [state.password])

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={{ state, setState, errorState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senhal' />
          <button data-testid="submit" disabled={hasError()} type="submit" className={Styles.submit}>Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
