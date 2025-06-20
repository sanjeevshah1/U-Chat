import React, { useState } from "react";
import { Contact, Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import Chat from "../Components/Chat";
import useChatStore from "../store/useChatStore";

export type FilterOptions = "online" | "all";

export interface sidebarProps {
  filter: FilterOptions;
  isOpen: boolean;
  onClose: () => void;
}

const Homepage = () => {
  const [filter, setFilter] = useState<FilterOptions>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedChat } = useChatStore();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.checked ? "online" : "all");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80">
        <Sidebar
          filter={filter}
          isOpen={true}
          onClose={() => {}}
          onFilterChange={handleChange}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          filter={filter}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onFilterChange={handleChange}
          showCloseButton={true}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Mobile header - only show when sidebar is closed */}
        {!sidebarOpen && (
          <header className="md:hidden flex bg-white px-4 py-3 items-center gap-3 border-b border-gray-200">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-black hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Contact className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-semibold text-gray-900">Contacts</h1>
          </header>
        )}

        {/* Chat Content */}
        <div className="flex-1 flex items-start justify-center">
          {selectedChat ? (
            <Chat />
          ) : (
            <div className="text-center text-gray-500 p-8 my-auto">
              <Contact className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a contact</h3>
              <p className="text-sm">Choose a contact to start chatting</p>

              {/* Mobile: Show contacts button */}
              <button
                onClick={toggleSidebar}
                className="md:hidden mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Contacts
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Homepage;
