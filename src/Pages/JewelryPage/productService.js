import {https} from "../../service/config"

export const productServ={
    getProductList: () => {
        return https.get("");
    },

}