"use client"
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs';
import { Category } from '@/src/generated/prisma/client';
import { FormDataType } from '@/type';
import { createProduct, readCategory } from '../action';
import { FileImage } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import RequireAuth from '../components/RequireAuth';

const page = () => {
    const { isLoaded, user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string;

    const router = useRouter()
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [initialLoading, setInitialLoading] = useState(true)
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        imageUrl: ""
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
            } finally {
                setInitialLoading(false)
            }
        }
        if (isLoaded) {
            fetchCategories();
        }
    }, [email, isLoaded])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile)
        if (selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile));
    }

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Veuillez sélectionner une image pour le produit.");
            return
        }
        try {

            const imageData = new FormData();
            imageData.append("file", file);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: imageData
            })

            const data = await res.json()
            if (!data.success) {
                throw new Error("Erreur lors de l'upload de l'image.")
            } else {
                formData.imageUrl = data.path
                await createProduct(formData, email)
                toast.success("Produit ajouté avec succès.");
                router.push("/products")
            }


        } catch (error) {
            console.log(error)
            toast.error("Erreur lors de la création du produit.");

        }
    }
    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen w-full">
                <span className="loading loading-ring" style={{ width: '3rem', height: '3rem' }}></span>
            </div>
        )
    }
    return (
        <RequireAuth>
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
                                        value={cat.id}
                                    >
                                        {cat.name}
                                    </option>
                                })}
                            </select>
                            <input
                                type="file"
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                                onChange={handleFileChange}
                            />
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Créer le produit
                            </button>
                        </div>
                        <div className="md:ml-4 md:w-[300px] mt-4 md:mt-0 border-2 border-primary md:h-[300px] p-5 flex justify-center items-center rounded-3xl">
                            {previewUrl && previewUrl !== "" ? (
                                <div>
                                    <ProductImage
                                        src={previewUrl}
                                        alt="preview"
                                        heightClass="h-40"
                                        widthClass="w-40"
                                    />
                                </div>
                            ) : (
                                <div className="wiggle-animation">
                                    <FileImage strokeWidth={1} className='h-10 w-10 text-primary' />
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </Wrapper>
        </RequireAuth>
    )
}

export default page
