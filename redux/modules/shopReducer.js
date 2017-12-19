import {updateQuantity} from "./helpers/helpers";

const SYNC = 'SYNC'
const LOAD_PRODUCTS = 'LOAD_PRODUCTS'
const ADD_TO_CART = 'ADD_TO_CART'
const CHANGE_QUANTITY = 'CHANGE_QUANTITY'
const REMOVE_ITEM = 'REMOVE_ITEM'
const CLEAR_CART = 'CLEAR_CART'

const saveItems = (items) => localStorage.setItem('cart', JSON.stringify(items));
const getCartItems = () => {
    if (!process.browser) return []

    try {
        const data = localStorage.getItem("cart");
        console.log(`getItems`)
        console.dir(data)
        if (!data) {
            return []
        }
        return JSON.parse(data)
    } catch (e) {
        return []
    }
}

const persistCartItems = (state) => {
    process.browser && saveItems(state.cart)
    return state
}

const initialState = {
    loading: false,
    error: false,
    products: null,
    cart: []
}

export default function reducer(state = initialState,
                                action = {}) {
    switch (action.type) {
        case SYNC: {
            return {
                ...state,
                cart: getCartItems()
            }
        }

        case LOAD_PRODUCTS:{
            return {
                ...state,
                products: action.payload.productsList
            }
        }

        case ADD_TO_CART: {
            const {id} = action.payload
            const existingItem = state.cart.find(item => item.id === id);
            const cart = state.cart.filter((item) => item.id !== id);
            return persistCartItems({
                ...state,
                cart: !existingItem ? [...cart, action.payload] : [...cart, {
                    ...action.payload,
                    quantity: existingItem.quantity + 1
                }]
            })
        }

        case CHANGE_QUANTITY: {
            const {id, quantity} = action.payload
            return persistCartItems({
                ...state,
                cart: updateQuantity(id,state.cart,quantity)
            })
        }

        case REMOVE_ITEM:{
            const {id} = action.payload
            const cart = state.cart.filter(item => item.id !== id);
            return persistCartItems({
                ...state,
                cart: [...cart]
            })
        }

        case CLEAR_CART: {
            return persistCartItems({
                ...state,
                cart: []
            })
        }

        default:
            return state
    }
}

export const loadProducts = productsList => ({
    type: LOAD_PRODUCTS,
    payload: {
        productsList
    }
})

export const addToCart = item => ({
    type: ADD_TO_CART,
    payload: {
        ...item,
        quantity: 1
    }
})

export const changeQuantity = (id, quantity) => ({
    type: CHANGE_QUANTITY,
    payload: {
        id,
        quantity
    }
})

export const removeItem = id =>({
    type: REMOVE_ITEM,
    payload:{
        id
    }
})

export const clearCart = ()=> ({
    type: CLEAR_CART
})


export const sync = ()=> ({
    type: SYNC
})


export const getProducts = state => state.shop && state.shop.products

export const getCartAmount = state => state.shop && state.shop.cart && state.shop.cart.reduce((prev, curr) => (curr.quantity && (prev + curr.quantity)), 0)

export const getCart = state => state.shop && state.shop.cart

export const getSubTotal = state => state.shop && state.shop.cart.map(item => item.price * item.quantity).reduce((prev, curr) => (curr && (prev + curr)), 0)