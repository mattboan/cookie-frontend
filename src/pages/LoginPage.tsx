import { useState } from "react"
import { Input } from "../comps/Input"
import { Button } from "../comps/Button"
import { setToken } from "../utils/token"
import api from "../utils/api"
import { SyncLoader } from "react-spinners"
import { useNavigate } from "react-router-dom"


export const LoginPage = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);


    const handleLogin =async  () => {
        try {
            setError("");
            setLoading(true);            

            const res = await api.post("/auth/login", {
                username,
                password
            });

            if (res.status !== 200) {
                throw new Error("Failed to login.")
            }

            setToken(res.data.access_token);

            navigate("/home");
        } catch (err) {
            console.log(err)
            setError("Failed to login.")
        }

        setLoading(false);
    }

    return(
        <div className="login-page">
            <div className="login-form">
                <img src="/cookie-monster.webp" alt="cookie" />

                <Input label="Username" value={username} setValue={setUsername} type="text" placeholder="" />
                <Input label="Password" value={password} setValue={setPassword} type="password" placeholder=""/>
                <Button onClick={handleLogin}>
                    Login
                </Button>

                <div className="login-form-footer">
                    {error && <div className="error">{error}</div>}
                    {loading && <SyncLoader color="#fff" size={10}/>}
                </div>
            </div>

            <div className="footer">
                For cookie. From void.
            </div>
        </div>
    )


}