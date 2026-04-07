// import Image from "next/image";
// import Link from "next/link";

// const cars = [
//   {
//     id: 1,
//     name: "BMW X5",
//     type: "SUV • 2006",
//     price: "$300 / day",
//     image: "/cars/bmw.jpg",
//   },
//   {
//     id: 2,
//     name: "Toyota Corolla",
//     type: "Sedan • 2021",
//     price: "$130 / day",
//     image: "/cars/corolla.jpg",
//   },
//   {
//     id: 3,
//     name: "BMW X5",
//     type: "SUV • 2006",
//     price: "$300 / day",
//     image: "/cars/bmw.jpg",
//   },
// ];

// export default function FeaturedCars() {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4">

//         {/* Heading */}
//         <h2 className="text-3xl font-bold text-center mb-2">
//           Featured Vehicles
//         </h2>
//         <p className="text-gray-500 text-center mb-10">
//           Explore our selection of premium vehicles available for your next adventure.
//         </p>

//         {/* Cards */}
//         <div className="grid md:grid-cols-3 gap-8">
//           {cars.map((car) => (
//             <div
//               key={car.id}
//               className="bg-white rounded-xl shadow hover:shadow-lg transition"
//             >
//               <div className="relative">
//                 <Image
//                   src={car.image}
//                   alt={car.name}
//                   width={400}
//                   height={250}
//                   className="rounded-t-xl object-cover"
//                 />
//                 <span className="absolute top-3 left-3 bg-blue-600 text-white text-sm px-3 py-1 rounded">
//                   Available Now
//                 </span>
//                 <span className="absolute bottom-3 right-3 bg-black text-white text-sm px-3 py-1 rounded">
//                   {car.price}
//                 </span>
//               </div>

//               <div className="p-4">
//                 <h3 className="font-semibold text-lg">{car.name}</h3>
//                 <p className="text-gray-500 text-sm">{car.type}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Explore More Button */}
//         <div className="text-center mt-12">
//           <Link
//             href="/cars"
//             className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-black transition"
//           >
//             Explore More Cars
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

