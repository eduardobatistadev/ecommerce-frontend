import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html', 
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {


  products: Product[] = [];
  currentCategoryId: number=1;
  previousCategoryId: number = 1;
  searchMode: boolean=false;

  // propriedades para paginação
  thePageNumber: number=1;
  thePageSize: number=5;
  theTotalElements: number=0;

  previousKeyword: string = null;
  

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
       this.listProducts();
    });

  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);


    //new search for the produdcts using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }

  handleListProducts(){
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // o simbolo + converte de string para number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');

    }
    else{
      this.currentCategoryId=1;
    }




    //
    // checar se temos um id de categorias diferente que o anterior.
    // o angular reutilizara um componente se estiver sendo visualizado no momento.
    // se tivermos um id de categoria diferente do anterior o numero de pagina será redefi-
    // nido para 1.

    if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);




  this.productService.getProductListPaginate(this.thePageNumber -1,
                                            this.thePageSize,
                                            this.currentCategoryId).subscribe(this.processResult());
  
  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
  }

}
