import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GoogleAuthSuccess = () => {
    const params=useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.token
        console.log("your coming token is-->",token)
        if (token) {
            try {
                // Decode JWT to get userRole
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const decodedToken = JSON.parse(jsonPayload);
                console.log("Decoded token:", decodedToken);
                
                const userRole = decodedToken.userRole;
                console.log("User role from token:", userRole);
                
                // Save BOTH token and role to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('role', userRole);
                
                // Verify data was saved
                console.log("Saved to localStorage - token:", !!localStorage.getItem('token'), "role:", localStorage.getItem('role'));
                
                // Small delay to ensure localStorage is written before navigating
                setTimeout(() => {
                    if (userRole === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (userRole === 'manage_bank') {
                        navigate('/manage-blood-bank');
                    } else if (userRole === 'find_blood') {
                        navigate('/');
                    } else {
                        navigate('/');
                    }
                }, 100);
                
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate('/');
            }
        } else {
            navigate('/login');
        }
    }, [params, navigate]);

    return <div>Authenticating... Please wait.</div>;
};

export default GoogleAuthSuccess;