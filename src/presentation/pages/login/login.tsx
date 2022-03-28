import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

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
}

const Login: React.FC<Props> = ({ validation }: Props) => {
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
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senhal' />
          <button data-testid="submit" disabled type="submit" className={Styles.submit}>Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
