import React from 'react'
import Styles from './styles.scss'
import { Spinner } from '@/presentation/components/spinner/spinner'
import { LoginHeader as Header } from '@/presentation/components/login-header/login-header'
import { Footer } from '@/presentation/components/footer/footer'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputWrap}>
          <input type="email" name="email" placeholder='Digite seu e-mail' />
          <span className={Styles.inputStatus}>🔴</span>
        </div>
        <div className={Styles.inputWrap}>
          <input type="password" name="password" placeholder='Digite sua senhal' />
          <span className={Styles.inputStatus}>🔴</span>
        </div>
        <button type="submit" className={Styles.submit}>Entrar</button>
        <span className={Styles.link}>Criar conta</span>
        <div className={Styles.errorWrap}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Credenciais invalidas</span>
        </div>
      </form>
      <Footer />
    </div>
  )
}

export default Login
