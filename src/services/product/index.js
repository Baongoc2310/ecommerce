

// //add a new product service

// export const addNewProduct = async(formData)=>{
//     try {
//         const response = await fetch('/api/admin/add-product',{
//             method : 'POST',
//             headers : {
//                 'Content-Type': 'application/json',
//                 Authorization :    `Bearer ${Cookies.get('token')}`
//             },
//             body : JSON.stringify(formData)
//         })
//         const data = await response.json();

//         return data; 
//     }catch(error){
//         console.log(error)
//     }
// }

import Cookies from 'js-cookie';


export const addNewProduct = async (formData) => {
    try {
        const response = await fetch('/api/admin/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.text(); // Tránh lỗi khi không phải JSON
            console.error('API Error:', errorData);
            return { success: false, message: `Error: ${response.status} ${response.statusText}` };
        }

        const data = await response.json();
        console.log("Product Added Response:", data); // Debug log
        return data;
    } catch (error) {
        console.error("Fetch Error:", error);
        return { success: false, message: "An error occurred while adding the product." };
    }
};

export const getAllAdminProducts = async () => {
    try {

        const res = await fetch('http://localhost:3000/api/admin/all-products', {
            method: 'GET',
            cache: 'no-store'
        })
        const data = await res.json()

        return data;

    } catch (error) {
        console.log(error)
    }
}

export const updateAProduct = async (formData) => {
    try {
        const res = await fetch('/api/admin/update-product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json()

        return data;

    } catch (error) {
        console.log(error)
    }
}

export const deleteAProduct = async (id) => {
    try {

        const res = await fetch(`/api/admin/delete-product?id=${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`
            }
        })
        const data = await res.json()

        return data;

    } catch (error) {
        console.log(error);
    }
}

export const productByCategory = async (id) => {
    try {

        const res = await fetch(`http://localhost:3000/api/admin/product-by-category?id=${id}`, {
            method: 'GET',
            cache: 'no-store'
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const productById = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/api/admin/product-by-id?id=${id}`, {
            method: 'GET',
            cache: 'no-store'
        })
        const data = await res.json()

        return data;
    } catch (error) {
        console.log(error);
    }
}

// export const productById = async (id) => {
//     try {
//         if (!id) {
//             console.error("❌ productById Error: Missing product ID");
//             return { success: false, message: "Product ID is required" };
//         }

//         console.log(`🔍 Fetching product with ID: ${id}`);

//         const res = await fetch(`http://localhost:3000/api/admin/product-by-id?id=${id}`, {
//             method: "GET",
//             cache: "no-store",
//         });

//         if (!res.ok) {
//             console.error(`❌ API Error: ${res.status} ${res.statusText}`);
//             return { success: false, message: `API error: ${res.statusText}` };
//         }

//         const data = await res.json();
//         console.log("✅ API Response:", data);

//         return data;
//     } catch (error) {
//         console.error("❌ Fetch error:", error);
//         return { success: false, message: "Failed to fetch product" };
//     }
// };
