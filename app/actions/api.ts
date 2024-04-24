// "use server";

export async function signup(body: any) {
    console.log("here")
  const res = await fetch("http://localhost:8000/signup", {
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

export async function addExamRegisterations(body: any,token: string) {
  const res = await fetch("http://localhost:8000/api/data/addExamRegisterations", {
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
    const res = await fetch("http://localhost:8000/api/data/fetchCoursesByRollNo", {
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
    console.log("API Response:", data); // Log the response
    return data;
  } catch (error) {
    console.log("Error fetching courses:", error); // Log any errors
    throw error;
  }
}


export async function login(headers: {}) {
  try {
    const response = await fetch("http://localhost:8000/login", {
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

export async function fetchExamRegisterations(rollno: string,token: string) {
  try {
    const response = await fetch("http://localhost:8000/api/data/fetchExamRegistrationByRollNo", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        rollno: rollno,
        token: token
      },
    })

    if (!response.ok) {
      return response.status;
    }

    const data = await response.json(); // Parse the JSON response
    return data;
  } catch(error) {
    throw error;
  }
}

export async function uploadFile(file: File, fileName: string) {
  try {
    const formData = new FormData();
    formData.append('image', file, fileName); // Append the file with its name to the FormData object
    console.log("formdata: ", formData);

    // No need to set Content-Type header manually when using FormData

    const response = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
      mode: "cors",
      headers: {name: fileName}
      // No need to set headers manually when using FormData
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('Uploaded file path:', responseData);
    return responseData;

    // Do something with the uploaded file path, if needed
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
}

