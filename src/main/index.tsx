import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@/presentation/components'
import '@/presentation/styles/global.scss'
import { MakeLogin } from '@/main/factories/pages/login/login-factory'
import { MakeSignUp } from '@/main/factories/pages/signup/signup-factory'

ReactDOM.render(
  <Router
    MakeLogin={MakeLogin}
    MakeSignup={MakeSignUp}
  />,
  document.getElementById('main')
)
