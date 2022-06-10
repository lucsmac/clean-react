/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type StateProps = {
  isLoading: boolean
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type ErrorStateProps = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  main: string
}

type Props = {
  validation?: Validation
}

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState<StateProps>({
    isLoading: false,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  const [errorState, setErrorState] = useState<ErrorStateProps>({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    main: ''
  })

  useEffect(() => {
    setErrorState((prevState) => ({
      ...prevState,
      name: validation.validate('name', state.name),
      email: validation.validate('email', state.email),
      password: validation.validate('password', state.password),
      passwordConfirmation: validation.validate('passwordConfirmation', state.passwordConfirmation),
    }))
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  return (
    <div className={Styles.signup}>
      <Header />
      <Context.Provider value={{ state, setState, errorState, setErrorState }}>
        <form className={Styles.form}>
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder='Digite seu nome' />
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senhal' />
          <Input type="password" name="passwordConfirmation" placeholder='Confirme sua senhal' />
          <button data-testid="submit" type="submit" disabled className={Styles.submit}>Criar</button>
          <span className={Styles.link}>Voltar para login</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
