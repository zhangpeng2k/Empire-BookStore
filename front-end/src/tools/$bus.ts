import { EventEmitter } from 'events'

interface BusState {
  userdata: {
    email: string;
    first_name?: string;
    last_name?: string;
    id?: string;

  };
  cart: any[];
  cartCount: number;
}

class $bus extends EventEmitter {
  state: BusState;
  constructor() {
    super();
    this.state = {
      userdata: {
        last_name: '',
        first_name: '',
        id: '',
        email: '',
      },
      cart: [],
      cartCount: 0,
    };
  }
  setUserData(data): void {
    this.state.userdata = data;
    this.emit('userdata', this.state.userdata);
  }
  addToCart(data2: any): void {
    let data = data2
    let cartdata = this.state.cart

    if (cartdata.length === 0) {
    
      if (data.quantity === undefined) {
        data.quantity = 1;
      }
      cartdata.push(data);
    } else {
      let flag = false;
      cartdata.map((item, index) => {
        if (item._id === data._id) {
          if (data.quantity === undefined) {
            data.quantity = 1;
          }
          item.quantity += data.quantity;
          flag = true;
        }
      })
      if (!flag) {
        if (data.quantity === undefined) {
          data.quantity = 1;
        }
        cartdata.push(data);
      }
    }

    this.state.cart = cartdata;

    console.log(this.state.cart);
    this.setCartCount(this.state.cart.length);
    this.emit('cart', this.state.cart);
    localStorage.setItem('cart', JSON.stringify(cartdata));
  }
  // setCart(data): void {
  //   this.state.cart = data;
  //   this.setCartCount(this.state.cart.length);
  //   this.emit('cart', this.state.cart);
  //   localStorage.setItem('cart', JSON.stringify(data));
  // }
  setCart(data): void {
    this.state.cart = data;
    // this.setCartCount(this.state.cart.length);  // replace this line
    this.setCartCount(
      this.state.cart.reduce((total, item) => total + item.quantity, 0)
    );
    this.emit('cart', this.state.cart);
    localStorage.setItem('cart', JSON.stringify(data));
  }
  



  setCartCount(count): void { // 添加 setCartCount 方法
    this.state.cartCount = count;
    this.emit('cartCount', this.state.cartCount);
  }
}

export default new $bus();
