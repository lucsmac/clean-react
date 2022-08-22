import React from 'react'
import { SurveyList } from '@/presentation/pages'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MakeLogin } from '../factories/pages/login/login-factory'
import { MakeSignUp } from '../factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '../adapters/current-account-adapter'
import PrivateRoute from '@/presentation/components/private-route/private-route'

export const Router = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }
      }>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute><SurveyList /></PrivateRoute>} />
          <Route path="/login" element={<MakeLogin />} />
          <Route path="/signup" element={<MakeSignUp />} />
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}
