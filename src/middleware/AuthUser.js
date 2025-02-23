// import jwt from 'jsonwebtoken'



// export const dynamic = "force-dynamic";


// const AuthUser = async (req) => {

//     const token = req.headers.get('Authorization')?.split(' ')[1];

//     if (!token) return false;

//     console.log(token);
//     try {
//         const extractAuthUserInfo = await jwt.verify(token, "default_secret_key");
//         if (extractAuthUserInfo) return extractAuthUserInfo;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };

// export default AuthUser;
import jwt from 'jsonwebtoken';

export const dynamic = "force-dynamic";

const AuthUser = async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("❌ Token không hợp lệ hoặc không có token");
            return false;
        }

        // Cắt bỏ chữ "Bearer " để lấy token
        const token = authHeader.split(' ')[1];

        // Giải mã token
        const extractAuthUserInfo = await jwt.verify(token, "default_secret_key");

        if (!extractAuthUserInfo) {
            console.error("❌ Token không hợp lệ hoặc hết hạn");
            return false;
        }

        return extractAuthUserInfo;
    } catch (error) {
        console.error("❌ Lỗi xác thực:", error.message);
        return false;
    }
};

export default AuthUser;
