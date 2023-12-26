import React, { useState } from 'react'
import { ScrollView, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { Images } from '../../../Constant/Image';
import { wp } from '../../Helpers/responsive-ratio';
import { Button, Header } from '../../ReusableComponents';
import { FontistoIcon, Ionicon } from '../../ReusableComponents/Icons';
import { Box, palette, Text, TouchableBox, TypographyStyles } from '../../Theme/Index'
import { styles } from './styles';


const SupportRaiseTicket = (props) => {
    const { route } = props
    const { is_contact_us } = route?.params

    const initialState = { is_contact_submit: false, is_bug_submit: false }
    const [state, setState] = useState(initialState)

    const { email } = useSelector(state => state?.auth?.user?.user?.data)
    const { email_verified_datetime } = useSelector(state => state?.auth?.user?.user?.data?.user_info)
    const isEmailNotVerified = email_verified_datetime == null

    const handleSubmit = () => is_contact_us ? setState({ ...state, is_contact_submit: true }) : setState({ ...state, is_bug_submit: true })
    const handleClose = () => setState({ ...state, is_contact_submit: false, is_bug_submit: false })

    return (
        <Box flex={1} backgroundColor={"white"}>
            <Header title={is_contact_us ? "Contact Us" : "Report a Bug"} left />
            <Box flex={1} p={"l"}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 55 }}
                >
                    <Box flexDirection={'row'} mt="l" mb="s" alignItems={"center"}>
                        {FontistoIcon('email', wp(7), 'black')}
                        <Text variant={"blackshade12900"}>YOUR EMAIL</Text>
                    </Box>
                    <TextInput
                        placeholder={email}
                        placeholderTextColor={palette?.placeholder}
                        style={styles.emailInputStyle}
                        editable={false}
                    />
                    {isEmailNotVerified && (
                        <>
                            <Text variant={'blackshade16400'} marginVertical={"m"}>
                                This email you used to register but not yet verify, please verify it. If you need to change your email address, please go to Edit Profile.
                            </Text>
                            <Box flexDirection={"row"}>
                                <TouchableBox borderWidth={1} p="s" borderRadius={5}>
                                    <Text variant="blackshade12500">
                                        Verify Email
                                    </Text>
                                </TouchableBox>
                                <TouchableBox borderWidth={1} p="s" borderRadius={5} ml="l">
                                    <Text variant="blackshade12500">
                                        Edit Profile
                                    </Text>
                                </TouchableBox>
                            </Box>
                        </>
                    )}
                    <Box flexDirection={'row'} mt="l" mb="s" alignItems={"center"}>
                        <FastImage
                            source={is_contact_us ? Images?.ContactUsDescription : Images?.BugDescription}
                            style={styles?.image}
                            resizeMode="contain"
                        />
                        <Text variant={"blackshade12900"} style={{ marginLeft: wp(4) }}>DESCRIPTION</Text>
                    </Box>
                    <TextInput
                        placeholder={is_contact_us ? `Tell us more so we can help...` : `Please be as detailed as possible. What did you \nexpect and what happened instead?`}
                        style={[styles.emailInputStyle, { height: wp(25) }]}
                        placeholderTextColor={palette?.placeholder}
                        placeholderStyle={{ marginTop: 5 }}
                        // onChangeText={handleIssue}
                        textAlignVertical="top"
                    />
                    <TouchableBox onPress={() => { }} mt={"m"}>
                        <Box flexDirection="row" alignItems="center" mt="s">
                            <FastImage
                                source={Images?.AddcoHost}
                                style={{
                                    height: wp(5),
                                    width: wp(5),
                                }}
                                resizeMode="contain"
                            />
                            <Text
                                variant="blackshade16400"
                                ml="l"
                                style={{ textDecorationLine: 'underline' }}>
                                Attach Screenshot if Required
                            </Text>
                        </Box>
                    </TouchableBox>
                </ScrollView>
                <Box
                    width={wp(100) - 30}
                    position={'absolute'}
                    bottom={wp(4)}
                    alignSelf="center"
                >
                    <Button
                        onPress={handleSubmit}
                        label={'Submit'}
                        buttonStyle={{ height: wp(11) }}
                        disabled={state.is_bug_submit || state.is_contact_submit}
                    />
                </Box>
            </Box>
            {state.is_bug_submit && (
                <Box style={[styles.confirmationModal, TypographyStyles.cardShadow]} backgroundColor={"white"}>
                    <TouchableBox onPress={handleClose} style={{ alignItems: "flex-end" }} p={"s"}>
                        {Ionicon('close', wp(7), palette?.blackshade)}
                    </TouchableBox>
                    <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.BugSubmit}
                        style={{ height: wp(70), width: wp(90) }}
                    />
                    <Text variant={"blackshade20500"} ml={"l"} mt={"l"}>Thank You For Your Report</Text>
                    <Text variant={"blackshade16400"} ml={"l"} marginVertical={"l"}>Your bug report has been submitted. Our tech team is getting on it!</Text>
                    <Box width={wp(100) - 60} alignSelf="center" mb={"m"}>
                        <Button
                            onPress={handleClose}
                            label={'OK'}
                            buttonStyle={{ height: wp(11) }}
                        />
                    </Box>
                </Box>
            )}
            {state.is_contact_submit && (
                <Box style={[styles.confirmationModal, TypographyStyles.cardShadow]} backgroundColor={"white"}>
                    <TouchableBox onPress={handleClose} style={{ alignItems: "flex-end" }} p={"s"}>
                        {Ionicon('close', wp(7), palette?.blackshade)}
                    </TouchableBox>
                    <FastImage
                        resizeMode={FastImage?.resizeMode?.contain}
                        source={Images.ContactUsSubmit}
                        style={{ height: wp(70), width: wp(90) }}
                    />
                    <Text variant={"blackshade20500"} ml={"l"} mt={"l"}>Thank You For Your Message</Text>
                    <Text variant={"blackshade16400"} ml={"l"} marginVertical={"l"}>We appreciate you reaching out to us. Our customer service team will be in touch with you ASAP!</Text>
                    <Box width={wp(100) - 60} alignSelf="center" mb={"m"}>
                        <Button
                            onPress={handleClose}
                            label={'OK'}
                            buttonStyle={{ height: wp(11) }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default SupportRaiseTicket