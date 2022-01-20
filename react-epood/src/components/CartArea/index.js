import React from 'react';
import axios from 'axios';
import styles from './CartArea.module.scss';
import Info from '../Info';
import { useCart } from '../../hooks/useCart';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function CartArea({ onClose, onRemove, items = [], opened }) {
const { cartItems, setCartItems, totalPrice } = useCart();
const [orderId, setOrderId] = React.useState(null);
const [isOrderComplete, setIsOrderComplete] = React.useState(false);
const [isLoading, setIsLoading] = React.useState(false);

const onClickOrder = async () => {
try {
    setIsLoading(true);
    const { data } = await axios.post('/orders', {
    items: cartItems,
    });
    setOrderId(data.id);
    setIsOrderComplete(true);
    setCartItems([]);

    for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    await axios.delete('/cart/' + item.id);
    await delay(1000);
    }
} catch (error) {
    alert('Error with order :(');
}
setIsLoading(false);
};

return (
<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
    <div className={styles.drawer}>
    <h2 className="d-flex justify-between mb-30">
        Корзина <img onClick={onClose} className="cu-p" src="img/deleteBlack.svg" alt="Close" />
    </h2>

    {items.length > 0 ? (
        <div className="d-flex flex-column flex">
        <div className="items flex">
            {items.map((obj) => (
            <div key={obj.id} className="cartItem d-flex align-center mb-20">
                <div
                style={{ backgroundImage: `url(${obj.imageUrl})` }}
                className="cartItemImg"></div>

                <div className="mr-20 flex">
                <p className="mb-5">{obj.title}</p>
                <b>{obj.price} euro </b>
                </div>
                <img
                onClick={() => onRemove(obj.id)}
                className="removeButton"
                src="img/deleteBlack.svg"
                alt="Remove"
                />
            </div>
            ))}
        </div>
        <div className="cartTotal">
            <ul>
            <li>
                <span>Total </span>
                <div></div>
                <b>{totalPrice} euro </b>
            </li>
            <li>
                <span>Maks 20%:</span>
                <div></div>
                <b>{(totalPrice / 100) * 20} euro </b>
            </li>
            </ul>
            <button disabled={isLoading} onClick={onClickOrder} className="greenButton">
            Get order <img src="img/arrow.svg" alt="Arrow" />
            </button>
        </div>
        </div>
    ) : (
        <Info
        title={isOrderComplete ? 'Order is done!' : 'Cart is empty'}
        description={
            isOrderComplete
            ? `Car order #${orderId} will be soon arrived to Estonia`
            : 'For order choose one or more car'
        }
        image={isOrderComplete ? 'img/done-order.png' : 'img/empty-cart.png'}
        />
    )}
    </div>
</div>
);
}
export default CartArea;
