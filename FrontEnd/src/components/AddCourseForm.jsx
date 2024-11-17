import React, { useContext, useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import axios from '../config/axiosConfig'
import GoBack from '../components/GoBack'
import { toast } from 'react-hot-toast'
import SecondaryButton from '../components/formComponents/SecondaryButton'
import CourseCard from '../components/CourseCard'
import { MdUpload } from "react-icons/md";
import { WindowWidthContext } from '../context/WindowWidthContext'
function AddCourseForm() {

  const loggedInUser = useSelector(registerUser)
  const { isMobile } = useContext(WindowWidthContext);

  //restricting the user to delete a chapter if only one chapter is left
  const [deleteButtonDisable, isDeleteButtonDisable] = useState(false);


  //image preview
  const [previewImage, setPreviewImage] = useState(null)


  const [formData, setFormData] = useState({
    courseTitle: "",
    courseDescription: "",
    courseCategory: "",
    courseImage: null,
    chapters: [
      {
        chapterContent: "",
        chapterTitle: ""
      }
    ]
  });

  const ref = useRef(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }, [formData.chapters])


  function handleAddChapterClick() {

    setFormData((prev) => (
      { ...prev, chapters: [...prev.chapters, { chapterTitle: "", chapterContent: "" }] }
    ))
  }


  //cannot delete if only one chapter is remaining in the chapters array.
  useEffect(() => {
    if (formData.chapters.length <= 1) {
      isDeleteButtonDisable(true)
    }
    else {
      isDeleteButtonDisable(false)
    }
  }, [formData.chapters])



  function handleDeleteChapterClick(deleteChapterIndex) {

    const newChapters = formData.chapters.filter((_, index) => index != deleteChapterIndex)
    setFormData(prev => ({ ...prev, chapters: newChapters }))
  }



  function handleChange_Chapter(e, index) {
    const newChapters = [...formData.chapters];
    newChapters[index][e.target.name] = e.target.value;

    setFormData((prev) => ({ ...prev, chapters: newChapters }))
  }


  function handleChange_Other(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleChange_Image(e) {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, courseImage: file }));

    //set preview image url
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
    else {
      setPreviewImage(null)
    }

  }




  async function handleSubmitClick(e) {
    e.preventDefault();

    // Creating a FormData object to send data with image
    const formDataWithImage = new FormData();

    const courseDto = {
      courseName: formData.courseTitle,
      courseDescription: formData.courseDescription,
      courseCategory: formData.courseCategory,
    }
    formDataWithImage.append("courseDto", JSON.stringify(courseDto));

    if (formData.courseImage) {
      formDataWithImage.append("file", formData.courseImage);
    }

    formDataWithImage.append("chapters", JSON.stringify(formData.chapters))



    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/create`, formDataWithImage);

      if (response.status === 200) {

        //show the success toast
        toast.success("Course Added", {
          position: "top-right",
          style: {
            background: "#1C1210",
            color: "#E5E6E6",
          }

        })

        //reset the form only if course was successfully added
        setFormData({
          courseTitle: "",
          courseCategory: "",
          courseDescription: "",
          courseImage: null,
          chapters: [
            {
              chapterContent: "",
              chapterTitle: ""
            }
          ]
        })

        // also clear the preview image if course added successfully
        setPreviewImage(null)

      }
    }
    catch (e) {
      toast.error("Try Again", {
        position: "top-right",
        style: {
          background: "#1C1210",
          color: "#E5E6E6",
        }

      })
      console.log("error while creating course : ", e);

    }

  }


  return (

    <div className='flex'>

      <div ref={ref} className='py-12 sm:py-32 px-10 w-full sm:w-4/6'>

        {
          !isMobile && <GoBack
            text={"Go Back"}
            goWhere={"/"}
            classname={"bg-bgTwo pl-4 pr-5 py-2 rounded-full"}
          />
        }


        <div className='flex flex-col gap-6 mb-8'>
          <div className='flex w-full gap-10'>

            <div className='w-3/5 flex flex-col items-start justify-center gap-2 '>
              <label className='text-white' htmlFor="courseTitle">Course Name</label>
              <input type="text"
                name='courseTitle'
                className='pr-6 pl-0 py-0 pt-3 w-full text-white bg-transparent border-none focus:border-none focus:ring-0 placeholder-subtextColor'
                value={formData.courseTitle}
                placeholder='Spring Boot & Spring Security'
                onChange={(e) => handleChange_Other(e)}
              />
              <div className='line-1'></div>
            </div>

            <div className='w-2/5 flex flex-col items-start justify-center gap-2'>
              <label className=' text-white' htmlFor="courseCategory">Category</label>
              <input type="text"
                name='courseCategory'
                className='pr-6 pl-0 py-0 pt-3 w-full text-white bg-transparent border-none focus:border-none focus:ring-0 placeholder-subtextColor'
                value={formData.courseCategory}
                placeholder='Java, Spring Boot, Spring Security'
                onChange={(e) => handleChange_Other(e)}
              />
              <div className='line-1'></div>
            </div>

          </div>

          <div className='w-full flex flex-col items-start justify-center gap-2'>
            <label className='text-white' htmlFor="courseDescription">Course Description</label>
            <input type="text"
              name='courseDescription'
              className='pr-6 pl-0 py-0 pt-3 w-full text-white bg-transparent border-none focus:border-none focus:ring-0 placeholder-subtextColor'
              value={formData.courseDescription}
              placeholder='Learn Spring Boot & Spring Security in 12 hours. Topics covered : Redis, JUnit, Kafka etc.'
              onChange={(e) => handleChange_Other(e)}
            />
            <div className='line-1'></div>
          </div>



          {/* New Course Image Upload Field */}

          {/* Preview Image */}
          {previewImage && (
            <div className='my-4'>
              <p className='text-white'>Image Preview:</p>
              <img src={previewImage} alt="Course Preview" className='w-64 h-40 object-cover rounded' />
            </div>
          )}




          <input ref={fileInputRef}
            type="file"
            id='courseImage'
            accept='image/*'
            className='hidden'
            onChange={handleChange_Image} />

          <div
            onClick={() => fileInputRef.current.click()}
            className='border border-dashed border-border h-20 flex justify-center items-center cursor-pointer'>
            <MdUpload className='text-white' size={24} />
          </div>


        </div>



        {
          formData.chapters.map((chapter, index) => (

            <div key={index} className='relative bg-bgOne border border-border rounded-xl flex flex-col p-8 gap-6 mb-6'>

              <div className='flex flex-col gap-2'>
                <label className='text-white' htmlFor="chapterTitle">Chapter Title</label>

                <input type="text"
                  name='chapterTitle'
                  className='pr-6 pl-0 py-0 pt-3 w-full text-white bg-transparent border-none focus:border-none focus:ring-0 placeholder-subtextColor'
                  placeholder='Introduction to Spring Boot.'
                  value={chapter.chapterTitle}
                  onChange={(e) => handleChange_Chapter(e, index)}
                />
                <div className='line-1'></div>
              </div>

              <div className='flex flex-col gap-2'>
                <label className='text-white' htmlFor="chapterContent">Chapter Content</label>
                <input type="text"
                  name='chapterContent'
                  className='pr-6 pl-0 py-0 pt-3 w-full text-white bg-transparent border-none focus:border-none focus:ring-0 placeholder-subtextColor'
                  placeholder='Spring Boot is an open-source Java framework used for programming standalone, production-grade Spring-based applications with a bundle of libraries that make project startup and management easier.'
                  value={chapter.chapterContent}
                  onChange={(e) => handleChange_Chapter(e, index)}
                />
                <div className='line-1'></div>
              </div>



              {/* ------------ delete chapter ----------- */}

              <button
                className={`${deleteButtonDisable ? 'cursor-not-allowed opacity-10' : ''} absolute top-4 right-4 text-gray bg-bgTwo w-10 h-10 flex justify-center items-center rounded-full`}
                onClick={() => handleDeleteChapterClick(index)}
                disabled={deleteButtonDisable}
              ><MdDelete /></button>

            </div>
          ))
        }

        <SecondaryButton
          text={"New Chapter"}
          onClick={handleAddChapterClick}
          classname={"text-gray py-2"}
        />



        <button
          ref={ref}
          type='submit'
          className={`fixed bottom-24 right-4 sm:bottom-10  sm:right-10 mt-10 bg-gradientForBg rounded-full text-bgOne px-10 py-3 font-semibold ${!formData.courseTitle || !formData.courseCategory || !formData.courseDescription ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleSubmitClick}
          disabled={!formData.courseTitle || !formData.courseCategory || !formData.courseDescription}
        >Submit</button>



      </div>




      {
        !isMobile && <div className='w-2/6 border-l text-white border-border pt-12 px-4 flex justify-center '>

          <CourseCard
            title={`${formData.courseTitle ? formData.courseTitle : "Spring Boot & Spring Security"}`}
            instructor={loggedInUser}
            description={`${formData.courseDescription ? formData.courseDescription : "Learn Spring Boot & Spring Security in 12 hours. Topics covered : Redis, JUnit, Kafka etc."}`}
            showCTA={true}
            text={"Enroll"}
            vote={0}
          />
        </div>

      }

    </div>
  )
}

export default AddCourseForm