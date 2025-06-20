import { useState } from "react";
import { FileText, Layout, Menu, X, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg hover:bg-gray-100"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col h-full w-64 bg-white shadow-lg">
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-xl font-bold text-gray-800">
              Cell Annotation
            </span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">File Annotation</span>
            </Link>

            <Link
              to="/genetoannotation"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/genetoannotation")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Layout className="w-5 h-5 mr-3" />
              <span className="font-medium">Gene to Annotation</span>
            </Link>

            <Link
              to="/documentation"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive("/documentation")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span className="font-medium">Documentation</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
