import {https} from "./config"

export const adornicaServ={
    getProductList: () => {
        return https.get("pokemon/ditto");
    },
    getDetailProduct:() =>{
        return https.get(`/api/v1/products/JW0001`)
    }
}