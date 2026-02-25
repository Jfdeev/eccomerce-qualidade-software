import { createContext, useContext, useReducer, useEffect } from 'react'

/**
 * Context do Carrinho de Compras.
 * 
 * Usa useReducer para gerenciamento de estado previsível,
 * seguindo o padrão Flux/Redux de ações e reducer.
 */

const CartContext = createContext()

// Action types
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
}

// Reducer para gerenciar o estado do carrinho
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      )

      if (existingIndex >= 0) {
        const newItems = [...state.items]
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity,
        }
        return { ...state, items: newItems }
      }

      return { ...state, items: [...state.items, action.payload] }
    }

    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.product_id === action.payload.product_id &&
              item.size === action.payload.size &&
              item.color === action.payload.color
            )
        ),
      }

    case ACTIONS.UPDATE_QUANTITY: {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item.product_id === action.payload.product_id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              )
          ),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.product_id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] }

    case ACTIONS.LOAD_CART:
      return { ...state, items: action.payload }

    default:
      return state
  }
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('fashion-store-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: ACTIONS.LOAD_CART, payload: items })
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e)
      }
    }
  }, [])

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('fashion-store-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item) => {
    dispatch({ type: ACTIONS.ADD_ITEM, payload: item })
  }

  const removeItem = (productId, size, color) => {
    dispatch({
      type: ACTIONS.REMOVE_ITEM,
      payload: { product_id: productId, size, color },
    })
  }

  const updateQuantity = (productId, size, color, quantity) => {
    dispatch({
      type: ACTIONS.UPDATE_QUANTITY,
      payload: { product_id: productId, size, color, quantity },
    })
  }

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART })
  }

  const cartTotal = state.items.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  )

  const cartCount = state.items.reduce(
    (count, item) => count + item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}
