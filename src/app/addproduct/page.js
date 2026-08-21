"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase/client";

export default function Home() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailLocal, setThumbnailLocal] = useState(null);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [optionsInput, setOptionsInput] = useState("");
  const [options, setOptions] = useState([]);

  const AddToArray = (input) => {
    if (input.trim() == "") return;
    setOptions([...options, input]);
    setOptionsInput("");
  };

  const HandleAdd = async () => {
    let finalThumbnailUrl = thumbnail;

      if (thumbnailLocal) {
        const fileExt = thumbnailLocal.name.split(".").pop();
        const fileName = `${Date.now()}`;

        const { data: storageData, error: storageError } = await supabase.storage.from("product-images").upload(fileName, thumbnailLocal);

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
        finalThumbnailUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          title: title,
          price: price,
          brand: brand,
          category,
          stock: stock,
          thumbnail: finalThumbnailUrl,
          description,
          rating: rating,
          options,
        })
        .select();

      if (error) {
        console.log("error: ", error)
        return
      }
      console.log("Success:", data);

      setTitle("");
      setPrice("");
      setBrand("");
      setCategory("");
      setStock("");
      setThumbnail("");
      setThumbnailLocal(null);
      setDescription("");
      setRating("");
      setOptions([]);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="border-2 border-gray-200 rounded-md flex gap-4 p-2 flex-col items-center w-100">
        <p className="text-2xl">Add product</p>
        
        <div className="flex flex-col gap-4 w-90">
          <input placeholder="title" value={title} onChange={(event) => setTitle(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="price" value={price} onChange={(event) => setPrice(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="brand" value={brand} onChange={(event) => setBrand(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="category" value={category} onChange={(event) => setCategory(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="stock" value={stock} onChange={(event) => setStock(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          
          <div className="w-90 flex flex-col items-center gap-2">
            <input placeholder="thumbnail url" value={thumbnail} onChange={(event) => setThumbnail(event.target.value)} disabled={thumbnailLocal} className="border border-gray-200 rounded-md px-2 py-1 w-90 disabled:bg-gray-100" />
            <p>OR</p>
            <input type="file" onChange={(event) => setThumbnailLocal(event.target.files[0])} disabled={thumbnail} className="border border-gray-200 rounded-md px-2 py-1 w-90 disabled:bg-gray-100" />
          </div>

          <input placeholder="description" value={description} onChange={(event) => setDescription(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="rating" value={rating} onChange={(event) => setRating(event.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          
          <div className="flex flex-col gap-1">
            <div className="flex">
              <input placeholder="options" value={optionsInput} onChange={(event) => setOptionsInput(event.target.value)} className="border w-55 border-gray-200 rounded-s-md px-2 py-1" />
              <button onClick={() => AddToArray(optionsInput)} className="flex items-center justify-center px-3 py-1.5 font-bold text-white bg-[#1a1a1a] rounded-e-md hover:cursor-pointer transition-all duration-300">Add to options</button>
            </div>
           
          </div>
        </div>

        <button onClick={HandleAdd} className="flex items-center justify-center px-3 py-1.5 font-bold text-white bg-[#1a1a1a] rounded-md hover:cursor-pointer transition-all duration-300">Add product</button>
      </div>
    </div>
  );
}
