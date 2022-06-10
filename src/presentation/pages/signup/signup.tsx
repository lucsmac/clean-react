/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import Styles from './styles.scss'
import { LoginHeader as Header, Footer, Input, FormStatus, SubmitButton } from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount, SaveAccessToken } from '@/domain/usecases'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

type StateProps = {
  isLoading: boolean
  isFormInvalid: boolean
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
  addAccount?: AddAccount
  saveAccessToken?: SaveAccessToken
}

const SignUp: React.FC<Props> = ({ validation, addAccount, saveAccessToken }: Props) => {
  const navigate = useNavigate()

  const [state, setState] = useState<StateProps>({
    isLoading: false,
    isFormInvalid: true,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.isFormInvalid) return

      setState(oldState => ({ ...oldState, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })

      await saveAccessToken.save(account.accessToken)

      navigate('/')
    } catch (error) {
      setState(oldState => ({ ...oldState, isLoading: false }))
      setErrorState(oldState => ({ ...oldState, main: error.message }))
    }
  }

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state
    const formData = { name, email, password, passwordConfirmation }
    const nameError = validation.validate('name', formData)
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    const passwordConfirmationError = validation.validate('passwordConfirmation', formData)

    setErrorState((prevState) => ({
      ...prevState,
      name: nameError,
      email: emailError,
      password: passwordError,
      passwordConfirmation: passwordConfirmationError,
    }))

    setState((prevState) => ({
      ...prevState,
      isFormInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    }))

  }, [state.name, state.email, state.password, state.passwordConfirmation])

  return (
    <div className={Styles.signup}>
      <Header />
      <Context.Provider value={{ state, setState, errorState, setErrorState }}>
        <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
          <h2>Criar conta</h2>
          <Input type="text" name="name" placeholder='Digite seu nome' />
          <Input type="email" name="email" placeholder='Digite seu e-mail' />
          <Input type="password" name="password" placeholder='Digite sua senha' />
          <Input type="password" name="passwordConfirmation" placeholder='Confirme sua senha' />
          <SubmitButton text={'Cadastrar'} />
          <Link data-testid="login-link" replace to="/login" className={Styles.link}>Voltar para login</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default SignUp
