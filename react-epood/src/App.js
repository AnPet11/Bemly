import React from 'react';
import axios from 'axios';
import Header from './components/Header';
import CartArea from './components/CartArea';
import AppContext from './context';
import Home from './allpages/Home';
import Favorites from './allpages/Favorites';
import Orders from './allpages/Orders';
import {  Route, Routes } from "react-router-dom";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
          axios.get('https://61e929d97bc0550017bc60cc.mockapi.io/cart'),
          axios.get('https://61e929d97bc0550017bc60cc.mockapi.io/favorites'),
          axios.get('https://61e929d97bc0550017bc60cc.mockapi.io/items'),
        ]);

        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Error with data ;(');
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
        await axios.delete(`https://61e929d97bc0550017bc60cc.mockapi.io/cart/${findItem.id}`);
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post('https://61e929d97bc0550017bc60cc.mockapi.io/cart', obj);
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          }),
        );
      }
    } catch (error) {
      alert('Error with adding to cart');
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://61e929d97bc0550017bc60cc.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
    } catch (error) {
      alert('Error with removing from cart');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`https://61e929d97bc0550017bc60cc.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
      } else {
        const { data } = await axios.post(
          'https://61e929d97bc0550017bc60cc.mockapi.io/favorites',
          obj,
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Something wrong with favourites list. Error');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}>
      <div className="wrapper clear">
        <CartArea
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

          <Routes>
        <Route path="" exact>
          <Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />
        </Route>
        <Route path="favorites" exact>
          <Favorites />
        </Route>

        <Route path="orders" exact>
          <Orders />
        </Route>
      </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;



/*      <div className="cartAreaShadow">
        <div className="cartArea">
          <h2 className="mb-20"> Cart </h2>

          <div className="Items">
            


            <ul>
              <li></li>
              <li></li>
            </ul>
          </div>

          <div className="cartItem d-flex align-center mb-20"> 
            <div 
              style={{backgroundImage:'url(/img/cardPics/i8.jpg)'}} className="cartItemImg"></div>

          <div className="mr-20 flex">
            
            <p className="mb-5"> i8 </p>
            <b> 77 900 euro </b>
          </div>
          <img className="deleteButton" width={16} heigh={17} src="/img/deleteBlack.svg" alt="Delete"/>
          </div>
        </div>
      </div>

      <header className="d-flex justify-between align-center p-40">
        <div className="d-flex align-center" >
        <img src = "/img/logo.png" />
          <div>
            <h3 className="text-uppercase">  Bayerische Motoren Werke </h3>
            <p className="opacity-5"> The Ultimate Driving Machine </p>
          </div>

        </div>
    <ul className= "d-flex">

          <li className="mr-30">
          <img src = "/img/cart.svg" />
            <span> 49000 euro </span>
          </li>

          <li>
          <img src = "/img/user.svg" />
          </li>
        </ul>
      </header>
      <div className = "content p-40" >

    <div className="d-flex align-center justify-between mb-40"> 
      
        <h1> All models</h1>
        <div className="search-block">
          <img width={17} heigh={17} src="/img/search.png"  alt="Search" />
          <input  placeholder="Search..."/>

        </div>
    </div>
        


        <div className="d-flex" >
        <div className="card" >
        <div className="liked">
        <img width={20} height={20} src="/img/non-liked.svg" alt="unliked"/>
        </div>
          <img width={330} heigh={246}  src="/img/cardPics/1600-2.jpg" alt="BMW" />
          <h5>1600-2, 1966 year, engine M10 I4, 4-speed manual, 2-door coupe</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 17 900 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>


        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/e12.jpg" alt="BMW" />
          <h5>E12, 1972 year, engine M10, 4-speed manual, 4-door sedan</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 16 000 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>

        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/e39.jpg" alt="BMW" />
          <h5>E39, 2001 year, engine M62, 5-speed automatic, 4-door sedan</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 9 600 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>

        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/i8.jpg" alt="BMW" />
          <h5>i8, 2016 year, engine B38K15T0, 6-speed automatic, 2-door coupe</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 77 900 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>

        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/m1.jpg" alt="BMW" />
          <h5>M1, 1979 year, engine M88/1, 5-speed manual, 2-door coupe</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 689 900 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>
        
        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/e36.jpg" alt="BMW" />
          <h5>E36 M3, 1992 year, engine S50, 5-speed manual, 2-door coupe</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 13 600 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>

        <div className="card" >
          <img width={330} heigh={246}  src="/img/cardPics/e34.jpg" alt="BMW" />
          <h5>E34, 1992 year, engine S38, 5-speed manual, 4-door sedan</h5>
          <div className="d-flex justify-between">

            <div className="d-flex flex-column">
              <span> Price </span>
              <b> 26 980 euro</b>
            </div>

              <button className="button">
                <img width={14} heigh={14}  src="/img/plus.svg" alt="Plus"/>
              </button>
          </div>
        </div>
        </div>
      </div>
    </div> */
