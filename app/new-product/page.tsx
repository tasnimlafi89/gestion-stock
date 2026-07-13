"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs';
import { Category } from '@/src/generated/prisma/client';
import { FormDataType } from '@/type';
import { readCategory } from '../action';

const page = () => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string;

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        unit: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (email) {
                    const data = await readCategory(email);
                    if (data)
                        setCategories(data)
                }
            } catch (error) {
                console.error("Erreur lors du chargement des catégories", error)
            }
        }
        fetchCategories();
    }, [email])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile)
        if (selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    
    return (
        <Wrapper>
            <div className='flex justify-cenetr items-center'>
                <div>
                    <h1 className="text-3xl font-bold mb-4">
                        créer un produit
                    </h1>
                    <section className="flex md:flex-row flex-col">
                        <div className="space-y-4 md:w-[450px]">
                            <input
                                type="text"
                                name="name"
                                id=""
                                placeholder="Nom"
                                className="input input-bordered w-full"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <textarea
                                name="description"
                                id=""
                                placeholder="Description"
                                className="textarea textarea-bordered w-full h-[100px]"
                                onChange={handleChange}
                            />
                            <input
                                type="number"
                                name="price"
                                id=""
                                placeholder="prix"
                                className="input input-bordered w-full"
                                value={formData.price}
                                onChange={handleChange}
                            />
                            <select
                                name="categoryId"
                                id=""
                                className="select select-bordered w-full"
                                value={formData.categoryId}
                                onChange={handleChange} 
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map((cat) => {
                                    return <option
                                        key={cat.id}
                                        value={cat.name}
                                    >
                                        {cat.name}
                                    </option>
                                })}
                            </select>
                            <input 
                            type="file" 
                            accept="image/"
                            id=""
                            className="file-input file-input-bordered w-full"
                            onChange={handleFileChange}
                            />
                            <button className="btn btn-primary">
                                Créer le produit
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </Wrapper>
    )
}

export default page
