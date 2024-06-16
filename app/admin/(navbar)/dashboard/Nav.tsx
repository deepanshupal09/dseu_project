"use client";
import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { MenuOpen } from "@mui/icons-material";
import { getAuthAdmin } from "@/app/actions/cookie";
import { User } from "../query/page";
import { parseJwt } from "@/app/actions/utils";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    useEffect(() => {
        setActiveLink(window.location.pathname);
    }, []);
    // const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        getAuthAdmin().then(async (t: any) => {
            if (t) {
                const data = await parseJwt(t.value);
                //
                if (data?.user?.role === "super") {
                    setOptions(["Dashboard","Registration Chart", "Admit Card", "Query","Marks Entry","Exam Control", "Edit Student Details"]);
                }
                if (data?.user?.role === "dep") {
                    setOptions(["Marks Entry"]);
                }
                if (data?.user?.role === "admin") {
                    setOptions(["Registration Chart", "Admit Card", "Query","Marks Entry"]);
                }
            }
        });
    }, []);

    return (
        <>
            <div className="bg-white top-0 max-sm:w-full fixed left-0 sm:h-screen ">
                <div className="container mx-auto mb-2">
                    <div>
                        <div className="w-[250px] text-lg font-normal px-8 py-48 space-y-10 h-full  shadow-2xl shadow-slate-200 bg-white absolute border-2 left-0 sm:block hidden">
                            {options.map((option, index) => {
                                const path = `/admin/${option.toLowerCase().replace(/\s+/g, "-")}`;
                                return (
                                    <div key={index} className={`cursor-pointer hover:text-dseublue  ${path === activeLink ? "text-dseublue " : ""}`}>
                                        <a href={path}>{option}</a>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="sm:hidden absolute top-[60px] bg-white w-full flex flex-col">
                            {true && (
                                <div className="flex flex-row items-center space-x-7 bg-white p-4 shadow-lg  ">
                                    {options.map((option, index) => {
                                        const path = `/admin/${option.toLowerCase().replace(/\s+/g, "-")}`;
                                        return (
                                            <a key={index} href={path} className={`cursor-pointer hover:text-dseublue ${path === activeLink ? "text-dseublue" : ""}`}>
                                                {option}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
