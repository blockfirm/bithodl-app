import { StackNavigator } from 'react-navigation';

import SplashView from './views/SplashView';
import HomeView from './views/HomeView';
import WelcomeView from './views/WelcomeView';
import RecoveryPhraseView from './views/RecoveryPhraseView';
import ConfirmRecoveryPhraseView from './views/ConfirmRecoveryPhraseView';
import WalletCreatedView from './views/WalletCreatedView';
import RecoverWalletView from './views/RecoverWalletView';
import DisclaimerView from './views/DisclaimerView';

import NewAddressView from './views/address/NewAddressView';
import AddressCreatedView from './views/address/AddressCreatedView';
import AddressFundedView from './views/address/AddressFundedView';
import AddressLockedView from './views/address/AddressLockedView';

import NewTransactionView from './views/transaction/NewTransactionView';
import ConfirmTransactionView from './views/transaction/ConfirmTransactionView';
import TransactionSentView from './views/transaction/TransactionSentView';

import SettingsView from './views/settings/SettingsView';
import AboutView from './views/settings/AboutView';
import TermsAndConditionsView from './views/settings/TermsAndConditionsView';
import ServiceUrlView from './views/settings/ServiceUrlView';
import BitcoinUnitView from './views/settings/BitcoinUnitView';
import ShowRecoveryPhraseView from './views/settings/ShowRecoveryPhraseView';

import DismissableStackNavigator from './DismissableStackNavigator';

const MainCardNavigator = StackNavigator({
  Splash: { screen: SplashView },
  Welcome: { screen: WelcomeView },
  RecoverWallet: { screen: RecoverWalletView },
  RecoveryPhrase: { screen: RecoveryPhraseView },
  ConfirmRecoveryPhrase: { screen: ConfirmRecoveryPhraseView },
  WalletCreated: { screen: WalletCreatedView },
  Disclaimer: { screen: DisclaimerView },
  Home: { screen: HomeView },
  NewAddress: { screen: NewAddressView },
  AddressCreated: { screen: AddressCreatedView },
  AddressFunded: { screen: AddressFundedView },
  AddressLocked: { screen: AddressLockedView },
  NewTransaction: { screen: NewTransactionView },
  ConfirmTransaction: { screen: ConfirmTransactionView },
  TransactionSent: { screen: TransactionSentView }
}, {
  headerMode: 'screen'
});

const SettingsCardNavigator = DismissableStackNavigator({
  Settings: { screen: SettingsView },
  About: { screen: AboutView },
  TermsAndConditions: { screen: TermsAndConditionsView },
  ServiceUrl: { screen: ServiceUrlView },
  BitcoinUnit: { screen: BitcoinUnitView },
  ShowRecoveryPhrase: { screen: ShowRecoveryPhraseView }
}, {
  headerMode: 'float'
});

const ModalNavigator = DismissableStackNavigator({
  TermsAndConditionsModal: { screen: TermsAndConditionsView }
}, {
  headerMode: 'float'
});

const MainModalNavigator = StackNavigator({
  MainCardNavigator: { screen: MainCardNavigator },
  SettingsCardNavigator: { screen: SettingsCardNavigator },
  ModalNavigator: { screen: ModalNavigator }
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default MainModalNavigator;
