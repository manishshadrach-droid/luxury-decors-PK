export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Product } from "@prisma/client"

interface PageProps {
  params: {
    name: string
  }
}

export default async function CategoryPage({ params }: PageProps) {

  const { name } = params

  let products: Product[] = []

  try {
    products = await prisma.product.findMany({
      where: {
        category: name,
      },
    })
  } catch (error) {
    console.error("Category fetch failed:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-10 capitalize">
          {name} Collection
        </h1>

        <div className="grid md:grid-cols-3 gap-8">

          {products.map((product) => (

            <Link
              key={product.id}
              href={`/product/${product.slug}`}
            >

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                <img
                  src={product.images?.[0] || "/product/mandala1.jpg"}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="font-semibold">₹ {product.price}</p>
                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>
  )
}