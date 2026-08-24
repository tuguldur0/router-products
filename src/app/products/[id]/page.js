"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase/client";

export default function Home() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        if(!loading) return;
        const oeoerg = async () => {
            const { data, error } = await supabase.from('products').select('*').eq("id", id).single();
            if(error) console.log(error);
            else setItem(data);
        }
        oeoerg();
     }, [])
    if (!item) return <div>Loading...</div>;

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center">
            <div className="border-2 border-gray-200 rounded-md flex gap-4 p-2">
                <img className="w-75 h-75" src={item.thumbnail}></img>
                <div className="flex flex-col gap-1">
                    <p className="text-2xl">{item.title}</p>
                    <p>Rating: {item.rating} stars</p>
                    <p className="text-2xl">{item.price}$</p>
                    <div className="flex gap-2">
                        {item.options.map((option, index) => {
                            return <button className="hover:cursor-pointer border border-gray-200 rounded-md py-1 px-2" key={index}>
                                <p>{option}</p>
                            </button>
                        })}
                    </div>
                    <p className="text-xl">About this item:</p>
                    <p>{item.description}</p>
                    <p>Stock: {item.stock}</p>
                    <button className="text-white flex items-center justify-center px-3 py-1.5 font-bold bg-[#ff9500] rounded-md hover:cursor-pointer transition-all duration-300">Add to cart</button>
                    <button className="text-white flex items-center justify-center px-3 py-1.5 font-bold bg-[#FF4500] rounded-md hover:cursor-pointer transition-all duration-300">Buy now</button>
                </div>
            </div>
        </div>
    )
}