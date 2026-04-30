const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Tax Sahayak</h1>
      <nav className="space-y-2">
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Home</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Chat Assistant</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700">Calculators</a>
      </nav>
    </aside>
  );
};

export default Sidebar;
