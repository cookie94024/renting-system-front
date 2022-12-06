import Image from 'next/image'
const products = [
  {
    id: 1,
    name: '吳季蓁',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423037',
  },
  {
    id: 2,
    name: '杜俊甫',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423012',
  },
  {
    id: 3,
    name: '謝侑廷',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423035',
  },
  {
    id: 4,
    name: '楊于璇',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423047',
  },
  {
    id: 5,
    name: '劉宇蓁',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423049',
  },
  {
    id: 6,
    name: '李泳輝',
    href: '#',
    imageSrc: "/logo.png",
    imageAlt: "Front of men's Basic Tee in black.",
    price: '111423040',
  },

]

export default function Example() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl py-16 px-4 sm:py-2 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Group Members</h2>

        <div className="mt-6 grid gap-4 gap-x-6 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                <Image
                 
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  width ={500}
                  height={900}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
