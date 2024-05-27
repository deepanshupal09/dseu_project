"use server";

export async function signup(body: any) {
  console.log("here");
  const res = await fetch("https://admin-exam.dseu.ac.in/signup", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export async function addExamRegisterations(body: any, token: string) {
  const res = await fetch(
    "https://admin-exam.dseu.ac.in/api/data/addExamRegisterations",
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",

      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(body),
    }
  )
    .then((res) => {
      return res;
    })
    .catch((error) => {
      throw error;
    });
}

export async function fetchCoursesByRollNo(rollno: string, token: string) {
  try {
    const res = await fetch(
      "https://admin-exam.dseu.ac.in/api/data/fetchCoursesByRollNo",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          token: token,
          rollno: rollno,
        },
      }
    );

    const data = await res.json();
    console.log("API Response:", data); // Log the response
    return data;
  } catch (error) {
    console.log("Error fetching courses:", error); // Log any errors
    throw error;
  }
}

export async function login(headers: {}) {
  try {
    const response = await fetch("https://admin-exam.dseu.ac.in/login", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      return response.status;
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchExamRegisterations(rollno: string, token: string) {
  try {
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/api/data/fetchExamRegistrationByRollNo",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
          token: token,
        },
      }
    );

    if (!response.ok) {
      return response.status;
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}



export async function sendEmail(rollno: string) {
  try {
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/sendEmail",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}

export async function verifyOtpAndPassword(rollno: string, otp: string) {
  try {
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/verifyOtpAndPassword",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
          otp: otp
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}
export async function updatePasswordByOtp(rollno: string, password: string) {
  try {
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/updatePasswordByOtp",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
          password: password
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/loginByEmailId",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          emailid: email,
          password: password
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}


export async function fetchExamRegistrationByProgramAndSemester(token:string ,campus: string, program_type: string, program:string, semester:string) {
  try {
    console.log("campus ",program_type);
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/api/admin/fetchExamRegistrationByProgramAndSemester",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          campus: campus,
          programType: program_type,
          program: program,
          semester: semester
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCoursesBySemester(token:string ,campus: string, program:string, semester:string) {
  try {
    // console.log("campus ",program_type);
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/api/admin/fetchCoursesBySemester",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          campus: campus,
          program: program,
          semester: semester
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}
export async function fetchExamRegistrationByCourseCode(token:string ,campus: string, course_code: string) {
  try {
    // console.log("campus ",program_type);
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/api/admin/fetchExamRegistrationByCourseCode",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          coursecode: course_code,
          campus: campus,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}
export async function fetchCourseDetailsByCourseCode(token:string, coursedetails: {campus:string,program:string, coursecode: string[]}) {
  try {
    console.log("campus ",coursedetails);
    const response = await fetch(
      "https://admin-exam.dseu.ac.in/api/admin/fetchCourseDetailsByCourseCode",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(coursedetails)
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch (error) {
    throw error;
  }
}
export async function fetchDetailsByCampus(token:string){
  try{
    const response = await fetch ("https://admin-exam.dseu.ac.in/api/admin/fetchCampusDetails",{
      method : "GET",
      mode : "cors",
      cache: "no-cache",
      headers:{
        "Content-Type": "application/json",
        token: token,
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const data = await response.json(); 
    return data;
  } catch(error){
    throw error;
  }
}

export async function fetchUpdateExamControl(body: { campus: string, program: string, semester: number, exam_control: boolean }[], token:string) {
  console.log(body);
  try {
    const response = await fetch('https://exam-vm-admin.dseu.ac.in/api/admin/updateExamControl', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        token:token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json(); 
    return data;
  } catch (error) {
    throw error; 
  }
}