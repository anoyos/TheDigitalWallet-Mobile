export default function WalletTabViews({ listSelection, firstScreen, secondScreen, thirdScreen }) {
  if (listSelection === 0) return (firstScreen)
  if (listSelection === 1) return (secondScreen)
  return (thirdScreen)
}
