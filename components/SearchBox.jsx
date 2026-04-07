export default function SearchBox() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex gap-4 items-center">
      
      <input
        type="text"
        placeholder="Pickup Location"
        className="border p-2 rounded w-40"
      />

      <input
        type="date"
        className="border p-2 rounded"
      />

      <input
        type="date"
        className="border p-2 rounded"
      />

      <button className="bg-blue-600 text-white px-6 py-2 rounded">
        Search
      </button>
    </div>
  );
}

