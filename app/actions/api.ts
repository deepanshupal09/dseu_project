"use server";

import { StudentDetails } from "../(navbar)/profile/page";

export async function signup(body: any) {
    const res = await fetch("https://exam-vm-admin.dseu.ac.in/signup", {
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
    const res = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/addExamRegisterations", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",

        headers: {
            "Content-Type": "application/json",
            token: token,
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

export async function fetchCoursesByRollNo(rollno: string, token: string) {
    try {
        const res = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/fetchCoursesByRollNo", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                token: token,
                rollno: rollno,
            },
        });

        const data = await res.json();

        return data;
    } catch (error) {
        throw error;
    }
}

export async function login(headers: {}) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/login", {
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
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/fetchExamRegistrationByRollNo", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                rollno: rollno,
                token: token,
            },
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

export async function sendEmail(rollno: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/sendEmail", {
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
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/verifyOtpAndPassword", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                rollno: rollno,
                otp: otp,
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
export async function updatePasswordByOtp(rollno: string, password: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/updatePasswordByOtp", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                rollno: rollno,
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

export async function loginAdmin(email: string, password: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/loginByEmailId", {
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

export async function fetchExamRegistrationByProgramAndSemester(token: string, campus: string, program_type: string, program: string, semester: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/fetchExamRegistrationByProgramAndSemester", {
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

export async function fetchCoursesBySemester(token: string, campus: string, program: string, semester: string) {
    try {
        //
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/fetchCoursesBySemester", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
                campus: campus,
                program: program,
                semester: semester,
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
export async function fetchExamRegistrationByCourseCode(token: string, campus: string, course_code: string) {
    try {
        //
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/fetchExamRegistrationByCourseCode", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
                coursecode: course_code,
                campus: campus,
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

export async function fetchCourseDetailsByCourseCode(token: string, coursedetails: { campus: string; program: string; coursecode: string[] }) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/fetchCourseDetailsByCourseCode", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            body: JSON.stringify(coursedetails),
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
export async function fetchDetailsByCampus(token: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/fetchCampusDetails", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {
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
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/updateDetailsByRollno", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            body: JSON.stringify(body),
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
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/updateDetailsByRollno", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            body: JSON.stringify(body),
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

export async function fetchExamControl(token: string, campus: string, program: string, semester: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/fetchExamControl", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
                campus: campus,
                semester: semester,
                program: program,
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

export async function getUserByRollNo(rollno: string, token: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/getUserByRollno", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
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
export async function fetchUserByRollno(rollno: string, token: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/data/getUserByRollno", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
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
export async function fetchCampusDetailsGlobal() {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/fetchCampusDetails", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
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

export async function deleteExamRegistration(rollno: string, token: string) {
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/deleteExamRegistrationByRollno", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: token,
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
export async function fetchUpdateExamControl(body: { campus: string; program: string; semester: number; exam_control: boolean }[], token: string) {
    console.log(body);
    try {
        const response = await fetch("https://exam-vm-admin.dseu.ac.in/api/admin/updateExamControl", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                token: token,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

    const data = await response.json(); 
    return data;
  } catch (error) {
    throw error; 
  }
}