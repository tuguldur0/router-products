"use client"

import Link from "next/link";
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase/client";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
            if(!loading) return;
            const stupidAsyncFunc = async () => {
              const { data, error } = await supabase.from('products').select('*');
              if(error) console.log(error);
              else setProducts(data);
            }
            stupidAsyncFunc();
         }, [])
    
    const [copyoproducts, setCopyoproducts] = useState(products);
    const [searchTerm, setSearchTerm] = useState("");
    const [first, setFirst] = useState(0);
    const [last, setLast] = useState(28);
    const [count, setCount] = useState(1);
    const [maxCount, setMaxCount] = useState(1)
    
    const handleSearch = (event) => {
      if(event.key === 'Enter'){
        search(searchTerm.toLowerCase());
      }
    }
    const search = async (term) => {
        const {data, error} = await supabase.from('products').select().ilike('title', term).select()
        setCopyoproducts(data)
    }
    const forward = () => {
        if(count < maxCount){
        setFirst(first+28);
        setLast(last+28);
        setCount(count+1);
        }
    }
    const backward = () => {
        if(first != 0 && last != 28){    
        setFirst(first-28);
        setLast(last-28);
        setCount(count-1)
    }
    }
    const filter = async (term) => {
        if(term == "all"){
            setCopyoproducts(products)
        } else if(term == "50"){
            const { data : fiftydata, error : fiftyerror} = await supabase.from('products').select().lte('price', 50)
            setCopyoproducts(fiftydata);
        } else if(term == "50-200"){
            const { data : middata, error : miderror} = await supabase.from('products').select().gt('price', 50).lte('price', 200)
            setCopyoproducts(middata);
        } else if(term == "200"){
            const { data : twohundreddata, error : twohundrederror} = await supabase.from('products').select().gt('price', 200)
            setCopyoproducts(twohundreddata)
        }
    }

    useEffect(() => {
        filter("all")
    }, [products])
    if (!products) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="h-7 flex justify-between">
                <div className="flex gap-1">
                    <button onClick={() => filter("all")} className="w-24 h-fits border-2 border-gray-300 rounded-md flex justify-center align-center">All</button>
                    <button onClick={() => filter("50")} className="w-24 h-fits border-2 border-gray-300 rounded-md flex justify-center align-center">Under 50$</button>
                    <button onClick={() => filter("50-200")} className="w-24 h-fits border-2 border-gray-300 rounded-md flex justify-center align-center">50-200$</button>
                    <button onClick={() => filter("200")} className="w-24 h-fits border-2 border-gray-300 rounded-md flex justify-center align-center">Over 200$</button>
                </div>
                <div className="border-2 border-gray-200 rounded-md px-1">
                    <input onKeyDown={handleSearch} onChange={(event) => {setSearchTerm(event.target.value)}} value={searchTerm} placeholder="Search"></input>
                    <button onClick={() => search(searchTerm.toLowerCase())}>🔍</button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
            {copyoproducts.map((product) => {
                return (
                  <Link href={`/products/${product.id}`} key={product.id} className="w-fit p-4 bg-gray-50 rounded-xl border border-gray-400">
                        <img src={product.thumbnail}></img>
                        <p>{product.title}</p>
                        <p>{product.rating} stars</p>
                        <p>Brand: {product.brand}</p>
                        <p>Category: {product.category}</p>
                        <p>Stock: {product.stock}</p>
                        <p className="text-2xl">{product.price}$</p>
                  </Link>
                )
            })}
            </div>
            <div className="flex justify-between w-12">
                <button onClick={backward}>{'<'}</button>
                <p>{count}/{maxCount}</p>
                <button onClick={forward}>{'>'}</button>  
            </div>
        </div>
    )
}