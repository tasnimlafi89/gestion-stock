"use server"

import { Category } from "@/src/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { FormDataType, Product } from "@/type";
import { promises } from "dns";

export async function checkAndAddAssociation(email: string, name: string) {
    if (!email) return;
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email,
            }
        })
        if (!existingAssociation && name) {
            await prisma.association.create({
                data: {
                    email,
                    name,
                }
            })
        }
    } catch (error) {
        console.error(error)

    }
}

export async function getAssociation(email: string) {
    if (!email) return
    try {
        const existingAssociation = await prisma.association.findUnique({
            where: {
                email,
            }
        })
        return existingAssociation
    } catch (error) {
        console.error(error)
    }
}

export async function createCategory(
    name: string,
    email: string,
    description?: string,
) {
    if (!name) return
    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        await prisma.category.create({
            data: {
                name,
                description: description || "",
                associationId: association.id,
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function updateCategory(
    id: string,
    name: string,
    email: string,
    description?: string,
) {
    if (!id || !name || !email) {
        throw new Error("L'id, le nom et l'email de l'association sont requis pour la mise à jour de la catégorie.")
    }
    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        await prisma.category.update({
            where: {
                id: id,
                associationId: association.id,
            },
            data: {
                name,
                description: description || "",
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function deleteCategory(id: string, email: string) {
    if (!id || !email) {
        throw new Error("L'id et l'email de l'association sont requis pour la suppression de la catégorie.")
    }
    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        await prisma.category.delete({
            where: {
                id: id,
                associationId: association.id,
            }
        })
    } catch (error) {
        console.error(error)
    }

}

export async function readCategory(email: string): Promise<Category[] | undefined> {
    if (!email) {
        throw new Error("L'email de l'association est requis pour la lecture de la catégorie.")
    }
    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        const categories = await prisma.category.findMany({
            where: {
                associationId: association.id,
            }
        })
        return categories
    } catch (error) {
        console.error(error)
    }
}


export async function createProduct(formData: FormDataType, email: string) {
    try {
        const { name, description, price, imageUrl, categoryId, unit } = formData
        if (!email || !price || !categoryId) {
            throw new Error("L'email, le prix et l'id de catégorie sont requis pour la création du produit.")
        }

        const safeImageUrl = imageUrl || ""
        const safeUnit = unit || ""

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }

        await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                imageUrl: safeImageUrl,
                unit: safeUnit,
                categoryId: categoryId,
                associationId: association.id,
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function updateProduct(formData: FormDataType, email: string) {
    try {
        const { id, name, description, price, imageUrl } = formData
        if (!email || !price || !id) {
            throw new Error("L'email, le prix et l'id sont requis pour la mise à jour du produit.")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }

        await prisma.product.update({
            where: {
                id: id,
                associationId: association.id,
            },
            data: {
                name,
                description,
                price: Number(price),
                imageUrl: imageUrl || "",
            }
        })
    } catch (error) {
        console.error(error)
    }

}

export async function deleteProduct(id: string, email: string) {
    if (!id) {
        throw new Error("L'id est requis pour la suppression du produit.")
    }
    try {
        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        await prisma.product.delete({
            where: {
                id: id,
                associationId: association.id,
            }
        })
    } catch (error) {
        console.error(error)
    }
}

export async function readProducts(email: string): Promise<Product[] | undefined> {
    try {
        if (!email) {
            throw new Error("L'email de l'association est requis pour la lecture du produit.")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        const products = await prisma.product.findMany({
            where: {
                associationId: association.id,
            },
            include: {
                category: true,
            }
        })
        return products.map(product => ({
            ...product,
            categoryName: product.category?.name || "",
        }))
    } catch (error) {
        console.error(error)
    }
}

export async function readProductById(productId:string,email:string): Promise<Product | undefined> {
    try {
        if (!email) {
            throw new Error("L'email de l'association est requis pour la lecture du produit.")
        }

        const association = await getAssociation(email)
        if (!association) {
            throw new Error("Aucune association trouvé avec cet email.")
        }
        const product = await prisma.product.findUnique({
            where: {
                id:productId,
                associationId:association.id,
            },
            include: {
                category: true,
            }
        })
        if(!product){
            return undefined
        }
        return ({
            ...product,
            categoryName: product.category?.name || "",
        })
    } catch (error) {
        console.error(error)
    }

}
