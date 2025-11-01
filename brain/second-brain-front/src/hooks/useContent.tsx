import axios from "axios";
import {useEffect, useState} from "react";
import {BACKEND_URL} from "../config";

interface Content {
    id: string;
    title: string;
    type: string;
    link: string;
}

export function useContent(): Content[] {
    const [contents, setContents] = useState<Content[]>([]);
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchContents = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/brain/content`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setContents(response.data.content || []);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchContents();
    }, []);

    return contents;
}