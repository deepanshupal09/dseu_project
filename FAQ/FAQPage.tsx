"use client";
import FAQItem from "./FAQItem";

const faqs =[
    {
        question:"How is the default password determined?",
        answer:"The default password consists of the first four letters of the student’s first name in CAPITALS, followed by the student’s Roll No. If the first name has fewer than 4 characters, the password will be the first name in CAPITALS followed by the Roll No."
    },
    {
        
        question:"What should students do if they forget their password?",
        answer:"Students can click on “Forgot Password” and follow the instructions to reset their password using an OTP sent to their registered email."
    },
    {
        
        question:"What if I find any of my provided information incorrect after submission?",
        answer:"If you discover incorrect information after the final submission, forward your application to the campus authorities, who will then forward it to the COE."
    },
    {
        
        question:"What should I do if I am unable to log in despite using the correct credentials?",
        answer:"Ensure you enter your username and password correctly. If the issue persists, try resetting your password or contact technical support. 🤝🔑"
    },
    {
        
        question:"How can I check my exam registration status?",
        answer:"After logging in, you can view your registration status under the “Exam Registration” section on your dashboard.",
    },
    {
        
        question:"What should students do if their submission is not successful?",
        answer:"If submission is not successful, students have to log in again using the default password.",
    },
    {
        
        question:"When can students register for exams?",
        answer:"Students will receive notifications regarding the exam registration date via email or the exam portal. Currently, exam registration is open for B.Tech. and M.Tech. programs."
    },
    {
        
        question:"How do I update my contact information (phone number, address, etc.)?",
        answer:"You can update your contact information in the “Profile” section after logging in."
    },
    {
       
        question:"Who should students contact for technical problems related to exam registration?",
        answer:"For any technical problems, students may contact dseu-exam@dseu.ac.in. 📝🔍"
    }
];

const FAQPage: React.FC = () => {
  return (
    <div className="overflow-scroll mx-auto px-4 py-8">
      <div style={{fontSize: "50px"}} className=" font-medium mb-6">FAQs</div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      <div className="mt-8 overflow-scroll">
                <iframe 
                className="mx-auto"
                    src="https://www.youtube.com/embed/V9XC7KCpfbU?si=AEgDSJa54TJptg6p" title="YouTube video player" 
                    width="90%" 
                    height="90%" 
                    
                ></iframe>
            </div>
    </div>
  );
};

export default FAQPage;
