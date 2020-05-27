import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

    // matriz iniciada com zero para receber o objeto produto
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();



  constructor() { }

  addToCart(theCartItem: CartItem){

      //checar se nós já temos o item no nosso carrinho
      let alreadyExistsInCart: boolean = false;
      let existingCartItem: CartItem = undefined;

      if(this.cartItems.length > 0) {
      // e entao encontrar o item com base no id

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);
     
    }



      // checar se nos encontramos ele.
      alreadyExistsInCart = (existingCartItem != undefined);



      if(alreadyExistsInCart){
        // incrementar a quantidade
        existingCartItem.quantity++;
      }
      else{
        // apenas adicionar o item no array
        this.cartItems.push(theCartItem);
      }

      // calcular preço total do carrinho e quantidade total.
      this.computeCartTotals();


  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity*currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values... all subscribers will receive the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subtotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, 
                  quantity=${tempCartItem.quantity}, 
                  unitPrice=${tempCartItem.unitPrice}, 
                  subTotalPrice=${subtotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');

  }


  decrementQuantity(theCartItem: CartItem) {
      theCartItem.quantity--;
    
      if (theCartItem.quantity === 0) {
        this.remove(theCartItem);
      }
      else{
        this.computeCartTotals
      }
  }
  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);
    // if found, remove the item from the array at the given index
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }



}