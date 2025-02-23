import CommonListing from "@/app/components/CommonListing";
import { getAllAdminProducts } from "@/services/product";



export default async function AdminAllProducts(){

    const allAdminProducts = await getAllAdminProducts()

    return <CommonListing
    data={allAdminProducts && allAdminProducts.data}
    />
    
}






