export async function uploadFile(file: File, fileName: string) {
    try {
      const formData = new FormData();
      formData.append("image", file, fileName); // Append the file with its name to the FormData object
      
  
      // No need to set Content-Type header manually when using FormData
  
      const response = await fetch("https://exam-vm-admin.dseu.ac.in/upload", {
        method: "POST",
        body: formData,
        mode: "cors",
        cache: "no-store",
        headers: { name: fileName },
        // No need to set headers manually when using FormData
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      const responseData = await response.json();
      
      return responseData;
  
      // Do something with the uploaded file path, if needed
    } catch (error: any) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
  }