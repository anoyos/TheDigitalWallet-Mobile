import React, { useState } from 'react'
import { View } from 'react-native'
import { changePassword } from 'app/lib/auth'
import SafeAreaView from 'react-native-safe-area-view'
import { getState } from 'app/lib/react-simply'
import { SubHeader } from 'app/components/Headers'
import { FullWidthButton, PasswordInput, LoadingModal } from 'app/components'
import { containers, screenWidth, percentHeight } from 'app/styles'
import * as toast from 'app/lib/toast'

export default function ChangePassword({ navigation }) {
  const [loading, setLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [oneUppercaseLetter, setOneUppercaseLetter] = useState(false)
  const [eightCharacters, setEightCharacters] = useState(false)
  const [{ user }, dispatch] = getState()

  const checkRequirements = (v, setter) => {
    const oneUppercaseLetterRegex = /(?=.*[A-Z])/
    if (oneUppercaseLetterRegex.test(v)) setOneUppercaseLetter(true)
    else setOneUppercaseLetter(false)

    if (v.length >= 8) setEightCharacters(true)
    else setEightCharacters(false)

    setter(v)
  }

  // eslint-disable-next-line consistent-return
  const handleChangePassword = async () => {
    setLoading(true)

    if (newPassword !== confirmNewPassword) {
      setLoading(false)
      return toast.message('New Passwords do not match.')
    }

    changePassword({ user, oldPassword, newPassword }, setLoading, navigation.navigate, dispatch)
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }} style={{ flex: 1 }}>
      <SubHeader title="Change Password" navigation={navigation} />
      <View style={[containers.screenContainer, { marginTop: percentHeight(3) }]}>
        <PasswordInput
          placeholder="Current Password"
          textContentType="password"
          onChangeText={(value) => setOldPassword(value)}
          value={oldPassword}
        />
        <PasswordInput
          placeholder="New Password"
          textContentType="password"
          onChangeText={(value) => checkRequirements(value, setNewPassword)}
          value={newPassword}
          oneUppercaseLetter={oneUppercaseLetter}
          eightCharacters={eightCharacters}
          validation
        />
        <PasswordInput
          placeholder="Confirm Password"
          textContentType="password"
          onChangeText={(value) => setConfirmNewPassword(value)}
          value={confirmNewPassword}
        />
      </View>
      <View style={{ paddingTop: 10, width: screenWidth, marginTop: 30 }}>
        <FullWidthButton
          onPress={() => handleChangePassword()}
          condition={!oldPassword || !newPassword || !confirmNewPassword}
          title="Submit"
        />
      </View>
      <LoadingModal loading={loading} loadingMessage="Changing password..." />
    </SafeAreaView>
  )
}
