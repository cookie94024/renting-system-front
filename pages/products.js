import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import ProductFilter from "../components/ProductFilter";
import { API_BASE, DEFAULT_IMAGE } from "../constants";

export default function Products({ products }) {
  const [currentType, setCurrentType] = useState(0);

  const handleChangeType = (id) => {
    setCurrentType(id);
  };

  const filteredProducts = products.filter((product) => {
    if (currentType === 0) return true;
    return product.product_type?.includes(currentType);
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-2 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>
          <ProductFilter value={currentType} onChange={handleChangeType} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <img
                  src={DEFAULT_IMAGE}
                  alt="product image"
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link href={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.product_name}
                    </Link>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${product.product_price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async (ctx) => {
  const { data: products } = await axios.get(API_BASE + "/api/product"); // your fetch function here

  return {
    props: {
      products,
    },
  };
};
