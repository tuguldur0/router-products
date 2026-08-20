"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabase/client";

export default function Home() {
  // Initialize state with default values
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

  // Fix state mutation using spread operator
  const AddToArray = (input) => {
    if (!input.trim()) return;
    setOptions([...options, input]);
    setOptionsInput("");
  };

  const HandleAdd = async () => {
    let finalThumbnailUrl = thumbnail;

    try {
      // 1. If a local file exists, upload it to Supabase Storage first
      if (thumbnailLocal) {
        // Create a unique file name to avoid collisions
        const fileExt = thumbnailLocal.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from("product-images")
          .upload(fileName, thumbnailLocal);

        if (storageError) throw storageError;

        // Get the public URL of the uploaded image
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        finalThumbnailUrl = urlData.publicUrl;
      }

      // 2. Insert the product entry into the database table
      const { data, error } = await supabase
        .from("products")
        .insert({
          title,
          price: parseFloat(price) || 0, // Ensure numbers are stored correctly
          brand,
          category,
          stock: parseInt(stock) || 0,
          thumbnail: finalThumbnailUrl,
          description,
          rating: parseFloat(rating) || 0,
          options,
        })
        .select();

      if (error) throw error;
      console.log("Success:", data);

      // 3. Reset form state on success
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
      
    } catch (err) {
      console.error("Error operational flow failed:", err.message || err);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="border-2 border-gray-200 rounded-md flex gap-4 p-2 flex-col items-center w-100">
        <p className="text-2xl">Add product</p>
        
        <div className="flex flex-col gap-4 w-90">
          <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="price" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          
          <div className="w-90 flex flex-col items-center gap-2">
            <input placeholder="thumbnail URL" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} disabled={!!thumbnailLocal} className="border border-gray-200 rounded-md px-2 py-1 w-90 disabled:bg-gray-100" />
            <p>OR</p>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailLocal(e.target.files[0])} disabled={!!thumbnail} className="border border-gray-200 rounded-md px-2 py-1 w-90 disabled:bg-gray-100" />
          </div>

          <input placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          <input placeholder="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="border border-gray-200 rounded-md px-2 py-1" />
          
          <div className="flex flex-col gap-1">
            <div className="flex">
              <input placeholder="options" value={optionsInput} onChange={(e) => setOptionsInput(e.target.value)} className="border w-55 border-gray-200 rounded-s-md px-2 py-1" />
              <button onClick={() => AddToArray(optionsInput)} className="flex items-center justify-center px-3 py-1.5 font-bold text-white bg-[#1a1a1a] rounded-e-md hover:cursor-pointer transition-all duration-300">Add to options</button>
            </div>
           
          </div>
        </div>

        <button onClick={HandleAdd} className="flex items-center justify-center px-3 py-1.5 font-bold text-white bg-[#1a1a1a] rounded-md hover:cursor-pointer transition-all duration-300">Add product</button>
      </div>
    </div>
  );
}
