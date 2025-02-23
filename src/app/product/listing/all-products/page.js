import CommonListing from "@/app/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";


export default async function AllProducts(){

    const getAllProducts = await getAllAdminProducts()

    return <CommonListing data={getAllProducts && getAllProducts.data}/>
}