// import CommonDetails from "@/app/components/CommonDetails";
// import { productById } from "@/services/product";



// export default async function ProductDetails({params}) {
    
//     const productDetailsData = await productById(params.details);

//     console.log(productDetailsData, 'elizabeth');
    
//     return <CommonDetails item={productDetailsData && productDetailsData.data} />
    
// }

import CommonDetails from "@/app/components/CommonDetails";
import { productById } from "@/services/product";

export default async function ProductDetails({ params }) {
    // Đợi `params` trước khi sử dụng
    const { details } = await params;

    // Gọi API lấy dữ liệu sản phẩm
    const productDetailsData = await productById(details);

    console.log(productDetailsData, "elizabeth");

    return <CommonDetails item={productDetailsData?.data} />;
}

