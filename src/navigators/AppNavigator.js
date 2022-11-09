import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import StackViewStyleInterpolator from 'react-navigation-stack/src/views/StackView/StackViewStyleInterpolator';
import {Drawer} from 'app/navigators/components';
// auth screens
import Welcome from '../screens/auth/Welcome';
import SignUp from '../screens/auth/SignUp';
import Login from '../screens/auth/Login';
import ConfirmEmail from '../screens/auth/ConfirmEmail';
import CreatePin from '../screens/auth/CreatePin';
import ConfirmPin from '../screens/auth/ConfirmPin';
import NewPassword from '../screens/auth/NewPassword';

//end  auth screens
import CreateBusiness from 'app/screens/CreateBusiness';
import EnterPin from 'app/screens/EnterPin';

import WelcomeSlider from 'app/screens/WelcomeSlider';

import Wallets from 'app/screens/Wallets';
// import Marketplace from 'app/screens/Marketplace'
import Club from 'app/screens/Club';
import Discover from 'app/screens/Discover';
import Cashier from 'app/screens/Cashier';

import Wallet from 'app/screens/Wallet';
import AddCreditCard from 'app/screens/AddCreditCard';
import SelectCreditCard from 'app/screens/SelectCreditCard';
import SelectCCPurchaseType from 'app/screens/SelectCCPurchaseType';
import Loyalties from 'app/screens/Loyalties';
import TransferAmount from 'app/screens/TransferAmount';
import Bill from 'app/screens/Bill';
import CreditCardSubscription from 'app/screens/CreditCardSubscription';
import RoomScanner from 'app/screens/RoomScanner';
import ConfirmExchange from 'app/screens/ConfirmExchange';
import CreditCardAmount from 'app/screens/CreditCardAmount';
import QRCodeScreen from 'app/screens/QRCodeScreen';
import AccountScreen from 'app/screens/AccountScreen';
import ChangePassword from 'app/screens/ChangePassword';
import Loyalty from 'app/screens/Loyalty';
import CryptoReload from 'app/screens/CryptoReload';
import TransferOrRequest from 'app/screens/TransferOrRequest';
import TransferScanner from 'app/screens/TransferScanner';
import ReloadWallet from 'app/screens/ReloadWallet';
import CashReload from 'app/screens/CashReload';
import ConfirmTransfer from 'app/screens/ConfirmTransfer';
import ConfirmCCPurchase from 'app/screens/ConfirmCCPurchase';
import Business from 'app/screens/Business';
import Shop from 'app/screens/Shop';
import AddBank from 'app/screens/AddBank';
import AddBankAccount from 'app/screens/AddBankAccount';
import BankInfo from 'app/screens/BankInfo';
import Promotion from 'app/screens/Promotion';
import Product from 'app/screens/Product';
import ShoppingCart from 'app/screens/ShoppingCart';
import GiftCardScreen from 'app/screens/GiftCardScreen';
import InviteFriends from 'app/screens/InviteFriends';
import KYC from 'app/screens/KYC';
import KYCPending from 'app/screens/KYCPending';
import KYCUpload from 'app/screens/KYCUpload';
import KYCFinish from 'app/screens/KYCFinish';
import KYCSuccess from 'app/screens/KYCSuccess';
import KYCPhone from 'app/screens/KYCPhone';
import Notifications from 'app/screens/Notifications';
import Exchange from 'app/screens/Exchange';
import ChangePin from 'app/screens/ChangePin';
import NewPin from 'app/screens/NewPin';
import ConfirmNewPin from 'app/screens/ConfirmNewPin';
import DefaultCurrency from 'app/screens/DefaultCurrency';
import Referrals from 'app/screens/Referrals';
import MembershipCard from 'app/screens/MembershipCard';
import Ticketing from 'app/screens/Ticketing';
import TransferWithAmount from 'app/screens/TransferWithAmount';
import ConfirmExchangeAndTransfer from 'app/screens/ConfirmExchangeAndTransfer';
import MembershipCards from 'app/screens/MembershipCards';
import Transactions from 'app/screens/Transactions';
import Withdrawal from 'app/screens/Withdrawal';
import WithdrawalAmount from 'app/screens/WithdrawalAmount';
import WithdrawalConfirmation from 'app/screens/WithdrawalConfirmation';
import BankAccounts from 'app/screens/BankAccounts';
import EditBankAccount from 'app/screens/EditBankAccount';
import SelectPayment from 'app/screens/SelectPayment';
import AddPaymentMethod from 'app/screens/AddPaymentMethod';
import TransferAmountFromScanner from 'app/screens/TransferAmountFromScanner';
import KYCDeclined from 'app/screens/KYCDeclined';
import CryptoAmount from 'app/screens/CryptoAmount';

const PinStack = createStackNavigator(
  {EnterPin: {screen: EnterPin}},
  {headerMode: 'none'},
);

const WelcomeStack = createStackNavigator(
  {WelcomeSlider: {screen: WelcomeSlider}},
  {headerMode: 'none'},
);

const AuthStack = createStackNavigator(
  {
    //

    Welcome: {screen: Welcome},
    SignUp: {screen: SignUp},
    CreateBusiness: {screen: CreateBusiness},
    Login: {screen: Login},
    ConfirmEmail: {screen: ConfirmEmail},
    CreatePin: {screen: CreatePin},
    ConfirmPin: {screen: ConfirmPin},
    NewPassword: {screen: NewPassword},
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      screenInterpolator: sceneProps =>
        StackViewStyleInterpolator.forHorizontal(sceneProps),
    }),
  },
);

const HomeStack = createStackNavigator(
  {
    Wallets: {screen: Wallets},
    Cashier: {screen: Cashier},
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      screenInterpolator: () => StackViewStyleInterpolator.forNoAnimation(),
    }),
  },
);

const AppStack = createStackNavigator(
  {
    HomeStack: {screen: HomeStack},
    Loyalties: {screen: Loyalties},
    TransferOrRequest: {screen: TransferOrRequest},
    TransferScanner: {screen: TransferScanner},
    ChangePassword: {screen: ChangePassword},
    QRCodeScreen: {screen: QRCodeScreen},
    CreditCardSubscription: {screen: CreditCardSubscription},
    TransferAmount: {screen: TransferAmount},
    SelectCCPurchaseType: {screen: SelectCCPurchaseType},
    CreditCardAmount: {screen: CreditCardAmount},
    AccountScreen: {screen: AccountScreen},
    RoomScanner: {screen: RoomScanner},
    SelectCreditCard: {screen: SelectCreditCard},
    ReloadWallet: {screen: ReloadWallet},
    ConfirmCCPurchase: {screen: ConfirmCCPurchase},
    Bill: {screen: Bill},
    AddBank: {screen: AddBank},
    AddBankAccount: {screen: AddBankAccount},
    BankInfo: {screen: BankInfo},
    CashReload: {screen: CashReload},
    CryptoReload: {screen: CryptoReload},
    Wallet: {screen: Wallet},
    AddCreditCard: {screen: AddCreditCard},
    Business: {screen: Business},
    Shop: {screen: Shop},
    Promotion: {screen: Promotion},
    KYCUpload: {screen: KYCUpload},
    KYCFinish: {screen: KYCFinish},
    Loyalty: {screen: Loyalty},
    Product: {screen: Product},
    ShoppingCart: {screen: ShoppingCart},
    ConfirmTransfer: {screen: ConfirmTransfer},
    GiftCardScreen: {screen: GiftCardScreen},
    InviteFriends: {screen: InviteFriends},
    KYC: {screen: KYC},
    KYCPending: {screen: KYCPending},
    KYCSuccess: {screen: KYCSuccess},
    KYCPhone: {screen: KYCPhone},
    KYCDeclined: {screen: KYCDeclined},
    Notifications: {screen: Notifications},
    ConfirmExchange: {screen: ConfirmExchange},
    Exchange: {screen: Exchange},
    ChangePin: {screen: ChangePin},
    NewPin: {screen: NewPin},
    ConfirmNewPin: {screen: ConfirmNewPin},
    DefaultCurrency: {screen: DefaultCurrency},
    Referrals: {screen: Referrals},
    MembershipCard: {screen: MembershipCard},
    Ticketing: {screen: Ticketing},
    Browse: {screen: Club},
    TransferWithAmount: {screen: TransferWithAmount},
    ConfirmExchangeAndTransfer: {screen: ConfirmExchangeAndTransfer},
    MembershipCards: {screen: MembershipCards},
    Transactions: {screen: Transactions},
    Withdrawal: {screen: Withdrawal},
    WithdrawalAmount: {screen: WithdrawalAmount},
    WithdrawalConfirmation: {screen: WithdrawalConfirmation},
    BankAccounts: {screen: BankAccounts},
    EditBankAccount: {screen: EditBankAccount},
    SelectPayment: {screen: SelectPayment},
    AddPaymentMethod: {screen: AddPaymentMethod},
    Discover: {screen: Discover},
    TransferAmountFromScanner: {screen: TransferAmountFromScanner},
    CryptoAmount: {screen: CryptoAmount},
  },
  {
    headerMode: 'none',
    transitionConfig: () => ({
      screenInterpolator: sceneProps =>
        StackViewStyleInterpolator.forHorizontal(sceneProps),
    }),
    initialRouteName: 'HomeStack',
  },
);

const DrawerNavigator = createDrawerNavigator(
  {AppStack},
  {contentComponent: Drawer},
);

const AppNavigator = createSwitchNavigator(
  {
    Auth: AuthStack,
    App: DrawerNavigator,
  },
  {initialRouteName: 'Auth'},
);

export default createAppContainer(AppNavigator);
