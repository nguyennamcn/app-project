import axios from "axios"
import { BASE_URL, configHeader, https} from "../../service/config"

export const productServ={
    getItemList: () => {
        return https.get("");
    },
    getDetailItem: (itemID) => {
        return https.get(`link=${itemID}`)
    }
}