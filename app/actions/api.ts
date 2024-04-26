"use server"

export async function signup(body:any) {

        const res = await fetch("http://localhost:8000/signup", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          }).then((res)=>{
            return res;
          }).catch((error)=> {
            throw error;
          })

   
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

export async function login(headers: {}) {
    try {
        const response = await fetch("http://localhost:8000/login", {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                ...headers
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
