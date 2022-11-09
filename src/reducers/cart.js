/* eslint-disable no-case-declarations */
export default function cartReducer(cart, action) {
  switch (action.type) {
    case 'addToCart':
      const newCart = [...cart]
      const checkItem = cart.filter(x => x.id === action.payload.id)
      if (!Array.isArray(checkItem) || !checkItem.length) newCart.push(action.payload)
      return newCart
    case 'increaseQuantity':
      return cart.map((item, index) => {
        if (index !== action.payload.index) return item
        const { quantity } = item
        return {
          ...item,
          quantity: quantity + 1,
        }
      })
    case 'decreaseQuantity':
      return cart.map((item, index) => {
        if (index !== action.payload.index) return item
        const { quantity } = item
        return {
          ...item,
          quantity: quantity - 1,
        }
      })
    case 'deleteFromCart':
      return cart.filter(x => x.id !== action.payload.id)
    case 'clearCart':
      return []
    default:
      return cart
  }
}
