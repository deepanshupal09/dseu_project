"use client";

import { Backdrop, CircularProgress, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image from "next/image";
import logo from "../images/logo.png";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions/api";
import { setAuthAdmin } from "../actions/cookie";
import OurTeam from "../team/OurTeam";
import FAQPageTwo from "@/FAQ/FAQPage2";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [helperText, setHelperText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startBottomAnimation, setStartBottomAnimation] = useState(false);
  const [section, setSection] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setStartBottomAnimation(true);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setStartBottomAnimation(false);
    }
  }, [isOpen]);

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await loginAdmin(email, password);
      await setAuthAdmin(response.token);
      router.push("/admin/dashboard");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(true);
      const message = JSON.parse(error.message);
      setHelperText(message.message);
    }
  }

  return (
    <>
      <div className="relative">
                <div className="flex items-center fixed max-sm:top-2 max-sm:right-7 top-8 right-20 z-30">
                    <button
                        className="relative w-10 h-10"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                        aria-label="Menu"
                    >
                        <div className={`absolute top-1/2 left-1/2 w-8 h-[2px] bg-black transition-transform duration-300 ease-in-out ${isOpen ? "rotate-45" : "-translate-y-2"} transform origin-center`}></div>
                        <div className={`absolute top-1/2 left-1/2 w-8 h-[2px] bg-black transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : ""}`}></div>
                        <div className={`absolute top-1/2 left-1/2 w-8 h-[2px] bg-black transition-transform duration-300 ease-in-out ${isOpen ? "-rotate-45" : "translate-y-2"} transform origin-center`}></div>
                    </button>
                </div>
                <div className={`fixed top-0 right-0 z-20 w-screen h-screen bg-black opacity-50  transition-transform duration-[300ms] ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}></div>
                <div className={`fixed top-0 right-0 z-20 w-screen h-screen bg-black opacity-80 transition-transform duration-[450ms] ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}></div>
                <div className={`fixed top-0 right-0 z-20 w-screen h-screen bg-white transition-transform duration-[600ms] ease-in-out ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
                    <div className={`h-[1px] fixed top-20 w-full   bg-gray-300  transition-all duration-[1500ms] ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}></div>
                    <div className={`h-[1px] fixed bottom-20 w-full ${section !== 0 && "bottom-0"}  bg-gray-300  transition-all duration-[1500ms] ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}></div>
                    <div className={`fixed top-20 bottom-20 w-[1px] right-1/2   bg-gray-300 transition-all duration-1000 ease-in-out ${startBottomAnimation ? "h-[calc(100vh-160px)]" : "h-0"}`}></div>
                    <div
                        onClick={() => {
                            if (section === 1) {
                                setSection(0);
                            } else {
                                setSection(1);
                            }
                            setIsOpen(false);
                        }}
                        className={`fixed top-20 transition-all duration-1000 ${startBottomAnimation ? "h-[calc(100vh-160px)] text-black" : "h-0 text-white"} font-roboto max-sm:text-[30px] text-[70px]   cursor-pointer h-[calc(100vh-160px)]   flex flex-col justify-center items-center group `}
                    >
                        <div className="w-[50vw] flex justify-center items-center">
                            <div className={` flex items-center justify-center flex-col transition-opacity duration-300 transform ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"} `}>
                                <div>{section !== 1 ? <>OUR TEAM</> : <>LOG IN</>}</div>
                                <div className={`h-[2px]  bg-black group-hover:w-full w-0 transition-all mx-auto duration-500 origin-center ease-in-out`}></div>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            if (section === 2) {
                                setSection(0);
                            } else {
                                setSection(2);
                            }
                            setIsOpen(false);
                        }}
                        className={`fixed top-20 transition-all right-0 duration-1000 ${startBottomAnimation ? "h-[calc(100vh-160px)] text-black" : "h-0 text-white"} font-roboto max-sm:text-[30px] text-[70px]  cursor-pointer h-[calc(100vh-160px)] w-1/2 flex flex-col justify-center items-center group`}
                    >
                        <div>
                            <div>{section !== 2 ? <>FAQ</> : <>LOG IN</>}</div>
                            <div className="h-[2px] bg-black group-hover:w-full w-0 transition-all mx-auto duration-500 origin-center ease-in-out"></div>
                        </div>
                    </div>
                </div>
            </div>

            {section === 0 && (
                <div className=" ">
                    <div className="flex self-center justify-center min-h-[100vh]  items-center">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                            className="flex flex-col  bg-white  rounded-3xl shadow-2xl max-[450px]:backdrop-blur-0 max-[450px]:rounded-none shadow-slate-400 p-6 items-center max-md:space-y-7 md:space-y-10 justify-start h-fit pt-16 pb-10 px-10 max-[450px]:w-[100%] max-[450px]:h-[100vh] w-[460px] ] "
                        >
                            <Image height={130} className="-mb-4" src={logo} alt="logo" />
                            <div className="text-[32px] font-semibold  ">Exam Portal</div>
                            <div className="text-2xl w-full font-semibold ">Login</div>
                            <div className="mt-1 w-[100%]">
                                <TextField
                                  required
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                    setHelperText("");
                                    setError(false);
                                  }}
                                  value={email}
                                  helperText={helperText}
                                  error={error}
                                  className=""
                                  sx={{
                                    ".MuiInputBase-input": {
                                      borderRadius: "10px",
                                    },
                                    "&:before, &:after": {
                                      borderRadius: "10px",
                                    },
                                  }}
                                  InputProps={{
                                    style: {
                                      borderRadius: "10px",
                                    },
                                  }}
                                  id="myfilled-name"
                                  label="User ID"
                                  variant="outlined"
                                  color="grey"
                                  fullWidth
                                />
                              </div>
                              <div className="mt-1 w-[100%]">
                                <TextField
                                  required
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    setHelperText("");
                                    setError(false);
                                  }}
                                  type="password"
                                  value={password}
                                  helperText={helperText}
                                  error={error}
                                  sx={{
                                    "&:before, &:after": {
                                      borderRadius: "10px",
                                    },
                                  }}
                                  InputProps={{
                                    style: {
                                      borderRadius: "10px",
                                    },
                                  }}
                                  id="myfilled-name"
                                  label="Password"
                                  variant="outlined"
                                  color="grey"
                                  fullWidth
                                />
                              </div>
                          <button className="bg-black flex justify-center items-center transition-all duration-150 gap-x-3 text-white w-full p-4 rounded-2xl font-semibold">
                                <div> Sign In </div>{" "}
                                <ArrowForwardIosIcon className="scale-75" />
                          </button>
                              <div className="flex w-full justify-between">
                                <div
                                  onClick={() => {
                                    router.push("/");
                                  }}
                                  className="w-full cursor-pointer hover:underline"
                                >
                                  Are you a student?
                                </div>
                              </div>
                            </form>
                          </div>
                          </div>
                        )}

                        {section === 1 && (
                          <div>
                            <OurTeam />
                          </div>
                        )}

                        {section === 2 && (
                          <div className="my-5 h-[100vh] mx-24">
                            <FAQPageTwo />
                          </div>
                        )}

                        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                      </>
                    );
                  }
