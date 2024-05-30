import {https} from "../../service/config"

export const productServ={
    getProductList: () => {
        return https.get("/api/v1/products?categoryType=JEWELRY");
    },

}