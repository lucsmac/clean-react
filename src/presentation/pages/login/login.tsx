/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'
import { Link, useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

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

    try {
      if (state.isLoading || errorState.email || errorState.password) return

      setState(oldState => ({ ...oldState, isLoading: true }))
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })
      localStorage.setItem('accessToken', account.accessToken)

      navigate('/')
    } catch (error) {
      setState(oldState => ({ ...oldState, isLoading: false }))
      setErrorState(oldState => ({ ...oldState, main: error.message }))
    }
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
          <Link data-testid="signup" to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
