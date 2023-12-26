import React from 'react'
import FastImage from 'react-native-fast-image'
import { ScrollView } from 'react-native'
import { Images } from '../../../Constant/Image'
import { Button, Header, LoadingOverlay } from '../../ReusableComponents'
import AccordianButton from '../../ReusableComponents/AccordianButton'
import { Box, palette, Text, TouchableBox, TypographyStyles } from '../../Theme/Index'
import ResetPassword from './Privacy/resetPassword'
import DeleteAccount from './Privacy/deleteAccount'
import Pin from './Privacy/pin'
import { useState } from 'react'
import { wp } from '../../Helpers/responsive-ratio'
import { Ionicon } from '../../ReusableComponents/Icons'
import { useMutation } from 'react-query'
import { deleteAccount } from '../../Services/ProfileApi'
import { displayErrorToast } from '../../../utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import authStore from '../../../Zustand/store'

const Privacy = () => {
    const [deleteAcc, setDeleteAcc] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const setToken = authStore(state => state?.setToken);

    const DATA = [
        {
            id: 1,
            icon: Images?.ResetPassword,
            title: 'Reset Password',
            component: <ResetPassword />
        },
        {
            id: 2,
            icon: Images?.PIN,
            title: 'PIN',
            component: <Pin />
        },
        {
            id: 3,
            icon: Images?.DeleteAccount,
            title: 'Delete Account',
            component: <DeleteAccount setDeleteAcc={setDeleteAcc} />
        }
    ]

    const deleteAccountMutation = useMutation('deleteAccount', deleteAccount, {
        onSuccess: data => {
            setIsLoading(false)
            if (data?.success == 0) {
                return displayErrorToast(data?.message)
            } else if (data?.success == 1) {
                AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys));
                setToken({ token: '' });
            } else {
                return displayErrorToast("Something Went Wrong")
            }
        },
        onError: error => {
            setIsLoading(false)
            displayErrorToast(error?.data?.message)
        }
    })

    const onHandleDeleteAcc = () => {
        setIsLoading(true)
        deleteAccountMutation.mutate()
    } 

    return (
        <Box flex={1} backgroundColor={"white"}>
            {isLoading && <LoadingOverlay />}
            {deleteAcc && <TouchableBox
                style={{
                    position: 'absolute',
                    // flex: 1,
                    top: 0,
                    left: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: palette.overlay,
                    height: '100%',
                    width: '100%',
                    zIndex: 10,
                }}
                onPress={() => setDeleteAcc(false)}
            />}

            <Header title={"Privacy"} left />
            <Box p={"l"} flex={1}>

                {deleteAcc && (
                    <Box style={[TypographyStyles.cardShadow, TypographyStyles.container,
                    { position: 'absolute', left: 0, right: 0, top: wp(40), marginHorizontal: wp(4), borderRadius: 10, zIndex: 15 }
                    ]}>
                        <Box
                            flexDirection={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            marginHorizontal={'l'}
                            marginVertical={'l'}
                            mt={'xl'}>
                            <Text variant={'blackshade20500'}>Leaving already?</Text>
                            <TouchableBox style={{ top: wp(-4), marginRight: wp(-2) }} onPress={() => setDeleteAcc(false)}>
                                {Ionicon('close', wp(7), palette?.blackshade)}
                            </TouchableBox>
                        </Box>
                        <Text marginHorizontal={'l'} variant={'blackshade16400'}>Are you absolutely sure you want to delete your account? All your data will be permanently removed.</Text>
                        <Box height={46} marginHorizontal={'l'} mt={"l"}>
                            <Button label="Delete Account" onPress={onHandleDeleteAcc} />
                        </Box>
                        <TouchableBox
                            style={{
                                alignItems: 'center',
                                marginTop: wp(2),
                                marginBottom: wp(2),
                            }}
                            onPress={() => setDeleteAcc(false)}>
                            <Text variant="blackshade14400" marginVertical={'s'}>
                                Cancel
                            </Text>
                        </TouchableBox>
                    </Box>
                )}

                <ScrollView showsVerticalScrollIndicator={false}>
                    {DATA.map((data) => {
                        return (
                            <AccordianButton
                                title={() => (
                                    <Box flexDirection="row">
                                        <FastImage
                                            source={data?.icon}
                                            style={{ height: 24, width: 24 }}
                                            resizeMode={FastImage?.resizeMode?.contain}
                                        />
                                        <Text ml="m" variant="blackshade16800">{data?.title}</Text>
                                    </Box>
                                )}
                                data={() => (
                                    <Box mt="l">{data?.component}</Box>
                                )}
                                defaultExpand={false}
                            />
                        )
                    })}
                </ScrollView>
            </Box>
        </Box>
    )
}

export default Privacy