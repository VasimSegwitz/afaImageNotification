import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {BackHandler, Platform} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import BottomTabs from '../Components/BottomTabs/BottomTabs';
import BookingSearch from '../Components/Booking/SearchVenues/BookingSearch/BookingSearch';
import SelectSport from '../Components/Booking/SearchVenues/SelectSport/SelectSport';
import SearchLocation from '../Components/Booking/SearchVenues/SearchLocation/SearchLocation';
import SearchResults from '../Components/Booking/SearchVenues/SearchResults/SearchResults';
import VenuInfo from '../Components/Booking/SearchVenues/VenueInfo/VenueInfo';
import CheckAvailability from '../Components/Booking/CheckAvailability/CheckAvailability';
import BookSlot from '../Components/Booking/CheckAvailability/BookSlot/BookSlot';
import BookingSummary from '../Components/Booking/CheckAvailability/BookingSummary/BookingSummary';
import BookingConfirmation from '../Components/Booking/CheckAvailability/BookingConfirmation/BookingConfirmation';
import CreateActivity from '../Components/Booking/CreateActivity/CreateActivity';
import SetupGreeting from '../Components/SetupGreeting';
import Options from '../Components/SetupGreeting/Options';
import SelectSports from '../Components/SetupGreeting/SelectSports';
import SelectLocation from '../Components/SetupGreeting/SelectLocation';
import authStore from '../Zustand/store';
import ActivitySearch from '../Components/Booking/ActivitySearch';
import SearchActivity from '../Components/Booking/ActivitySearch/SearchActivity';
import ActivityFilter from '../Components/Booking/ActivitySearch/ActivityFilter';
import BookingHistory from '../Components/Booking/History/bookingHistory';
import SingleUpcoming from '../Components/Booking/History/Single/singleUpcoming';
import RefundPolicy from '../Components/Booking/History/Single/refundPolicy';
import WalletEmailVerification from '../Components/Wallet/Intro/walletEmailVerification';
import WalletActivatedGreeting from '../Components/Wallet/Intro/walletActivatedGreeting';
import SetUpPin from '../Components/Wallet/Pin/setUpPin';
import UpdatePin from '../Components/Wallet/Pin/UpdatePin';
import PinSuccess from '../Components/Wallet/Pin/PinSuccess';
import ConfirmPin from '../Components/Wallet/Pin/ConfirmPin';
import TopUp from '../Components/Wallet/Topup/topUp';
import EditProfile from '../Components/Profile/editProfile';
import Verification from '../Components/Authentication/Verification';
import VerifyEmail from '../Components/Profile/Verification/verifyEmail';
import Profile from '../Components/Profile/Profile';
import ActivityDetail from '../Components/Booking/ActivityDetail';
import ActivityPage from '../Components/Booking/ActivityPage';
import WalletTransaction from '../Components/Wallet/Transaction/walletTransaction';
import MyTransactions from '../Components/Wallet/Transaction/myTransactions';
import Invite from '../Components/Booking/Invite/invite';
import MyActivity from '../Components/Profile/MyActivity/myActivity';
import ActivityHost from '../Components/Booking/ActivityHost';
import AddCoHost from '../Components/Booking/ActivityHost/AddCoHost';
import ReserveSlot from '../Components/Booking/ActivityHost/ReserveSlot';
import RSVP from '../Components/Booking/ActivityHost/RSVP';
import Venues from '../Components/Dashboard/Venue/venues';
import Notification from '../Components/Dashboard/Notification/notifications';
import Preferences from '../Components/Profile/DrawerMenu/preferences';
import Privacy from '../Components/Profile/DrawerMenu/privacy';
import SupportRaiseTicket from '../Components/Profile/DrawerMenu/supportRaiseTicket';
import Feedback from '../Components/Profile/DrawerMenu/Feedback/feedback';
import Points from '../Components/Profile/Points';
import Earn from '../Components/Profile/Points/Earn';
import QRscanner from '../Components/Booking/QRscanner';
import ChangeLocation from '../Components/Dashboard/ChangeLocation';
import PinVerification from '../Components/ReusableComponents/PinVerification/pinVerification';
import Wallet from '../Components/Wallet';
import DashboardSearch from '../Components/Dashboard/DashboardSearch';
import VenueFilter from '../Components/Dashboard/DashboardSearch/VenueFilter';
import BookingScheduleView from '../Components/Booking/CheckAvailability/BookingSchedule/BookingSchduleView';
import PaymentLoading from '../Components/Booking/CheckAvailability/BookingSummary/PaymentLoading';
import PaymentSuccess from '../Components/Booking/CheckAvailability/BookingSummary/PaymentSuccess';
import ZendeskChat from '../Components/Zendesk';
import ForgotPin from '../Components/Profile/DrawerMenu/Privacy/forgotPin';
import SelectState from '../Components/Booking/SearchVenues/BookingSearch/selectState';
import SelectCity from '../Components/Booking/SearchVenues/BookingSearch/selectCity';
import AboutUs from '../Components/Profile/DrawerMenu/about';
import DownloadInvoice from '../Components/Booking/History/downloadInvoice';
import SelectBookingForActivity from '../Components/ReusableComponents/Modals/SelectBookingForActivity';
// import BookingSchduleView from '../Components/Booking/CheckAvailability/BookingSchedul/BookingSchduleView';
import CheckAvailabilityModal from '../Components/Booking/CheckAvailability/CheckAvailabilityModal';
import CheckTimerModal from '../Components/Booking/CheckAvailability/CheckTimerModal';
import AFANotAvailableModal from '../Components/Booking/CheckAvailability/AFANotAvailableModal';
import AFAInSufficentModal from '../Components/Booking/CheckAvailability/AFAInSufficentModal';
import RefundPolicyActivity from '../Components/Booking/ActivityPage/RefundPolicy';
import OpenWeb from '../Components/Dashboard/OpenWeb';
import ActivityCreateModal from '../Components/Booking/CreateActivity/ActivityCreateModal';
import AskLocation from '../Components/Dashboard/ChangeLocation/AskLocationModal/AskLocation';

import TopupSuccess from '../Components/Wallet/TopupSuccess';
import Redeem from '../Components/Deals/Redeem/Redeem';
import RedeemDetails from '../Components/Deals/Redeem/RedeemDetails';
import VoucherDetails from '../Components/Deals/Redeem/VoucherDetails';
import NoPointsModal from '../Components/Deals/Redeem/NoPointsModal';
import Deals from '../Components/Deals/Deals/Deals';
import VenueDetails from '../Components/Deals/Deals/VenueDetails';
import SportsDetails from '../Components/Deals/Deals/SportsDetails';
import Insurance from '../Components/Booking/Insurance/Insurance';
import SelectCountryModal from '../Components/Booking/Insurance/SelectCountryModal';
import MyPoints from '../Components/MyPoints/MyPoints';
import EarnPoints from '../Components/EarnPoints/EarnPoints';
import EarnedDetails from '../Components/EarnPoints/EarnedDetails';
import ToEarnDetails from '../Components/EarnPoints/ToEarnDetails';
import ActiveLevels from '../Components/MyPoints/ActiveLevels';
import VouchersListModal from '../Components/Booking/CheckAvailability/BookingSummary/VouchersListModal/VouchersListModal';
import Activities from '../Components/Profile/Activities/Activities';
import Info from '../Components/Booking/SearchVenues/VenueInfo/Info/Info';
import SharedView from '../Components/Shared/SharedView';
import Shared from '../Components/Shared/Shared';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {updatePin} from '../Components/Services/WalletApi';
import PaymentOptionsModal from '../Components/ReusableComponents/Modals/PaymentOptionsModal/PaymentOptionsModal';

const Stack = createStackNavigator();

function backButtonHandler() {
  return true;
}
BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

export const DashboardStack = () => {
  const insets = useSafeAreaInsets();
  const greeting = authStore(state => state?.greeting?.greeting);

  return (
    <Stack.Navigator
      initialRouteName={greeting ? 'Tabs' : 'SetupGreeting'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Tabs"
        component={BottomTabs}
        options={{headerShown: false}}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookingSearch"
        component={BookingSearch}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SelectSport"
        component={SelectSport}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SearchLocation"
        component={SearchLocation}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResults}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="VenuInfo"
        component={VenuInfo}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Info"
        component={Info}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Shared"
        component={Shared}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SharedView"
        component={SharedView}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="CheckAvailability"
        component={CheckAvailability}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookSlot"
        component={BookSlot}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookingSummary"
        component={BookingSummary}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmation}
        initialParams={{space: insets}}
      />
      {/* <Stack.Screen
        name="CreateActivity"
        component={CreateActivity}
        initialParams={{space: insets}}
      /> */}
      <Stack.Screen
        name="SetupGreeting"
        component={SetupGreeting}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Options"
        component={Options}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SelectSports"
        component={SelectSports}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocation}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivitySearch"
        component={ActivitySearch}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SearchingActivity"
        component={SearchActivity}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivityFilter"
        component={ActivityFilter}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookingHistory"
        component={BookingHistory}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SingleUpcoming"
        component={SingleUpcoming}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ChangeLocation"
        component={ChangeLocation}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="DashboardSearch"
        component={DashboardSearch}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="VenueFilter"
        component={VenueFilter}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="QRscanner"
        component={QRscanner}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="RefundPolicy"
        component={RefundPolicy}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="WalletEmailVerification"
        component={WalletEmailVerification}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="WalletActivatedGreeting"
        component={WalletActivatedGreeting}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SetUpPin"
        component={SetUpPin}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="UpdatePin"
        component={UpdatePin}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="PinSuccess"
        component={PinSuccess}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ConfirmPin"
        component={ConfirmPin}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="TopUp"
        component={TopUp}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="TopupSuccess"
        component={TopupSuccess}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetail}
        initialParams={{space: insets}}
      />
      {/* <Stack.Screen
        name="ActivityPage"
        component={ActivityPage}
        initialParams={{space: insets}}
      /> */}
      <Stack.Screen
        name="WalletTransaction"
        component={WalletTransaction}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="MyTransactions"
        component={MyTransactions}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Invite"
        component={Invite}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="MyActivity"
        component={MyActivity}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivityHost"
        component={ActivityHost}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="AddCoHost"
        component={AddCoHost}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ReserveSlot"
        component={ReserveSlot}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Venue"
        component={Venues}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Preferences"
        component={Preferences}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SupportRaiseTicket"
        component={SupportRaiseTicket}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Points"
        component={Points}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Earn"
        component={Earn}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="PinVerification"
        component={PinVerification}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="BookingSchedule"
        component={BookingScheduleView}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="PaymentLoading"
        component={PaymentLoading}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ZendeskChat"
        component={ZendeskChat}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ForgotPin"
        component={ForgotPin}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SelectState"
        component={SelectState}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SelectCity"
        component={SelectCity}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="DownloadInvoice"
        component={DownloadInvoice}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivityPage"
        component={ActivityPage}
        options={{headerShown: false}}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="RefundPolicyActivity"
        component={RefundPolicyActivity}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="OpenWeb"
        component={OpenWeb}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="MyPoints"
        component={MyPoints}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="EarnPoints"
        component={EarnPoints}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ToEarnDetails"
        component={ToEarnDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="EarnedDetails"
        component={EarnedDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActiveLevels"
        component={ActiveLevels}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Activities"
        component={Activities}
        initialParams={{space: insets}}
      />
      <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
        <Stack.Screen
          name="SelectCountryModal"
          component={SelectCountryModal}
          initialParams={{space: insets}}
        />
        <Stack.Screen
          name="SelectBookingForActivity"
          component={SelectBookingForActivity}
          initialParams={{space: insets}}
        />

        <Stack.Screen
          name="CheckAvailabilityModal"
          component={CheckAvailabilityModal}
        />
        <Stack.Screen name="CheckTimerModal" component={CheckTimerModal} />
        <Stack.Screen
          name="AFANotAvailableModal"
          component={AFANotAvailableModal}
        />
        <Stack.Screen
          name="AFAInSufficentModal"
          component={AFAInSufficentModal}
        />
        <Stack.Screen
          name="ActivityCreateModal"
          component={ActivityCreateModal}
        />
        <Stack.Screen
          name="AskLocation"
          component={AskLocation}
          initialParams={{space: insets}}
        />
        <Stack.Screen name="NoPointsModal" component={NoPointsModal} />
        <Stack.Screen name="VouchersListModal" component={VouchersListModal} />
        <Stack.Screen
          name="PaymentOptionsModal"
          component={PaymentOptionsModal}
        />
      </Stack.Group>

      <Stack.Screen
        name="Redeem"
        component={Redeem}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="RedeemDetails"
        component={RedeemDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="VoucherDetails"
        component={VoucherDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Deals"
        component={Deals}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="VenueDetails"
        component={VenueDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="SportsDetails"
        component={SportsDetails}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="Insurance"
        component={Insurance}
        initialParams={{space: insets}}
      />
    </Stack.Navigator>
  );
};

export const ActivityStack = () => {
  const insets = useSafeAreaInsets();
  const greeting = authStore(state => state?.greeting?.greeting);

  return (
    <Stack.Navigator
      initialRouteName={'CreateActivity'}
      screenOptions={
        Platform.OS === 'ios'
          ? {headerShown: false, gestureEnabled: false}
          : {headerShown: false}
      }>
      <Stack.Screen
        name="CreateActivity"
        component={CreateActivity}
        options={{headerShown: false}}
        initialParams={{space: insets}}
      />
      <Stack.Screen
        name="ActivitySearch"
        component={ActivitySearch}
        options={{headerShown: false}}
        initialParams={{space: insets}}
      />

      <Stack.Screen
        name="ActivityPage"
        component={ActivityPage}
        options={{headerShown: false}}
        initialParams={{space: insets}}
      />
    </Stack.Navigator>
  );
};

export default () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider style={{backgroundColor: 'white'}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={DashboardStack}
            options={{
              headerShown: false,
            }}
            initialParams={{space: insets}}
          />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
  // return (
  //   <SafeAreaProvider>
  //     {/* <NavigationContainer ref={navigationRef}> */}
  //     <Drawer.Navigator
  //       drawerStyle={{width: '70%'}}
  //       drawerContent={props => <Drawerr {...props} />}>
  //       <Drawer.Screen
  //         name="Home"
  //         component={DashboardStack}
  //         options={{hearderShown: false}}
  //       />
  //     </Drawer.Navigator>
  //     {/* </NavigationContainer> */}
  //   </SafeAreaProvider>
  // );
};
