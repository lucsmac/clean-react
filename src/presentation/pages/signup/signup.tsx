/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type StateProps = {
  isLoading: boolean
}

type ErrorStateProps = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  main: string
}

const SignUp: React.FC = () => {
  const [state] = useState<StateProps>({
    isLoading: false,
  })

  const [errorState] = useState<ErrorStateProps>({
    name: 'Campo obrigatório',
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    passwordConfirmation: 'Campo obrigatório',
    main: ''
  })

  return (
    <div className={Styles.signup}>
      <Header />
      <Context.Provider value={{ state, errorState }}>
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
