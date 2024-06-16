"use server";

import { StudentDetails } from "../(navbar)/profile/page";

export async function signup(body: any) {
  const res = await fetch(`${process.env.BACKEND_URL}/signup`, {
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
    `${process.env.BACKEND_URL}/api/data/addExamRegisterations`,
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
export async function addExamRegisterationsAdmin(body: any, token: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/admin/addExamRegisterations`,
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
    .then(async (res) => {
      const data = await res.json();
      return data;
    })
    .catch((error) => {
      throw error;
    });
}

export async function fetchCoursesByRollNo(rollno: string, token: string) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/data/fetchCoursesByRollNo`,
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

    return data;
  } catch (error) {
    throw error;
  }
}
export async function fetchCoursesByRollNoAdmin(rollno: string, token: string) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchCoursesByRollNo`,
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

    return data;
  } catch (error) {
    throw error;
  }
}

export async function login(headers: {}) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
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
      `${process.env.BACKEND_URL}/api/data/fetchExamRegistrationByRollNo`,
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
export async function fetchExamRegisterationsByRollNo(
  rollno: string,
  token: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchExamRegistrationByRollNo`,
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
    const response = await fetch(`${process.env.BACKEND_URL}/sendEmail`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        rollno: rollno,
      },
    });

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
      `${process.env.BACKEND_URL}/verifyOtpAndPassword`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
          otp: otp,
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
      `${process.env.BACKEND_URL}/updatePasswordByOtp`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          rollno: rollno,
          password: password,
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
    const response = await fetch(`${process.env.BACKEND_URL}/loginByEmailId`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        emailid: email,
        password: password,
      },
    });

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

export async function fetchExamRegistrationByProgramAndSemester(
  token: string,
  campus: string,
  program_type: string,
  program: string,
  semester: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchExamRegistrationByProgramAndSemester`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          campus: campus,
          programType: program_type,
          program: program,
          semester: semester,
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

export async function fetchCoursesBySemester(
  token: string,
  campus: string,
  program: string,
  semester: string,
  program_type: string
) {
  try {
    //
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchCoursesBySemester`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          campus: campus,
          program: program,
          semester: semester,
          programtype: program_type,
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
export async function fetchExamRegistrationByCourseCode(
  token: string,
  campus: string,
  course_code: string
) {
  try {
    //
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchExamRegistrationByCourseCode`,
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

export async function fetchCourseDetailsByCourseCode(
  token: string,
  coursedetails: { campus: string; program: string; coursecode: string[] }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchCourseDetailsByCourseCode`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(coursedetails),
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
export async function fetchDetailsByCampus(token: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchCampusDetails`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateDetails(user: StudentDetails, token: string) {
  try {
    const body = {
      program: user.program,
      semester: user.semester,
      phone: user.phone,
      campus: user.campus,
      emailid: user.emailid,
      gender: user.gender,
      alternate_phone: user.alternate_phone,
      father: user.father,
      mother: user.mother,
      guardian: user.guardian,
      aadhar: user.aadhar,
      abc_id: user.abc_id,
      pwbd_certificate: user.pwbd_certificate,
      photo: user.photo,
      program_type: user.program_type,
      password: "",
      rollno: user.rollno,
      year_of_admission: user.year_of_admission,
      date_of_birth: user.date_of_birth,
    };
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/updateDetailsByRollno`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
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
export async function updateDetailsUser(user: StudentDetails, token: string) {
  try {
    const body = {
      program: user.program,
      semester: user.semester,
      phone: user.phone,
      campus: user.campus,
      emailid: user.emailid,
      gender: user.gender,
      alternate_phone: user.alternate_phone,
      father: user.father,
      mother: user.mother,
      guardian: user.guardian,
      aadhar: user.aadhar,
      abc_id: user.abc_id,
      pwbd_certificate: user.pwbd_certificate,
      photo: user.photo,
      program_type: user.program_type,
      password: "",
      rollno: user.rollno,
      year_of_admission: user.year_of_admission,
      date_of_birth: user.date_of_birth,
    };
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/data/updateDetailsByRollno`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
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

export async function fetchExamControl(
  token: string,
  campus: string,
  program: string,
  semester: string,
  program_type: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/data/fetchExamControl`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
          campus: campus,
          semester: semester,
          program: program,
          programtype: program_type,
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

export async function getUserByRollNo(rollno: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/getUserByRollno`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
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
export async function fetchUserByRollno(rollno: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/data/getUserByRollno`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
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
export async function fetchCampusDetailsGlobal() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/fetchCampusDetails`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
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

export async function deleteExamRegistration(rollno: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/deleteExamRegistrationByRollno`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: token,
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
export async function fetchUpdateExamControl(
  body: {
    campus: string;
    program: string;
    semester: number;
    exam_control: boolean;
  }[],
  token: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/updateExamControl`,
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
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function resetStudent(
  token: string,
  rollno: string,
  name: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/resetStudentController`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          token: token,
          rollno: rollno,
          name: name,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAllExamControlDetails(token: string) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchAllExamControlDetailsController`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchInternalMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    academic_year: string;
    course_code: string;
    rollno: Array<string>;
  }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchStudentDetailsFromInternalController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchAggregateMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    academic_year: string;
    course_code: string;
    rollno: Array<string>;
  }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchStudentDetailsFromAggregateController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchExternalMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    academic_year: string;
    course_code: string;
    rollno: Array<string>;
  }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchStudentDetailsFromExternalController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function fetchStudentByCourseCode(
  token: string,
  course_code: string,
  campus: string,
  program_type: string,
  program: string,
  semester: string,
  academic_year: string
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchStudentsByCourseCode`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
          coursecode: course_code,
          campus: campus,
          programtype: program_type,
          program: program,
          semester: semester,
          academicyear: academic_year,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateInternalMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    course_code: string;
    academic_year: string;
    rollno: Array<string>;
    marks: Array<string>;
    freeze_marks: boolean;
  }
) {
  try {
    console.log("body: ", details);
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/handleStudentDetailsFromInternalController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateExternalMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    course_code: string;
    academic_year: string;
    rollno: Array<string>;
    marks: Array<string>;
    freeze_marks: boolean;
  }
) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/handleStudentDetailsFromExternalController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
export async function updateAggregateMarks(
  token: string,
  details: {
    campus: string;
    program_type: string;
    program: string;
    semester: string;
    course_code: string;
    academic_year: string;
    rollno: Array<string>;
    marks: Array<string>;
    freeze_marks: boolean;
  }
) {
  try {
    console.log("this api ");
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/handleStudentDetailsFromAggregateController`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      }
    );

    console.log("response: ", response);

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchDepartDetailsByEmailid(token: string,  email: string) {
  try {
    console.log("this api ");
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/admin/fetchDepartDetailsByEmailid`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          token: token,
          "Content-Type": "application/json",
          emailid: email,
        },
      }
    );

    console.log("response: ", response);

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
