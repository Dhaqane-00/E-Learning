import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig'
import Input from '../components/formComponents/Input'
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import PrimaryButton from '../components/formComponents/PrimaryButton'

function Login() {
    const navigate = useNavigate();

    const { login } = useContext(AuthContext)

    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleInputChange = (e) => {

        setFormData(prev => ({
            ...prev, [e.target.name]: e.target.value
        }));

    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true)

            const status = await login(formData);

            if (status == 200) {

                navigate("/")


                toast.success("Login Successful!", {
                    position: "top-right",
                    style: {
                        background: "#1C1210",
                        color: "#E5E6E6",
                    }

                })
            }
            else {
                toast.error("Incorrect Credentials", {
                    position: "top-right",
                    style: {
                        background: "#1C1210",
                        color: "#E5E6E6",
                    }
                })
            }


        }
        catch (error) {
            console.log("Login Failed", error);
        }

        finally {
            setIsLoading(false)
        }
    };


    return (
        <div className='pt-12 sm:pb-1 bg-bgOne'>
            <div className='w-full min-h-screen bg-bgOne justify-start sm:justify-center flex flex-col gap-8'>


                {/* ---------- headline ---------- */}

                {/* <div className='w-96 mx-auto'>
    <h2 className='bg-gradientForBg bg-clip-text text-transparent text-4xl font-semibold'>Welcome Back</h2>
    <p className='text-gray mt-2'>Please enter your login credentials to continue</p>
</div> */}


                {/* ------------ form -------------- */}

                <div className='bg-gradientForBorderOpposite w-96 mx-auto p-[1px] rounded-lg'>

                    <form className='w-full p-12 rounded-lg flex flex-col justify-center items-start mx-auto bg-bgOne'>

                        <div className='h-24 w-full'>
                            <Input
                                totalWidth={"w-full"}
                                className={""}
                                type={"email"}
                                name={"email"}
                                value={formData.email}
                                placeholder={"your email"}
                                onChange={(e) => handleInputChange(e)}
                                reloadButtonShowOrHide={true}
                                onClick={(e) => handleReloadButton(e)}
                            />

                        </div>

                        <div className='h-24 w-full '>

                            <Input
                                totalWidth={"w-full"}
                                className={""}
                                type={"password"}
                                name={"password"}
                                value={formData.password}
                                placeholder={"your password"}
                                onChange={(e) => handleInputChange(e)}
                                reloadButtonShowOrHide={true}
                                onClick={(e) => handleReloadButton(e)}
                            />


                        </div>

                        <PrimaryButton
                            isLoading={isLoading}
                            text={"Login"}
                            classname={'rounded-full w-24 py-2 shadow-2xl shadow-lime-800  font-semibold'}
                            onClick={handleSubmit}
                        ></PrimaryButton>



                        <div className='text-left mt-6 '>
                            <p className='text-gray text-sm'>Don't have an account? <Link to={"/register"}>Register</Link></p>
                        </div>



                    </form>


                </div>
            </div>
        </div>
    )
}

export default Login;
