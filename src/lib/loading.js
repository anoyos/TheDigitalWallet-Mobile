import React, { useEffect, useState, createContext } from 'react'
import { View } from 'react-native'
import { LoadingModal } from 'app/components'
import { useApolloClient } from '@apollo/react-hooks'
import { checkLoggedIn } from 'app/lib/auth'
import { getState } from 'app/lib/react-simply'

const LoadingContext = createContext()

export default function Loading({ children }) {
  const client = useApolloClient()
  const [{ timer }, dispatch] = getState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLoggedIn(timer, setLoading, client, dispatch)
  }, [])

  if (!loading) {
    return (
      <LoadingContext.Provider>
        {children}
      </LoadingContext.Provider>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <LoadingModal loading={loading} loadingMessage="Checking logged in..." />
    </View>
  )
}
