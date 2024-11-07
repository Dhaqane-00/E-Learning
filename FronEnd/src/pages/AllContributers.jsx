import React, { useEffect, useState } from 'react'
import ContributerProfile from '../components/ContributerProfile';
import axios from 'axios'
import Search from '../components/Search';
import GoBack from '../components/GoBack';
import { ThreeDot } from 'react-loading-indicators'
import { useNavigate } from 'react-router-dom';
import { IoPersonSharp } from "react-icons/io5";


function AllContributers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState({});
    const [isLoading, setIsLoading] = useState(false)

    const [searchQuery, setSearchQuery] = useState("");

    function setQuery(query) {
        setSearchQuery(query)
    }



    useEffect(() => {
        async function fetchALlContributors() {
            try {
                setIsLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/public/contributors`)

                const data = await response.data;

                setUsers(data);
            }
            catch (e) {
                console.error("Error fetching contributers", e)
            }
            finally {
                setIsLoading(false)
            }
        }
        fetchALlContributors();

    }, [])



    const filteredUsers = Object.keys(users).filter(key =>
        users[key].name.toLowerCase().includes(searchQuery.toLowerCase())
        ||
        users[key].email.split('@')[0].toLowerCase().includes(searchQuery.toLowerCase())
    ).map(key => users[key]);



    function handleSeeCoursesClick(userId) {

        navigate(`/user/${userId}/uploaded-courses`)
    }

    return (
        <div className='pt-32 pb-10 flex flex-col items-center bg-bgOne h-screen w-full'>

            <GoBack text={"Go Back"} goWhere={"/"} />

            <Search
                classname={"fixed top-8"}
                onSearch={setQuery}
                placeholder={"Search Contributors"}
                icon={<IoPersonSharp />}
            />


            {
                isLoading ?

                    (

                        <div className='mt-40 text-center'>
                            <ThreeDot color="#9CF57F" size="small" />
                        </div>
                    )

                    :

                    (

                        <div className='mt-20 overflow-y-scroll flex flex-col w-1/2 gap-2' style={{ scrollbarWidth: "none" }}>

                            {
                                searchQuery ?

                                    (
                                        Object.keys(filteredUsers).length > 0 ?

                                            (
                                                (
                                                    Object.keys(filteredUsers).map((key) => {

                                                        return <ContributerProfile

                                                            key={key}
                                                            name={filteredUsers[key].name}
                                                            email={filteredUsers[key].email}
                                                            bio={filteredUsers[key].bio}
                                                            uploadedCourse={filteredUsers[key].uploadedCourse}
                                                            onClick={() => handleSeeCoursesClick(key)}

                                                        />
                                                    })
                                                )
                                            )

                                            :

                                            (
                                                <p className='text-center mt-40 text-gray'>No contributors found with the name : {searchQuery}</p>
                                            )
                                    )

                                    :

                                    (
                                        Object.keys(users).map((key) => {

                                            return <ContributerProfile

                                                key={key}
                                                name={users[key].name}
                                                email={users[key].email}
                                                bio={users[key].bio}
                                                uploadedCourse={users[key].uploadedCourse}
                                                onClick={() => handleSeeCoursesClick(key)}

                                            />
                                        })
                                    )

                            }
                        </div>
                    )

            }





        </div>
    )
}

export default AllContributers