"use client"
import Link from "next/link";
import { useEffect, useState } from "react"

export default function Home() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    }, []);
    return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="border-2 border-gray-200 rounded-md flex gap-4 p-2 flex-col items-center w-fit">
        <p className="text-2xl">Cart</p>
        <div className="flex flex-col gap-4 w-250">
          <div className="grid grid-cols-4 gap-2">
            {cart.map((item, index) => {
                return (
                    <Link href={`/products/${item.id}`} key={index} className="w-fit p-4 bg-gray-50 rounded-xl border border-gray-400">
                        <img src={item.thumbnail}></img>
                        <p>{item.title}</p>
                        <p>{item.rating} stars</p>
                        <p>Brand: {item.brand}</p>
                        <p>Category: {item.category}</p>
                        <p>Selected option: {item.option}</p>
                        <p className="text-2xl">{item.price}$</p>
                  </Link>
                )
            })}
          </div>
        </div>
      </div>
    </div>
    )
}