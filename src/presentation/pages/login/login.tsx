/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus, SubmitButton } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication, SaveAccessToken } from '@/domain/usecases'
import { Link, useNavigate } from 'react-router-dom'

type StateProps = {
  isLoading: boolean
  isFormInvalid: boolean
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
  saveAccessToken?: SaveAccessToken
}

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }: Props) => {
  const navigate = useNavigate()

  const [state, setState] = useState<StateProps>({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: ''
  })

  const [errorState, setErrorState] = useState<ErrorStateProps>({
    email: '',
    password: '',
    main: ''
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return

      setState(oldState => ({ ...oldState, isLoading: true }))
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })

      await saveAccessToken.save(account.accessToken)

      navigate('/')
    } catch (error) {
      setState(oldState => ({ ...oldState, isLoading: false }))
      setErrorState(oldState => ({ ...oldState, main: error.message }))
    }
  }

  useEffect(() => {
    const { email, password } = state
    const formData = { email, password }
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)

    setErrorState((prevState) => ({
      ...prevState,
      email: emailError,
      password: passwordError
    }))

    setState((prevState) => ({
      ...prevState,
      isFormInvalid: !!emailError || !!passwordError
    }))
  }, [state.email, state.password])

  return (
    <div className={Styles.loginWrap}>
      <Header />
      <Context.Provider value={{ state, setState, errorState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senha' />
          <SubmitButton text={'Entrar'} />
          <Link data-testid="signup-link" to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
