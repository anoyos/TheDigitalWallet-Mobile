import React, { useRef, forwardRef, useState } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import { Modalize } from 'react-native-modalize'
import useCombinedRefs from 'app/lib/use-combined-refs'
import { Button } from 'react-native-material-buttons'
import { CheckBox } from 'react-native-elements'
import { XButton, PillButton } from 'app/components'
import Banner from 'app/assets/images/invite_friends.png'
import { percentWidth, fonts, colors } from 'app/styles'

const ContactsModal = forwardRef(({
  contacts,
  selectedContacts,
  setSelectedContacts,
  handleSendSMSReferrals,
  showEmailModal,
}, ref) => {
  const [search, setSearch] = useState('')
  const modalizeRef = useRef(null)
  const combinedRef = useCombinedRefs(ref, modalizeRef)

  const shownContacts = () => {
    const filteredContacts = [...contacts].filter(({ name, phone }) => {
      if (phone.replace(/\D/g, '').includes(search) || name.toLowerCase().includes(search.toLowerCase())) return true
      return false
    })

    return filteredContacts
  }

  const closeModal = () => {
    if (combinedRef.current) {
      combinedRef.current.close()
    }
  }

  const renderItem = ({ item }) => {
    const selected = selectedContacts.includes(item.phone)

    const handleContactPress = (phone) => {
      if (selected) {
        setSelectedContacts([...selectedContacts].filter((c) => c !== phone))
      } else {
        setSelectedContacts([...selectedContacts, phone])
      }
    }

    return (
      <Button
        color="transparent"
        style={{
          height: percentWidth(20),
          width: percentWidth(100),
          flexDirection: 'row',
        }}
        onPress={() => handleContactPress(item.phone)}
      >
        <View style={{ width: '70%', paddingLeft: percentWidth(5), justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: percentWidth(4), fontFamily: fonts.bold }}>{item.name}</Text>
            <Text style={{ fontSize: percentWidth(3.5), fontFamily: fonts.regular, marginLeft: percentWidth(2) }}>{`(${item.label})`}</Text>
          </View>
          <Text style={{ fontSize: percentWidth(4), fontFamily: fonts.regular }}>{item.phone}</Text>
        </View>
        <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center' }}>
          <CheckBox checked={selected} />
        </View>
      </Button>
    )
  }

  const renderHeader = () => (
    <View style={{ paddingTop: percentWidth(5) }}>
      <XButton onPress={closeModal} top={percentWidth(5)} />
      <Image source={Banner} style={{ alignSelf: 'center', width: percentWidth(65), height: percentWidth(65 * 0.624600639) }} />
      <View style={{ paddingLeft: percentWidth(5) }}>
        <Text style={{ fontSize: percentWidth(5.75), fontFamily: fonts.bold }}>Invite Friends &</Text>
        <Text style={{ fontSize: percentWidth(5.75), fontFamily: fonts.bold }}>Earn 5% of their Fees!</Text>
      </View>
      <View style={{ flexDirection: 'row', padding: percentWidth(5), height: percentWidth(15), alignItems: 'center' }}>
        <PillButton
          width={percentWidth(23)}
          height={percentWidth(8)}
          onPress={handleSendSMSReferrals}
          title="Send SMS"
          condition={selectedContacts.length === 0}
        />
        <View style={{ marginLeft: percentWidth(5) }}>
          <PillButton
            width={percentWidth(23)}
            height={percentWidth(8)}
            title="Send Email"
            onPress={() => {
              closeModal()
              showEmailModal()
            }}
          />
        </View>
      </View>
      <TextInput
        placeholder="Name or phone number"
        placeholderTextColor="rgba(0,0,0,0.5)"
        value={search}
        style={{
          backgroundColor: 'white',
          paddingVertical: percentWidth(1.2),
          height: percentWidth(10),
          width: percentWidth(90),
          alignSelf: 'center',
          paddingLeft: percentWidth(3),
          fontSize: percentWidth(4),
          color: colors.text,
          borderWidth: 0.5,
          borderRadius: percentWidth(2),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.12,
          shadowRadius: 1.41,
          elevation: 2,
        }}
        onChangeText={(value) => setSearch(value)}
      />
    </View>
  )

  return (
    <Modalize
      ref={combinedRef}
      HeaderComponent={renderHeader}
      flatListProps={{
        data: shownContacts(),
        renderItem,
        bounces: false,
        keyExtractor: (item) => item.phone,
        showsVerticalScrollIndicator: false,
        ListFooterComponent: () => <View style={{ height: percentWidth(20) }} />,
      }}
    />
  )
})

export default ContactsModal
