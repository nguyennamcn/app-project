import {https} from "./config"

export const adornicaServ={
    getProductList: () => {
        return https.get("pokemon/ditto");
    },
    getDetailProduct:(maSp) =>{
        return https.get(`/api/v1/products`)
    }
}